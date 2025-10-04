import puppeteer from "puppeteer";
import * as XLSX from "xlsx";
import { readdir, readFile, mkdir, copyFile } from "fs/promises";
import { join } from "path";

class DeepFRIAutomator {
  private browser: any;
  private page: any;

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-maximized"],
      protocolTimeout: 300000,
    });
    this.page = await this.browser.newPage();
    await this.page.goto("https://beta.deepfri.flatironinstitute.org", {
      waitUntil: "networkidle2",
    });
    await this.page.waitForTimeout(8000);
  }

  async clickByText(text: string): Promise<boolean> {
    return await this.page.evaluate((searchText: string) => {
      const elements = Array.from(document.querySelectorAll("*"));
      for (const el of elements) {
        if (el.textContent?.trim() === searchText) {
          (el as HTMLElement).click();
          return true;
        }
      }
      return false;
    }, text);
  }

  async uploadZipFile(): Promise<boolean> {
    try {
      console.log('1. Clicking "Predict Functions" tab...');
      const predictClicked = await this.clickByText("Predict Functions");
      if (!predictClicked) {
        console.log('Could not find "Predict Functions" tab');
        return false;
      }
      await this.page.waitForTimeout(3000);

      console.log('2. Clicking "I have a ZIP file of many structure files"...');
      const zipOptionClicked = await this.clickByText(
        "I have a ZIP file of many structure files"
      );
      if (!zipOptionClicked) {
        console.log("Could not find ZIP file option");
        return false;
      }
      await this.page.waitForTimeout(2000);

      console.log('3. Clicking "Add a zip file"...');
      const addZipClicked = await this.clickByText("Add a zip file");
      if (!addZipClicked) {
        console.log('Could not find "Add a zip file" button');
        return false;
      }
      await this.page.waitForTimeout(2000);

      console.log("4. Uploading zip file...");
      const fileInput = await this.page.$('input[type="file"]');
      if (!fileInput) {
        console.log("File input not found");
        return false;
      }
      await fileInput.uploadFile("pdb_files.zip");
      await this.page.waitForTimeout(5000);

      console.log("5. Waiting for upload to complete...");
      await this.page.waitForFunction(
        () => {
          const text = document.body.textContent || "";
          return (
            !text.includes("uploading") && !text.includes("processing upload")
          );
        },
        { timeout: 120000 }
      );

      console.log('6. Clicking "Upload & Predict"...');
      const uploadPredictClicked = await this.clickByText("Upload & Predict");
      if (!uploadPredictClicked) {
        console.log('Could not find "Upload & Predict" button');
        return false;
      }

      console.log('7. Waiting for "Prediction enqueued" message...');
      await this.page.waitForFunction(
        () => {
          const text = document.body.textContent || "";
          return text.includes(
            "Prediction enqueued. Check the dashboard for status."
          );
        },
        { timeout: 600000 }
      ); // 10 minutes

      console.log('8. Clicking "To dashboard" link...');
      const toDashboardClicked = await this.clickByText("To dashboard");
      if (!toDashboardClicked) {
        console.log('Could not find "To dashboard" link');
        return false;
      }

      console.log("9. Waiting 10 seconds...");
      for (let i = 10; i > 0; i--) {
        console.log(`Waiting ${i} seconds...`);
        await this.page.waitForTimeout(1000);
      }

      console.log("✓ Ready to process table!");
      return true;
    } catch (error) {
      console.error("Upload error:", error);
      return false;
    }
  }

  async navigateToDashboard(): Promise<boolean> {
    try {
      console.log("Navigating to Dashboard...");
      const dashboardClicked = await this.clickByText("Dashboard");
      if (!dashboardClicked) {
        console.log('Could not find "Dashboard" tab');
        return false;
      }
      await this.page.waitForTimeout(3000);
      return true;
    } catch (error) {
      console.error("Dashboard error:", error);
      return false;
    }
  }

  async waitForTable(): Promise<boolean> {
    try {
      console.log("Waiting for table to load...");
      await this.page.waitForFunction(
        () => {
          return document.querySelector("table") !== null;
        },
        { timeout: 30000 }
      );
      console.log("✓ Table loaded!");
      return true;
    } catch (error) {
      console.error("Table loading error:", error);
      return false;
    }
  }

  async getTableRowCount(): Promise<number> {
    return await this.page.evaluate(() => {
      const table = document.querySelector("table");
      if (table) {
        const rows = table.querySelectorAll("tr");
        return Math.max(0, rows.length - 1); // Exclude header
      }
      return 0;
    });
  }

  async clickTableRow(rowIndex: number): Promise<boolean> {
    return await this.page.evaluate((index: number) => {
      const table = document.querySelector("table");
      if (table) {
        const rows = table.querySelectorAll("tr");
        const targetRow = rows[index + 1]; // +1 to skip header
        if (targetRow) {
          (targetRow as HTMLElement).click();
          return true;
        }
      }
      return false;
    }, rowIndex);
  }

  async downloadTags(fileName: string): Promise<boolean> {
    try {
      // Set download path with absolute path
      const client = await this.page.target().createCDPSession();
      const downloadPath = join(process.cwd(), "output", "tags");
      await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: downloadPath,
      });

      // Get list of files before download
      const filesBefore = await readdir("output/tags").catch(() => []);

      // Look for Tags section and Download button with better targeting
      const downloadClicked = await this.page.evaluate(() => {
        // First, find Tags section
        const allElements = Array.from(document.querySelectorAll("*"));
        const tagsElements = allElements.filter(
          (el) => el.textContent?.includes("Tags") && el.textContent.length < 50
        );

        if (tagsElements.length === 0) return false;

        // Look for download buttons near Tags sections
        for (const tagsEl of tagsElements) {
          const container =
            tagsEl.closest("div, section, article") || tagsEl.parentElement;
          if (container) {
            const downloadBtns = container.querySelectorAll(
              'button, a, [role="button"]'
            );
            for (const btn of downloadBtns) {
              const text = btn.textContent?.trim().toLowerCase() || "";
              if (text === "download" || text.includes("download")) {
                (btn as HTMLElement).click();
                return true;
              }
            }
          }
        }
        return false;
      });

      if (downloadClicked) {
        await this.page.waitForTimeout(5000);

        // Find the new file and rename it
        const filesAfter = await readdir("output/tags").catch(() => []);
        const newFiles = filesAfter.filter((f) => !filesBefore.includes(f));

        if (newFiles.length > 0) {
          const downloadedFile = newFiles[0];
          const oldPath = join("output/tags", downloadedFile);
          const newPath = join("output/tags", `${fileName}.json`);

          try {
            await copyFile(oldPath, newPath);
            await readFile(oldPath).then(() => {
              // Delete old file after successful copy
              require("fs").unlinkSync(oldPath);
            });
            console.log(`✓ Downloaded and renamed tags for ${fileName}`);
          } catch (renameError) {
            console.log(`✓ Downloaded tags for ${fileName} (rename failed)`);
          }
        } else {
          console.log(`✓ Downloaded tags for ${fileName}`);
        }
        return true;
      } else {
        console.log(`⚠ No download button found for ${fileName}`);
        return false;
      }
    } catch (error) {
      console.error(`Tags download error for ${fileName}:`, error);
      return false;
    }
  }

  async extractProteinData(): Promise<any> {
    await this.page.waitForTimeout(8000);

    return await this.page.evaluate(() => {
      const extractTop3Predictions = (sectionName: string) => {
        // Find all tables on the page
        const tables = Array.from(document.querySelectorAll("table"));

        // Look for section header in the page
        const sectionHeader = `${sectionName} - GO Term Predictions`;
        const allElements = Array.from(document.querySelectorAll("*"));

        const sectionEl = allElements.find((el) => {
          const text = el.textContent?.trim() || "";
          return (
            text.includes(sectionHeader) &&
            !text.includes("No predictions above threshold")
          );
        });

        if (!sectionEl) return [];

        // Find the closest table to this section
        let closestTable: any = null;
        let minDistance = Infinity;

        tables.forEach((table) => {
          // Calculate rough distance by DOM position
          const sectionRect = sectionEl.getBoundingClientRect();
          const tableRect = table.getBoundingClientRect();
          const distance = Math.abs(tableRect.top - sectionRect.bottom);

          if (distance < minDistance && tableRect.top > sectionRect.top) {
            minDistance = distance;
            closestTable = table;
          }
        });

        if (!closestTable) {
          return [];
        }

        const rows = closestTable.querySelectorAll("tr");
        const results = [];

        // Get first 3 data rows (skip header)
        for (let i = 1; i <= Math.min(3, rows.length - 1); i++) {
          const row = rows[i];
          const cells = Array.from(row.querySelectorAll("td"));
          if (cells.length >= 3) {
            results.push({
              name: cells[0]?.textContent?.trim() || "",
              go: cells[1]?.textContent?.trim() || "",
              score: cells[2]?.textContent?.trim() || "",
            });
          }
        }

        return results;
      };

      const proteinId = window.location.pathname.split("/").pop() || "";

      // Try structure-based first, fallback to sequence-based
      const structMF = extractTop3Predictions(
        "Structure-Based Molecular Function"
      );
      const structBP = extractTop3Predictions(
        "Structure-Based Biological Process"
      );
      const structEC = extractTop3Predictions(
        "Structure-Based Enzyme Commission"
      );

      const seqMF = extractTop3Predictions("Sequence-Based Molecular Function");
      const seqBP = extractTop3Predictions("Sequence-Based Biological Process");
      const seqEC = extractTop3Predictions("Sequence-Based Enzyme Commission");

      return {
        proteinId: proteinId.replace(/[^A-Za-z0-9]/g, ""),
        molecularFunction:
          structMF.length > 0 ? structMF.slice(0, 3) : seqMF.slice(0, 3),
        biologicalProcess:
          structBP.length > 0 ? structBP.slice(0, 3) : seqBP.slice(0, 3),
        enzymeCommission:
          structEC.length > 0 ? structEC.slice(0, 3) : seqEC.slice(0, 3),
        usedSequenceBased: {
          mf: structMF.length === 0 && seqMF.length > 0,
          bp: structBP.length === 0 && seqBP.length > 0,
          ec: structEC.length === 0 && seqEC.length > 0,
        },
      };
    });
  }

  countAminoAcids(pdbContent: string): number {
    const lines = pdbContent.split("\n");
    const atomLines = lines.filter((line) => line.startsWith("ATOM"));
    const residues = new Set<string>();

    atomLines.forEach((line) => {
      const residueNum = line.substring(22, 26).trim();
      const chainId = line.substring(21, 22);
      residues.add(`${chainId}_${residueNum}`);
    });

    return residues.size;
  }

  async processAllProteins(): Promise<any[]> {
    const results: any[] = [];

    // Upload and process (this now includes going to dashboard)
    const uploaded = await this.uploadZipFile();
    if (!uploaded) return results;

    // Wait for table to load
    const tableReady = await this.waitForTable();
    if (!tableReady) return results;

    // Get row count
    const rowCount = await this.getTableRowCount();
    console.log(`Found ${rowCount} protein rows`);

    // Get PDB file names for mapping
    const pdbFiles = await readdir("pdb_files");
    const sortedPdbFiles = pdbFiles.sort(); // Ensure consistent order

    // Process each row
    for (let i = 0; i < rowCount; i++) {
      console.log(`\nProcessing protein ${i + 1}/${rowCount}...`);

      const clicked = await this.clickTableRow(i);
      if (!clicked) {
        console.log(`Failed to click row ${i + 1}`);
        continue;
      }

      console.log("Waiting for navigation to complete...");
      await this.page.waitForTimeout(8000);

      const extracted = await this.extractProteinData();
      if (extracted && extracted.proteinId) {
        // Use the PDB file name based on the row index (assuming same order)
        const pdbFileName = sortedPdbFiles[i] || `${extracted.proteinId}.pdb`;
        const fileNameWithoutExt = pdbFileName.replace(".pdb", "");

        // Download tags
        await this.downloadTags(fileNameWithoutExt);

        results.push({
          fileName: fileNameWithoutExt,
          proteinId: extracted.proteinId,
          molecularFunction: extracted.molecularFunction,
          biologicalProcess: extracted.biologicalProcess,
          enzymeCommission: extracted.enzymeCommission,
          usedSequenceBased: extracted.usedSequenceBased,
        });

        console.log(`✓ Extracted data for ${fileNameWithoutExt}`);
        console.log(
          `  - MF: ${extracted.molecularFunction.length} predictions`
        );
        console.log(
          `  - BP: ${extracted.biologicalProcess.length} predictions`
        );
        console.log(`  - EC: ${extracted.enzymeCommission.length} predictions`);
      }

      // Return to dashboard for next protein
      if (i < rowCount - 1) {
        console.log("Returning to dashboard...");
        await this.navigateToDashboard();
        await this.waitForTable();
      }
    }

    return results;
  }

  async saveResults(results: any[]): Promise<void> {
    const formatSection = (
      predictions: any[]
    ): { names: string; gos: string; scores: string } => {
      if (predictions.length === 0) {
        return { names: "", gos: "", scores: "" };
      }
      const names = predictions.map((p: any) => p.name).join(", ");
      const gos = predictions.map((p: any) => p.go).join(", ");
      const scores = predictions.map((p: any) => p.score).join(", ");
      return { names, gos, scores };
    };

    const data = results.map((result) => {
      const mf = formatSection(result.molecularFunction);
      const bp = formatSection(result.biologicalProcess);
      const ec = formatSection(result.enzymeCommission);

      return {
        "file name": result.fileName,
        "Name ": mf.names,
        GO: mf.gos,
        Score: mf.scores,
        "Name _1": bp.names,
        GO_1: bp.gos,
        Score_1: bp.scores,
        Name_2: ec.names,
        GO_2: ec.gos,
        Score_2: ec.scores,
      };
    });

    // Create headers matching template
    const headers = [
      [
        "",
        "Molecular function",
        "",
        "",
        "Biological process",
        "",
        "",
        "Enzyme comssion",
        "",
        "",
      ],
      [
        "file name",
        "Name ",
        "GO",
        "Score",
        "Name ",
        "GO",
        "Score",
        "Name",
        "GO",
        "Score",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(headers);
    XLSX.utils.sheet_add_json(ws, data, { origin: "A3", skipHeader: true });

    // Add light red background for sequence-based results
    const lightRedFill = { fgColor: { rgb: "FFCCCC" } };

    results.forEach((result, rowIndex) => {
      const excelRow = rowIndex + 3; // +3 because of headers

      if (result.usedSequenceBased.mf && result.molecularFunction.length > 0) {
        [1, 2, 3].forEach((col) => {
          const cellRef = XLSX.utils.encode_cell({ r: excelRow - 1, c: col });
          if (ws[cellRef] && ws[cellRef].v) {
            ws[cellRef].s = { fill: lightRedFill };
          }
        });
      }

      if (result.usedSequenceBased.bp && result.biologicalProcess.length > 0) {
        [4, 5, 6].forEach((col) => {
          const cellRef = XLSX.utils.encode_cell({ r: excelRow - 1, c: col });
          if (ws[cellRef] && ws[cellRef].v) {
            ws[cellRef].s = { fill: lightRedFill };
          }
        });
      }

      if (result.usedSequenceBased.ec && result.enzymeCommission.length > 0) {
        [7, 8, 9].forEach((col) => {
          const cellRef = XLSX.utils.encode_cell({ r: excelRow - 1, c: col });
          if (ws[cellRef] && ws[cellRef].v) {
            ws[cellRef].s = { fill: lightRedFill };
          }
        });
      }
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");

    // Create output folder structure
    await mkdir("output", { recursive: true });
    await mkdir("output/tags", { recursive: true });

    XLSX.writeFile(wb, "output/deepfri_results.xlsx");
    console.log("\n✅ Results saved to output/deepfri_results.xlsx");

    const sequenceBasedCount = results.reduce((acc, r) => {
      return (
        acc +
        (r.usedSequenceBased.mf ? 1 : 0) +
        (r.usedSequenceBased.bp ? 1 : 0) +
        (r.usedSequenceBased.ec ? 1 : 0)
      );
    }, 0);

    console.log(`\n📊 Processing Summary:`);
    console.log(`- Total proteins processed: ${results.length}`);
    console.log(`- Sequence-based predictions used: ${sequenceBasedCount}`);
    console.log(
      `- Structure-based predictions used: ${
        results.length * 3 - sequenceBasedCount
      }`
    );
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

async function main() {
  const automator = new DeepFRIAutomator();

  try {
    console.log("🚀 DeepFRI Complete Workflow Automation");
    console.log("======================================");

    await automator.init();
    const results = await automator.processAllProteins();

    if (results.length > 0) {
      await automator.saveResults(results);
      console.log(`\n🎉 Successfully processed ${results.length} proteins!`);
    } else {
      console.log("\n❌ No results obtained");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await automator.close();
  }
}

main();
