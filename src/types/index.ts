export interface Prediction {
  name: string;
  go: string;
  score: string;
}

export interface SequenceBasedFlags {
  mf: boolean;
  bp: boolean;
  ec: boolean;
}

export interface ProcessingResult {
  fileName: string;
  proteinId: string;
  molecularFunction: Prediction[];
  biologicalProcess: Prediction[];
  enzymeCommission: Prediction[];
  usedSequenceBased: SequenceBasedFlags;
}

export type ProgressCallback = (message: string, progress?: number) => void;

export interface ProcessingConfig {
  pdbFolderPath: string;
  outputFolderPath: string;
  zipFilePath?: string;
}

export interface Statistics {
  totalProteins: number;
  sequenceBasedPredictions: number;
  structureBasedPredictions: number;
}
