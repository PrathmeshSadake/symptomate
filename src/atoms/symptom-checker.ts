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

export const predefinedSymptomsAtom = atom<{ [key: string]: string[] }>({
  basic: [
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
  ],
  "General Practitioner": [
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
  ],
  Cardiologist: [
    "Chest pain",
    "Shortness of breath",
    "Palpitations",
    "Dizziness",
    "Fainting",
    "Swelling in legs",
  ],
  Neurologist: [
    "Headache",
    "Dizziness",
    "Numbness",
    "Weakness",
    "Memory problems",
    "Seizures",
  ],
  Pediatrician: [
    "Fever",
    "Cough",
    "Runny nose",
    "Ear pain",
    "Rash",
    "Vomiting",
  ],
  Orthopedist: [
    "Joint pain",
    "Back pain",
    "Muscle weakness",
    "Swelling in joints",
    "Stiffness",
    "Fractures",
  ],
  Dermatologist: [
    "Rash",
    "Itching",
    "Acne",
    "Skin discoloration",
    "Hair loss",
    "Nail problems",
  ],
  Gynecologist: [
    "Irregular periods",
    "Pelvic pain",
    "Vaginal discharge",
    "Breast lumps",
    "Pregnancy symptoms",
    "Menopause symptoms",
  ],
  Ophthalmologist: [
    "Vision changes",
    "Eye pain",
    "Red eyes",
    "Dry eyes",
    "Floaters",
    "Light sensitivity",
  ],
  Psychiatrist: [
    "Depression",
    "Anxiety",
    "Mood swings",
    "Sleep problems",
    "Concentration issues",
    "Suicidal thoughts",
  ],
  Oncologist: [
    "Unexplained weight loss",
    "Fatigue",
    "Fever",
    "Pain",
    "Skin changes",
    "Lumps or swelling",
  ],
});

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
