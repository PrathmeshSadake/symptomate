export type FormStep =
  | "welcome"
  | "terms"
  | "patient"
  | "symptoms"
  | "symptomDetails"
  | "care"
  | "history"
  | "results";

export interface FormState {
  step: FormStep;
  acceptedTerms: boolean;
  patientType: "self" | "other" | null;
  medicalHistory: {
    recentInjury: boolean | null;
    smoking: boolean | null;
    allergies: boolean | null;
    overweight: boolean | null;
    hypertension: boolean | null;
  };
  symptoms: string[];
  careType: string | null;
}

export interface SymptomResult {
  specialist: string;
  consultationType: string;
  conditions: Array<{
    name: string;
    scientificName: string;
    evidence: "high" | "moderate" | "low";
    details?: string;
  }>;
}

export interface SymptomCheckerInput {
  patientType: string;
  medicalHistory: string[];
  symptoms: string[];
  careType: string;
}

export interface Condition {
  name: string;
  scientificName: string;
  evidenceLevel: "low" | "moderate" | "high";
  details: {
    description: string;
    symptoms: string[];
    recommendations: string[];
  };
}

export interface Specialist {
  type: string;
  consultationType: string;
  urgency: "routine" | "soon" | "urgent" | "emergency";
}

export interface SymptomAnalysis {
  recommendation: {
    summary: string;
    specialist: Specialist;
    urgencyLevel: string;
    followUpInstructions: string[];
  };
  possibleConditions: Condition[];
  carePlan: {
    recommendedCareType: string;
    nextSteps: string[];
    selfCareInstructions?: string[];
    warningSymptoms: string[];
  };
}
