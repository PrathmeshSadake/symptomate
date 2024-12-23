"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";
import { FormState, FormStep, UserType } from "@/types/form";

type FormAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_STEP"; payload: FormStep }
  | { type: "SET_TERMS"; payload: boolean }
  | { type: "SET_USER_TYPE"; payload: UserType }
  | { type: "SET_USER_DETAILS"; payload: Partial<FormState["userDetails"]> }
  | { type: "SET_PATIENT_TYPE"; payload: "self" | "other" }
  | {
      type: "UPDATE_MEDICAL_HISTORY";
      payload: Partial<FormState["medicalHistory"]>;
    }
  | { type: "ADD_SYMPTOM"; payload: string }
  | { type: "REMOVE_SYMPTOM"; payload: string }
  | { type: "SET_SYMPTOM_DETAILS"; payload: { [key: string]: any } }
  | { type: "SET_CARE_TYPE"; payload: string }
  | { type: "SET_SPECIALIST"; payload: string }
  | { type: "RESET_FORM" };

const initialState: FormState = {
  step: "welcome",
  acceptedTerms: false,
  userType: null,
  userDetails: {
    name: "",
    hospitalName: "",
    patientName: "",
    insurancePolicyNumber: "",
  },
  patientType: null,
  medicalHistory: {
    recentInjury: null,
    smoking: null,
    allergies: null,
    overweight: null,
    hypertension: null,
  },
  symptoms: [],

  careType: null,
  specialist: null,
};

const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | null>(null);

const formReducer = (state: any, action: FormAction): FormState => {
  switch (action.type) {
    case "NEXT_STEP":
      const steps: FormStep[] = [
        "welcome",
        "terms",
        "userType",
        "userDetails",
        "patient",
        "symptoms",

        "care",
        "results",
      ];
      const currentIndex = steps.indexOf(state.step);
      return {
        ...state,
        step: steps[currentIndex + 1] as FormStep,
      };
    case "PREV_STEP":
      const stepsBack: FormStep[] = [
        "welcome",
        "terms",
        "userType",
        "userDetails",
        "patient",
        "symptoms",

        "care",
        "results",
      ];
      const currentIndexBack = stepsBack.indexOf(state.step);
      return {
        ...state,
        step: stepsBack[currentIndexBack - 1] as FormStep,
      };
    case "SET_STEP":
      return {
        ...state,
        step: action.payload,
      };
    case "SET_TERMS":
      return {
        ...state,
        acceptedTerms: action.payload,
      };
    case "SET_USER_TYPE":
      return {
        ...state,
        userType: action.payload,
      };
    case "SET_USER_DETAILS":
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          ...action.payload,
        },
      };
    case "SET_PATIENT_TYPE":
      return {
        ...state,
        patientType: action.payload,
      };
    case "UPDATE_MEDICAL_HISTORY":
      return {
        ...state,
        medicalHistory: {
          ...state.medicalHistory,
          ...action.payload,
        },
      };
    case "ADD_SYMPTOM":
      return {
        ...state,
        symptoms: [...state.symptoms, action.payload],
      };
    case "REMOVE_SYMPTOM":
      return {
        ...state,
        symptoms: state.symptoms.filter(
          (symptom: any) => symptom !== action.payload
        ),
      };

    case "SET_CARE_TYPE":
      return {
        ...state,
        careType: action.payload,
      };
    case "SET_SPECIALIST":
      return {
        ...state,
        specialist: action.payload,
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}
