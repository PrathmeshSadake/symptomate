import { atom } from "jotai";
import { FormState, UserType, SymptomResult } from "@/types/form";

export const stepAtom = atom<FormState["step"]>("welcome");
export const acceptedTermsAtom = atom(false);
export const userTypeAtom = atom<UserType | null>(null);
export const userDetailsAtom = atom<FormState["userDetails"]>({
  name: "",
  hospitalName: "",
  patientName: "",
  insurancePolicyNumber: "",
});
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
export const specialistAtom = atom<string | null>(null);
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

// Pre-defined set of specialists
export const predefinedSpecialistsAtom = atom<string[]>([
  "General Practitioner",
  "Cardiologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedist",
  "Dermatologist",
  "Gynecologist",
  "Ophthalmologist",
  "Psychiatrist",
  "Oncologist",
]);
