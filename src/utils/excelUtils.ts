import * as ExcelJS from "exceljs";
import { join } from "path";
import type { ProcessingResult } from "../types";

interface FormattedSection {
  names: string;
  gos: string;
  scores: string;
}

export class ExcelGenerator {
  private formatSection(predictions: any[]): FormattedSection {
    if (predictions.length === 0) {
      return { names: "", gos: "", scores: "" };
    }
    const names = predictions.map((p: any) => p.name).join(", ");
    const gos = predictions.map((p: any) => p.go).join(", ");
    const scores = predictions.map((p: any) => p.score).join(", ");
    return { names, gos, scores };
  }

  async generateExcel(
    results: ProcessingResult[],
    outputPath: string
  ): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Results");

    // Define light red fill
    const lightRedFill: ExcelJS.Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFCCCC" }, // ARGB format: FF = opaque, then RRGGBB
    };

    // Headers (two rows)
    const headerRow1 = [
      "",
      "Molecular function",
      "",
      "",
      "Biological process",
      "",
      "",
      "Enzyme commission",
      "",
      "",
    ];
    const headerRow2 = [
      "File Name",
      "Name ",
      "GO",
      "Score",
      "Name",
      "GO",
      "Score",
      "Name",
      "GO",
      "Score",
    ];

    worksheet.addRow(headerRow1);
    worksheet.addRow(headerRow2);

    // Add data rows and apply conditional formatting
    results.forEach((result) => {
      const mf = this.formatSection(result.molecularFunction);
      const bp = this.formatSection(result.biologicalProcess);
      const ec = this.formatSection(result.enzymeCommission);

      const row = worksheet.addRow([
        result.fileName,
        mf.names,
        mf.gos,
        mf.scores,
        bp.names,
        bp.gos,
        bp.scores,
        ec.names,
        ec.gos,
        ec.scores,
      ]);

      // Apply light red fill if sequence-based
      if (result.usedSequenceBased.mf && result.molecularFunction.length > 0) {
        [2, 3, 4].forEach((colIndex) => {
          row.getCell(colIndex).fill = lightRedFill;
        });
      }

      if (result.usedSequenceBased.bp && result.biologicalProcess.length > 0) {
        [5, 6, 7].forEach((colIndex) => {
          row.getCell(colIndex).fill = lightRedFill;
        });
      }

      if (result.usedSequenceBased.ec && result.enzymeCommission.length > 0) {
        [8, 9, 10].forEach((colIndex) => {
          row.getCell(colIndex).fill = lightRedFill;
        });
      }
    });

    // Optional: Style header rows
    worksheet.getRow(1).height = 20;
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(2).font = { bold: true };

    // Merge header cells for categories (optional but nice)
    worksheet.mergeCells("B1:D1");
    worksheet.mergeCells("E1:G1");
    worksheet.mergeCells("H1:J1");

    const outputFile = join(outputPath, "deepfri_results.xlsx");
    await workbook.xlsx.writeFile(outputFile);

    console.log(`✅ Results saved to ${outputFile}`);
  }

  calculateStatistics(results: ProcessingResult[]) {
    const sequenceBasedCount = results.reduce((acc, r) => {
      return (
        acc +
        (r.usedSequenceBased.mf ? 1 : 0) +
        (r.usedSequenceBased.bp ? 1 : 0) +
        (r.usedSequenceBased.ec ? 1 : 0)
      );
    }, 0);

    return {
      totalProteins: results.length,
      sequenceBasedPredictions: sequenceBasedCount,
      structureBasedPredictions: results.length * 3 - sequenceBasedCount,
    };
  }
}
