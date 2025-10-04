import { app, BrowserWindow, ipcMain, dialog } from "electron";
import { join } from "path";
import { DeepFRIAutomator } from "../core/DeepfriAutomator";
import { ExcelGenerator } from "../utils/excelUtils";
import { FileUtils } from "../utils/fileUtils";
import { tmpdir } from "os";

let mainWindow: Electron.BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    // icon: join(__dirname, "../../assets/icon.png"),
    autoHideMenuBar: true,
  });

  // Load the HTML file directly
  mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle("select-pdb-folder", async () => {
  const result: any = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    title: "Select PDB Files Folder",
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const folderPath = result.filePaths[0];

  // Validate folder
  const validation = await FileUtils.validatePDBFolder(folderPath);

  return {
    path: folderPath,
    valid: validation.valid,
    pdbCount: validation.pdbCount,
    error: validation.error,
  };
});

ipcMain.handle("select-output-folder", async () => {
  const result: any = await dialog.showOpenDialog({
    properties: ["openDirectory", "createDirectory"],
    title: "Select Output Folder",
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
});

ipcMain.handle("start-processing", async (event: any, config: any) => {
  try {
    const { pdbFolderPath, outputFolderPath } = config;

    // Send progress updates
    const sendProgress = (message: string, progress?: number) => {
      mainWindow?.webContents.send("processing-progress", {
        message,
        progress,
      });
    };

    sendProgress("Preparing files...", 0);

    // Ensure output folder exists
    await FileUtils.ensureOutputFolder(outputFolderPath);

    // Create ZIP file from PDB folder
    const zipFilePath = join(tmpdir(), `deepfri_${Date.now()}.zip`);
    sendProgress("Creating ZIP file from PDB files...", 2);
    await FileUtils.createZipFromPDBFolder(pdbFolderPath, zipFilePath);

    // Initialize automator
    const automator = new DeepFRIAutomator(sendProgress);
    await automator.init();

    // Process all proteins
    sendProgress("Starting protein processing...", 5);
    const results = await automator.processAllProteins(
      pdbFolderPath,
      outputFolderPath,
      zipFilePath
    );

    // Generate Excel
    sendProgress("Generating Excel report...", 95);
    const excelGenerator = new ExcelGenerator();
    await excelGenerator.generateExcel(results, outputFolderPath);

    // Calculate statistics
    const stats = excelGenerator.calculateStatistics(results);

    // Close browser
    await automator.close();

    sendProgress("Processing complete!", 100);

    return {
      success: true,
      results,
      statistics: stats,
    };
  } catch (error: any) {
    console.error("Processing error:", error);
    mainWindow?.webContents.send("processing-error", {
      message: error.message || "An unknown error occurred",
    });
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
});
