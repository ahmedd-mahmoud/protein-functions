import * as XLSX from "xlsx";
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
    const data = results.map((result) => {
      const mf = this.formatSection(result.molecularFunction);
      const bp = this.formatSection(result.biologicalProcess);
      const ec = this.formatSection(result.enzymeCommission);

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
        "Enzyme commission",
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
      const excelRow = rowIndex + 3;

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

    const outputFile = join(outputPath, "deepfri_results.xlsx");
    XLSX.writeFile(wb, outputFile);

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
