import { readdir, mkdir } from "fs/promises";
import { join } from "path";
import archiver from "archiver";
import { createWriteStream } from "fs";

export class FileUtils {
  /**
   * Create a ZIP file from all PDB files in a folder
   */
  static async createZipFromPDBFolder(
    pdbFolderPath: string,
    outputZipPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = createWriteStream(outputZipPath);
      const archive = archiver("zip", {
        zlib: { level: 9 },
      });

      output.on("close", () => {
        console.log(`ZIP created: ${archive.pointer()} total bytes`);
        resolve();
      });

      archive.on("error", (err) => {
        reject(err);
      });

      archive.pipe(output);

      // Add all PDB files from the folder
      archive.directory(pdbFolderPath, false);

      archive.finalize();
    });
  }

  /**
   * Validate PDB folder contains .pdb files
   */
  static async validatePDBFolder(pdbFolderPath: string): Promise<{
    valid: boolean;
    pdbCount: number;
    error?: string;
  }> {
    try {
      const files = await readdir(pdbFolderPath);
      const pdbFiles = files.filter((f) => f.toLowerCase().endsWith(".pdb"));

      if (pdbFiles.length === 0) {
        return {
          valid: false,
          pdbCount: 0,
          error: "No PDB files found in the selected folder",
        };
      }

      return {
        valid: true,
        pdbCount: pdbFiles.length,
      };
    } catch (error: any) {
      return {
        valid: false,
        pdbCount: 0,
        error: error.message || "Failed to read folder",
      };
    }
  }

  /**
   * Ensure output folder exists
   */
  static async ensureOutputFolder(outputPath: string): Promise<void> {
    await mkdir(outputPath, { recursive: true });
    await mkdir(join(outputPath, "tags"), { recursive: true });
  }
}
