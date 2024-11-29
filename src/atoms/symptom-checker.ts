import { atom } from "jotai";
import { FormStep, FormState, SymptomResult } from "@/types/form";

export const stepAtom = atom<FormStep>("welcome");
export const acceptedTermsAtom = atom(false);
export const patientTypeAtom = atom<"self" | "other" | null>(null);
export const medicalHistoryAtom = atom<FormState["medicalHistory"]>({
  recentInjury: null,
  smoking: null,
  allergies: null,
  overweight: null,
  hypertension: null,
});
export const symptomsAtom = atom<string[]>([]);
export const careTypeAtom = atom<string | null>(null);
export const resultsAtom = atom<SymptomResult | null>(null);
export const symptomDetailsAtom = atom<any>({});

// Pre-defined set of symptoms
export const predefinedSymptomsAtom = atom<string[]>([
  "Headache",
  "Fever",
  "Cough",
  "Fatigue",
  "Shortness of breath",
  "Nausea",
  "Dizziness",
  "Sore throat",
  "Chest pain",
  "Abdominal pain",
]);
