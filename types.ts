
export enum DiseaseType {
  BRUCELLOSIS = 'Brucellosis',
  LEPTOSPIROSIS = 'Leptospirosis',
  RABIES = 'Rabies',
  BIRD_FLU = 'Bird Flu',
  ANTHRAX = 'Anthrax'
}

export interface Report {
  id: string;
  timestamp: string;
  location: { lat: number; lng: number; region: string };
  species: 'Human' | 'Animal';
  diseaseType: DiseaseType;
  symptoms: string[];
  severity: 'Low' | 'Medium' | 'High';
  status: 'Suspected' | 'Confirmed' | 'Recovered';
  reporter: string;
}

export interface PredictionResult {
  riskScore: number;
  explanation: string;
  recommendations: string[];
  affectedRegions: string[];
}
