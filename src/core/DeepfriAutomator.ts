import puppeteer from "puppeteer";
import { readdir, readFile, mkdir, copyFile } from "fs/promises";
import { join } from "path";
import type { ProcessingResult, ProgressCallback } from "../types";

export class DeepFRIAutomator {
  private browser: any;
  private page: any;
  private progressCallback?: ProgressCallback;

  constructor(progressCallback?: ProgressCallback) {
    this.progressCallback = progressCallback;
  }

  private updateProgress(message: string, progress?: number) {
    if (this.progressCallback) {
      this.progressCallback(message, progress);
    }
    console.log(message);
  }

  async init() {
    this.updateProgress("Initializing browser...");
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
    this.updateProgress("Browser initialized");
  }

  private async clickByText(text: string): Promise<boolean> {
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

  async uploadZipFile(zipFilePath: string): Promise<boolean> {
    try {
      this.updateProgress('Clicking "Predict Functions" tab...', 5);
      const predictClicked = await this.clickByText("Predict Functions");
      if (!predictClicked) {
        throw new Error('Could not find "Predict Functions" tab');
      }
      await this.page.waitForTimeout(3000);

      this.updateProgress("Selecting ZIP file option...", 10);
      const zipOptionClicked = await this.clickByText(
        "I have a ZIP file of many structure files"
      );
      if (!zipOptionClicked) {
        throw new Error("Could not find ZIP file option");
      }
      await this.page.waitForTimeout(2000);

      this.updateProgress('Clicking "Add a zip file"...', 15);
      const addZipClicked = await this.clickByText("Add a zip file");
      if (!addZipClicked) {
        throw new Error('Could not find "Add a zip file" button');
      }
      await this.page.waitForTimeout(2000);

      this.updateProgress("Uploading ZIP file...", 20);
      const fileInput = await this.page.$('input[type="file"]');
      if (!fileInput) {
        throw new Error("File input not found");
      }
      await fileInput.uploadFile(zipFilePath);
      await this.page.waitForTimeout(5000);

      this.updateProgress("Waiting for upload to complete...", 25);
      await this.page.waitForFunction(
        () => {
          const text = document.body.textContent || "";
          return (
            !text.includes("uploading") && !text.includes("processing upload")
          );
        },
        { timeout: 120000 }
      );

      this.updateProgress('Clicking "Upload & Predict"...', 30);
      const uploadPredictClicked = await this.clickByText("Upload & Predict");
      if (!uploadPredictClicked) {
        throw new Error('Could not find "Upload & Predict" button');
      }

      this.updateProgress("Waiting for prediction to be enqueued...", 35);
      await this.page.waitForFunction(
        () => {
          const text = document.body.textContent || "";
          return text.includes(
            "Prediction enqueued. Check the dashboard for status."
          );
        },
        { timeout: 600000 }
      );

      this.updateProgress("Navigating to dashboard...", 40);
      const toDashboardClicked = await this.clickByText("To dashboard");
      if (!toDashboardClicked) {
        throw new Error('Could not find "To dashboard" link');
      }

      await this.page.waitForTimeout(10000);
      this.updateProgress("Ready to process results!", 45);
      return true;
    } catch (error) {
      this.updateProgress(`Upload error: ${error}`, 0);
      throw error;
    }
  }

  async navigateToDashboard(): Promise<boolean> {
    const dashboardClicked = await this.clickByText("Dashboard");
    if (!dashboardClicked) {
      throw new Error('Could not find "Dashboard" tab');
    }
    await this.page.waitForTimeout(3000);
    return true;
  }

  async waitForTable(): Promise<boolean> {
    await this.page.waitForFunction(
      () => {
        return document.querySelector("table") !== null;
      },
      { timeout: 30000 }
    );
    return true;
  }

  async getTableRowCount(): Promise<number> {
    return await this.page.evaluate(() => {
      const table = document.querySelector("table");
      if (table) {
        const rows = table.querySelectorAll("tr");
        return Math.max(0, rows.length - 1);
      }
      return 0;
    });
  }

  private async clickTableRow(rowIndex: number): Promise<boolean> {
    return await this.page.evaluate((index: number) => {
      const table = document.querySelector("table");
      if (table) {
        const rows = table.querySelectorAll("tr");
        const targetRow = rows[index + 1];
        if (targetRow) {
          (targetRow as HTMLElement).click();
          return true;
        }
      }
      return false;
    }, rowIndex);
  }

  async downloadTags(
    fileName: string,
    tagsOutputPath: string
  ): Promise<boolean> {
    try {
      const client = await this.page.target().createCDPSession();
      await client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: tagsOutputPath,
      });

      const filesBefore = await readdir(tagsOutputPath).catch(() => [] as string[]);

      const downloadClicked = await this.page.evaluate(() => {
        const allElements = Array.from(document.querySelectorAll("*"));
        const tagsElements = allElements.filter(
          (el) => el.textContent?.includes("Tags") && el.textContent.length < 50
        );

        if (tagsElements.length === 0) return false;

        for (const tagsEl of tagsElements) {
          const container =
            tagsEl.closest("div, section, article") || tagsEl.parentElement;
          if (container) {
            const downloadBtns = container.querySelectorAll(
              'button, a, [role="button"]'
            );
            for (const btn of Array.from(downloadBtns)) {
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

        const filesAfter = await readdir(tagsOutputPath).catch(() => [] as string[]);
        const newFiles = filesAfter.filter((f) => !filesBefore.includes(f));

        if (newFiles.length > 0) {
          const downloadedFile = newFiles[0];
          const oldPath = join(tagsOutputPath, downloadedFile);
          const newPath = join(tagsOutputPath, `${fileName}.json`);

          try {
            await copyFile(oldPath, newPath);
            try {
              const fs = require("fs");
              fs.unlinkSync(oldPath);
            } catch (e) {
              // File already removed or doesn't exist
            }
          } catch (renameError) {
            // File copied successfully even if rename failed
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Tags download error for ${fileName}:`, error);
      return false;
    }
  }

  async extractProteinData(): Promise<any> {
    await this.page.waitForTimeout(8000);

    return await this.page.evaluate(() => {
      const extractTop3Predictions = (sectionName: string) => {
        const tables = Array.from(document.querySelectorAll("table"));
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

        let closestTable: any = null;
        let minDistance = Infinity;

        tables.forEach((table) => {
          const sectionRect = sectionEl.getBoundingClientRect();
          const tableRect = table.getBoundingClientRect();
          const distance = Math.abs(tableRect.top - sectionRect.bottom);

          if (distance < minDistance && tableRect.top > sectionRect.top) {
            minDistance = distance;
            closestTable = table;
          }
        });

        if (!closestTable) return [];

        const rows = closestTable.querySelectorAll("tr");
        const results = [];

        for (let i = 1; i <= Math.min(3, rows.length - 1); i++) {
          const row = rows[i];
          const cells = Array.from(row.querySelectorAll("td"));
          if (cells.length >= 3) {
            const cell0 = cells[0] as HTMLElement;
            const cell1 = cells[1] as HTMLElement;
            const cell2 = cells[2] as HTMLElement;
            results.push({
              name: cell0?.textContent?.trim() || "",
              go: cell1?.textContent?.trim() || "",
              score: cell2?.textContent?.trim() || "",
            });
          }
        }

        return results;
      };

      const proteinId = window.location.pathname.split("/").pop() || "";

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

  async processAllProteins(
    pdbFolderPath: string,
    outputPath: string,
    zipFilePath: string
  ): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];

    const uploaded = await this.uploadZipFile(zipFilePath);
    if (!uploaded) return results;

    await this.waitForTable();
    const rowCount = await this.getTableRowCount();
    this.updateProgress(`Found ${rowCount} proteins to process`, 50);

    const pdbFiles = await readdir(pdbFolderPath);
    const sortedPdbFiles = pdbFiles.filter((f) => f.endsWith(".pdb")).sort();

    const tagsPath = join(outputPath, "tags");
    await mkdir(tagsPath, { recursive: true });

    for (let i = 0; i < rowCount; i++) {
      const progress = 50 + Math.floor((i / rowCount) * 45);
      this.updateProgress(
        `Processing protein ${i + 1}/${rowCount}...`,
        progress
      );

      const clicked = await this.clickTableRow(i);
      if (!clicked) {
        this.updateProgress(`Failed to click row ${i + 1}`, progress);
        continue;
      }

      await this.page.waitForTimeout(8000);

      const extracted = await this.extractProteinData();
      if (extracted && extracted.proteinId) {
        const pdbFileName = sortedPdbFiles[i] || `${extracted.proteinId}.pdb`;
        const fileNameWithoutExt = pdbFileName.replace(".pdb", "");

        await this.downloadTags(fileNameWithoutExt, tagsPath);

        results.push({
          fileName: fileNameWithoutExt,
          proteinId: extracted.proteinId,
          molecularFunction: extracted.molecularFunction,
          biologicalProcess: extracted.biologicalProcess,
          enzymeCommission: extracted.enzymeCommission,
          usedSequenceBased: extracted.usedSequenceBased,
        });

        this.updateProgress(
          `✓ Extracted data for ${fileNameWithoutExt}`,
          progress
        );
      }

      if (i < rowCount - 1) {
        await this.navigateToDashboard();
        await this.waitForTable();
      }
    }

    return results;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
