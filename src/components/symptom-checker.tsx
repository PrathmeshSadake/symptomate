"use client";

import { useAtom } from "jotai";
import {
  stepAtom,
  acceptedTermsAtom,
  patientTypeAtom,
  medicalHistoryAtom,
  symptomsAtom,
  careTypeAtom,
  resultsAtom,
  predefinedSymptomsAtom,
  symptomDetailsAtom,
} from "@/atoms/symptom-checker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Info,
  Download,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FormStep } from "@/types/form";
import { SymptomAnalysisResults } from "./results";

export default function SymptomChecker() {
  const [step, setStep] = useAtom(stepAtom);
  const [acceptedTerms, setAcceptedTerms] = useAtom(acceptedTermsAtom);
  const [patientType, setPatientType] = useAtom(patientTypeAtom);
  const [medicalHistory, setMedicalHistory] = useAtom(medicalHistoryAtom);
  const [symptoms, setSymptoms] = useAtom(symptomsAtom);
  const [careType, setCareType] = useAtom(careTypeAtom);
  const [results, setResults] = useAtom(resultsAtom);
  const [predefinedSymptoms] = useAtom(predefinedSymptomsAtom);
  const [symptomDetails, setSymptomDetails] = useAtom(symptomDetailsAtom);

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientType,
          medicalHistory,
          symptoms,
          symptomDetails,
          careType,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setResults(data.analysis);
          setStep("results");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log(results);

  const filteredSymptoms = predefinedSymptoms.filter((symptom) =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addSymptom = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
    setSearchTerm("");
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
    setSymptomDetails((prevDetails: any) => {
      const newDetails = { ...prevDetails };
      delete newDetails[symptom.toLowerCase() as keyof any];
      return newDetails;
    });
  };

  const updateSymptomDetails = (
    symptom: keyof any,
    key: string,
    value: any
  ) => {
    setSymptomDetails((prevDetails: any) => ({
      ...prevDetails,
      [symptom]: {
        ...prevDetails[symptom],
        [key]: value,
      },
    }));
  };

  const renderSymptomDetailsStep = () => {
    return (
      <div className='space-y-6'>
        <h2 className='text-2xl font-bold'>Additional Symptom Information</h2>
        {symptoms.includes("Headache") && (
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>Headache Details</h3>
            <div className='space-y-2'>
              <h4 className='text-lg'>Duration</h4>
              <RadioGroup
                value={symptomDetails.headache?.duration || ""}
                onValueChange={(value) =>
                  updateSymptomDetails("headache", "duration", value)
                }
              >
                {["new", "recurring", "chronic"].map((option) => (
                  <div key={option} className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value={option}
                      id={`headache-duration-${option}`}
                    />
                    <Label htmlFor={`headache-duration-${option}`}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className='space-y-2'>
              <h4 className='text-lg'>Intensity</h4>
              <RadioGroup
                value={symptomDetails.headache?.intensity || ""}
                onValueChange={(value) =>
                  updateSymptomDetails("headache", "intensity", value)
                }
              >
                {["mild", "moderate", "severe"].map((option) => (
                  <div key={option} className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value={option}
                      id={`headache-intensity-${option}`}
                    />
                    <Label htmlFor={`headache-intensity-${option}`}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}
        {symptoms.includes("Fever") && (
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>Fever Details</h3>
            <div className='space-y-2'>
              <h4 className='text-lg'>Temperature</h4>
              <RadioGroup
                value={symptomDetails.fever?.temperature || ""}
                onValueChange={(value) =>
                  updateSymptomDetails("fever", "temperature", value)
                }
              >
                {["low", "moderate", "high"].map((option) => (
                  <div key={option} className='flex items-center space-x-2'>
                    <RadioGroupItem
                      value={option}
                      id={`fever-temperature-${option}`}
                    />
                    <Label htmlFor={`fever-temperature-${option}`}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className='space-y-2'>
              <h4 className='text-lg'>Additional Symptoms</h4>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='runny-nose'
                  checked={symptomDetails.fever?.runnyNose || false}
                  onCheckedChange={(checked) =>
                    updateSymptomDetails("fever", "runnyNose", checked)
                  }
                />
                <Label htmlFor='runny-nose'>Runny Nose</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='sore-throat'
                  checked={symptomDetails.fever?.soreThroat || false}
                  onCheckedChange={(checked) =>
                    updateSymptomDetails("fever", "soreThroat", checked)
                  }
                />
                <Label htmlFor='sore-throat'>Sore Throat</Label>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case "welcome":
        return (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold'>Check your symptoms</h1>
              <p className='text-muted-foreground'>
                Take a short symptom assessment. The information you give is
                safe and won't be shared. Your results will include:
              </p>
              <ul className='ml-6 list-disc text-muted-foreground'>
                <li>Possible causes of symptoms</li>
                <li>Recommendations on what to do next</li>
              </ul>
            </div>
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>About this tool</h2>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <ChevronRight className='h-4 w-4' />
                  <span>Created and validated by doctors</span>
                </div>
                <div className='flex items-center gap-2'>
                  <ChevronRight className='h-4 w-4' />
                  <span>Clinically validated with patient cases</span>
                </div>
                <div className='flex items-center gap-2'>
                  <ChevronRight className='h-4 w-4' />
                  <span>Class I medical device in the EU</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "terms":
        return (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <h2 className='text-2xl font-bold'>Terms of Service</h2>
              <p className='text-muted-foreground'>
                Before using the symptom assessment, please accept the Terms of
                Service and Privacy Policy.
              </p>
            </div>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <p className='font-medium'>Please note:</p>
                <ul className='ml-6 list-disc space-y-2 text-muted-foreground'>
                  <li>
                    The result is not a diagnosis. It's only for your
                    information and not a qualified medical opinion.
                  </li>
                  <li>
                    Do not use it in case of an emergency. Call your local
                    emergency number right away when there's a health emergency.
                  </li>
                  <li>
                    Your data is safe. The information you give won't be shared
                    or used to identify you.
                  </li>
                </ul>
              </div>
              <div className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='terms'
                    checked={acceptedTerms}
                    onCheckedChange={(checked) =>
                      setAcceptedTerms(checked as boolean)
                    }
                  />
                  <Label htmlFor='terms'>
                    I have read and accept the Terms of Service.
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      case "patient":
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold'>Who is the checkup for?</h2>
            <RadioGroup
              value={patientType || ""}
              onValueChange={(value) =>
                setPatientType(value as "self" | "other")
              }
            >
              <div className='grid gap-4 md:grid-cols-2'>
                <Label
                  htmlFor='self'
                  className='flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary'
                >
                  <RadioGroupItem value='self' id='self' className='sr-only' />
                  <Image
                    src='/placeholder.svg?height=50&width=50'
                    alt='Self'
                    className='mb-3'
                    width={50}
                    height={50}
                  />
                  <div className='text-center'>
                    <p className='font-medium'>Myself</p>
                    <p className='text-sm text-muted-foreground'>
                      I am 18 or older
                    </p>
                  </div>
                </Label>
                <Label
                  htmlFor='other'
                  className='flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary'
                >
                  <RadioGroupItem
                    value='other'
                    id='other'
                    className='sr-only'
                  />
                  <Image
                    src='/placeholder.svg?height=50&width=50'
                    alt='Someone else'
                    className='mb-3'
                    width={50}
                    height={50}
                  />
                  <div className='text-center'>
                    <p className='font-medium'>Someone else</p>
                    <p className='text-sm text-muted-foreground'>
                      Child or adult
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case "symptoms":
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold'>Add your symptoms</h2>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search, e.g., headache'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Suggested symptoms:</h3>
              <div className='flex flex-wrap gap-2'>
                {filteredSymptoms.map((symptom) => (
                  <Button
                    key={symptom}
                    variant='outline'
                    size='sm'
                    onClick={() => addSymptom(symptom)}
                    className='flex items-center gap-1'
                  >
                    <Plus className='h-4 w-4' />
                    {symptom}
                  </Button>
                ))}
              </div>
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Selected symptoms:</h3>
              <div className='flex flex-wrap gap-2'>
                {symptoms.map((symptom) => (
                  <Button
                    key={symptom}
                    variant='secondary'
                    size='sm'
                    onClick={() => removeSymptom(symptom)}
                    className='flex items-center gap-1'
                  >
                    {symptom}
                    <X className='h-4 w-4' />
                  </Button>
                ))}
              </div>
            </div>
            {symptoms.length === 0 && (
              <p className='text-sm text-muted-foreground'>
                Please add at least one symptom.
              </p>
            )}
          </div>
        );

      case "symptomDetails":
        return renderSymptomDetailsStep();

      case "care":
        return (
          <div className='space-y-6'>
            <h2 className='text-2xl font-bold'>
              What kind of care are you planning to get right now?
            </h2>
            <RadioGroup
              value={careType || ""}
              onValueChange={(value) => setCareType(value)}
              className='space-y-2'
            >
              {[
                "Primary care",
                "Specialist care",
                "Allied health care",
                "Urgent care",
                "Emergency care",
                "Not sure",
              ].map((type) => (
                <Label
                  key={type}
                  className='flex cursor-pointer items-center justify-between rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary'
                >
                  <div className='flex items-center gap-2'>
                    <RadioGroupItem value={type} id={type} />
                    <span>{type}</span>
                  </div>
                  <Info className='h-4 w-4 text-muted-foreground' />
                </Label>
              ))}
            </RadioGroup>
          </div>
        );

      case "results":
        return results ? (
          <SymptomAnalysisResults results={results as any} />
        ) : null;

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case "terms":
        return acceptedTerms;
      case "patient":
        return patientType !== null;
      case "symptoms":
        return symptoms.length > 0;
      case "symptomDetails":
        return true; // Always allow proceeding from symptom details
      case "care":
        return careType !== null;
      default:
        return true;
    }
  };

  const nextStep = () => {
    const steps: FormStep[] = [
      "welcome",
      "terms",
      "patient",
      "symptoms",
      "symptomDetails",
      "care",
      "results",
    ];
    const currentIndex = steps.indexOf(step);

    if (step === "symptoms" && symptoms.length > 0) {
      setStep("symptomDetails");
    } else if (step === "care") {
      handleSubmit();
    } else {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: FormStep[] = [
      "welcome",
      "terms",
      "patient",
      "symptoms",
      "symptomDetails",
      "care",
      "results",
    ];
    const currentIndex = steps.indexOf(step);
    setStep(steps[currentIndex - 1]);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8'>
      <Card className='mx-auto max-w-2xl'>
        <div className='p-6'>
          {renderStep()}
          <div className='mt-6 flex items-center justify-between'>
            {step !== "welcome" && (
              <Button variant='ghost' onClick={prevStep} className='gap-2'>
                <ChevronLeft className='h-4 w-4' />
                Back
              </Button>
            )}
            {step !== "results" && (
              <Button
                className='ml-auto gap-2'
                disabled={!canProceed() || isLoading}
                onClick={nextStep}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className='h-4 w-4 animate-spin' />
                    Processing...
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className='h-4 w-4' />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
