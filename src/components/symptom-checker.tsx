"use client";

import { useAtom } from "jotai";
import {
  stepAtom,
  acceptedTermsAtom,
  userTypeAtom,
  userDetailsAtom,
  patientTypeAtom,
  medicalHistoryAtom,
  symptomsAtom,
  careTypeAtom,
  specialistAtom,
  resultsAtom,
  predefinedSymptomsAtom,
  predefinedSpecialistsAtom,
} from "@/atoms/symptom-checker";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Info,
  Download,
  RefreshCw,
  Plus,
  X,
  User,
  Hospital,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";
import { useState } from "react";
import { FormStep, UserType } from "@/types/form";
import { SymptomAnalysisResults } from "./results";
import Image from "next/image";

export default function SymptomChecker() {
  const [step, setStep] = useAtom(stepAtom);
  const [acceptedTerms, setAcceptedTerms] = useAtom(acceptedTermsAtom);
  const [userType, setUserType] = useAtom(userTypeAtom);
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [patientType, setPatientType] = useAtom(patientTypeAtom);
  const [medicalHistory, setMedicalHistory] = useAtom(medicalHistoryAtom);
  const [symptoms, setSymptoms] = useAtom(symptomsAtom);
  const [careType, setCareType] = useAtom(careTypeAtom);
  const [specialist, setSpecialist] = useAtom(specialistAtom);
  const [results, setResults] = useAtom(resultsAtom);
  const [predefinedSymptoms] = useAtom(predefinedSymptomsAtom);
  const [predefinedSpecialists] = useAtom(predefinedSpecialistsAtom);

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
          userType,
          userDetails,
          patientType,
          medicalHistory,
          symptoms,

          careType,
          specialist,
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

  const renderStep = () => {
    switch (step) {
      case "welcome":
        return (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <h1 className='text-4xl font-bold text-blue-600'>
                Check your symptoms
              </h1>
              <p className='text-xl text-gray-600'>
                Take a short symptom assessment. The information you give is
                safe and won't be shared.
              </p>
            </div>
            <img
              src='https://docus-live-cms-storage-us.s3.amazonaws.com/product_guide/images/sections/2c686aa600e22efb9ec91d512cba8660.png'
              alt='Symptom Checker'
              className='w-full rounded-lg shadow-md'
            />
            <div className='space-y-4'>
              <h2 className='text-2xl font-semibold text-blue-600'>
                About this tool
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='flex items-center gap-2 bg-blue-50 p-4 rounded-lg'>
                  <Stethoscope className='h-8 w-8 text-blue-600' />
                  <span className='text-gray-800'>
                    Created and validated by doctors
                  </span>
                </div>
                <div className='flex items-center gap-2 bg-blue-50 p-4 rounded-lg'>
                  <User className='h-8 w-8 text-blue-600' />
                  <span className='text-gray-800'>
                    Clinically validated with patient cases
                  </span>
                </div>
                <div className='flex items-center gap-2 bg-blue-50 p-4 rounded-lg'>
                  <Shield className='h-8 w-8 text-blue-600' />
                  <span className='text-gray-800'>
                    Class I medical device in the EU
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case "terms":
        return (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold text-blue-600'>
                Terms of Service
              </h2>
              <p className='text-lg text-gray-600'>
                Before using the symptom assessment, please accept the Terms of
                Service and Privacy Policy.
              </p>
            </div>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <p className='font-medium text-gray-800'>Please note:</p>
                <ul className='ml-6 list-disc space-y-2 text-gray-600'>
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
                  <Label htmlFor='terms' className='text-gray-800'>
                    I have read and accept the Terms of Service.
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );

      case "userType":
        return (
          <div className='space-y-6'>
            <h2 className='text-3xl font-bold text-blue-600'>
              Select User Type
            </h2>
            <RadioGroup
              value={userType || ""}
              onValueChange={(value) => setUserType(value as UserType)}
            >
              <div className='grid gap-4 md:grid-cols-3'>
                {[
                  { type: "individual", icon: User },
                  { type: "hospital", icon: Hospital },
                  { type: "insurance", icon: Shield },
                ].map(({ type, icon: Icon }) => (
                  <Label
                    key={type}
                    htmlFor={type}
                    className='flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-blue-200 bg-white p-6 hover:bg-blue-50 hover:border-blue-400 transition-all [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50'
                  >
                    <RadioGroupItem
                      value={type}
                      id={type}
                      className='sr-only'
                    />
                    <Icon className='h-12 w-12 text-blue-600 mb-4' />
                    <div className='text-center'>
                      <p className='font-medium text-lg text-gray-800'>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </p>
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case "userDetails":
        return (
          <div className='space-y-6'>
            <h2 className='text-3xl font-bold text-blue-600'>User Details</h2>
            {userType === "individual" && (
              <div className='space-y-4'>
                <Label htmlFor='name' className='text-gray-700'>
                  Name
                </Label>
                <Input
                  id='name'
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                  className='border-blue-200 focus:border-blue-400 focus:ring-blue-400'
                />
              </div>
            )}
            {userType === "hospital" && (
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='hospitalName' className='text-gray-700'>
                    Hospital Name
                  </Label>
                  <Input
                    id='hospitalName'
                    value={userDetails.hospitalName}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        hospitalName: e.target.value,
                      })
                    }
                    className='border-blue-200 focus:border-blue-400 focus:ring-blue-400'
                  />
                </div>
                <div>
                  <Label htmlFor='patientName' className='text-gray-700'>
                    Patient Name
                  </Label>
                  <Input
                    id='patientName'
                    value={userDetails.patientName}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        patientName: e.target.value,
                      })
                    }
                    className='border-blue-200 focus:border-blue-400 focus:ring-blue-400'
                  />
                </div>
                <div>
                  <Label htmlFor='specialist' className='text-gray-700'>
                    Specialist
                  </Label>
                  <Select
                    value={specialist || ""}
                    onValueChange={setSpecialist}
                  >
                    <SelectTrigger className='border-blue-200 focus:border-blue-400 focus:ring-blue-400'>
                      <SelectValue placeholder='Select a specialist' />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedSpecialists.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {userType === "insurance" && (
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='insuranceName' className='text-gray-700'>
                    Insurance Company Name
                  </Label>
                  <Input
                    id='insuranceName'
                    value={userDetails.name}
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, name: e.target.value })
                    }
                    className='border-blue-200 focus:border-blue-400 focus:ring-blue-400'
                  />
                </div>
                <div>
                  <Label htmlFor='patientName' className='text-gray-700'>
                    Patient Name
                  </Label>
                  <Input
                    id='patientName'
                    value={userDetails.patientName}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        patientName: e.target.value,
                      })
                    }
                    className='border-blue-200 focus:border-blue-400 focus:ring-blue-400'
                  />
                </div>
                <div>
                  <Label htmlFor='policyNumber' className='text-gray-700'>
                    Insurance Policy Number
                  </Label>
                  <Input
                    id='policyNumber'
                    value={userDetails.insurancePolicyNumber}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        insurancePolicyNumber: e.target.value,
                      })
                    }
                    className='border-blue-200 focus:border-blue-400 focus:ring-blue-400'
                  />
                </div>
              </div>
            )}
          </div>
        );

      case "patient":
        return userType === "individual" ? (
          <div className='space-y-6'>
            <h2 className='text-3xl font-bold text-blue-600'>
              Who is the checkup for?
            </h2>
            <RadioGroup
              value={patientType || ""}
              onValueChange={(value) =>
                setPatientType(value as "self" | "other")
              }
            >
              <div className='grid gap-4 md:grid-cols-2'>
                <Label
                  htmlFor='self'
                  className='flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-blue-200 bg-white p-6 hover:bg-blue-50 hover:border-blue-400 transition-all [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50'
                >
                  <RadioGroupItem value='self' id='self' className='sr-only' />
                  <User className='h-12 w-12 text-blue-600 mb-4' />
                  <div className='text-center'>
                    <p className='font-medium text-lg text-gray-800'>Myself</p>
                    <p className='text-sm text-gray-600'>I am 18 or older</p>
                  </div>
                </Label>
                <Label
                  htmlFor='other'
                  className='flex cursor-pointer flex-col items-center justify-between rounded-lg border-2 border-blue-200 bg-white p-6 hover:bg-blue-50 hover:border-blue-400 transition-all [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50'
                >
                  <RadioGroupItem
                    value='other'
                    id='other'
                    className='sr-only'
                  />
                  <Users className='h-12 w-12 text-blue-600 mb-4' />
                  <div className='text-center'>
                    <p className='font-medium text-lg text-gray-800'>
                      Someone else
                    </p>
                    <p className='text-sm text-gray-600'>Child or adult</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        ) : null;

      case "symptoms":
        return (
          <div className='space-y-6'>
            <h2 className='text-3xl font-bold text-blue-600'>
              Add your symptoms
            </h2>
            <div className='relative'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search, e.g., headache'
                className='pl-8 border-blue-200 focus:border-blue-400 focus:ring-blue-400'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <h3 className='text-xl font-semibold text-gray-800'>
                Suggested symptoms:
              </h3>
              <div className='flex flex-wrap gap-2'>
                {predefinedSymptoms
                  .filter((symptom) =>
                    symptom.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((symptom) => (
                    <Button
                      key={symptom}
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        if (!symptoms.includes(symptom)) {
                          setSymptoms([...symptoms, symptom]);
                        }
                        setSearchTerm("");
                      }}
                      className='flex items-center gap-1 border-blue-200 hover:bg-blue-50 hover:border-blue-400'
                    >
                      <Plus className='h-4 w-4 text-blue-600' />
                      {symptom}
                    </Button>
                  ))}
              </div>
            </div>
            <div className='space-y-2'>
              <h3 className='text-xl font-semibold text-gray-800'>
                Selected symptoms:
              </h3>
              <div className='flex flex-wrap gap-2'>
                {symptoms.map((symptom) => (
                  <Button
                    key={symptom}
                    variant='secondary'
                    size='sm'
                    onClick={() => {
                      setSymptoms(symptoms.filter((s) => s !== symptom));
                    }}
                    className='flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200'
                  >
                    {symptom}
                    <X className='h-4 w-4' />
                  </Button>
                ))}
              </div>
            </div>
            {symptoms.length === 0 && (
              <p className='text-sm text-gray-500'>
                Please add at least one symptom.
              </p>
            )}
          </div>
        );

      case "care":
        return (
          <div className='space-y-6'>
            <h2 className='text-3xl font-bold text-blue-600'>
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
                  className='flex cursor-pointer items-center justify-between rounded-lg border border-blue-200 p-4 hover:bg-blue-50 hover:border-blue-400 transition-all [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50'
                >
                  <div className='flex items-center gap-2'>
                    <RadioGroupItem value={type} id={type} />
                    <span className='text-gray-800'>{type}</span>
                  </div>
                  <Info className='h-4 w-4 text-blue-600' />
                </Label>
              ))}
            </RadioGroup>
          </div>
        );

      case "results":
        return results ? (
          <div className='space-y-6'>
            <SymptomAnalysisResults results={results as any} />
            {userType === "hospital" && (
              <div className='space-y-4'>
                <h3 className='text-2xl font-semibold text-blue-600'>
                  Assign Specialist
                </h3>
                <Select value={specialist || ""} onValueChange={setSpecialist}>
                  <SelectTrigger className='border-blue-200 focus:border-blue-400 focus:ring-blue-400'>
                    <SelectValue placeholder='Select a specialist' />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedSpecialists.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    // Here you can add logic to save the assigned specialist
                    console.log("Assigned specialist:", specialist);
                  }}
                  className='bg-blue-600 hover:bg-blue-700 text-white'
                >
                  Assign Specialist
                </Button>
              </div>
            )}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case "terms":
        return acceptedTerms;
      case "userType":
        return userType !== null;
      case "userDetails":
        if (userType === "individual") return userDetails.name.trim() !== "";
        if (userType === "hospital")
          return (
            userDetails.hospitalName?.trim() !== "" &&
            userDetails.patientName?.trim() !== "" &&
            specialist !== null
          );
        if (userType === "insurance")
          return (
            userDetails.name.trim() !== "" &&
            userDetails.patientName?.trim() !== "" &&
            userDetails.insurancePolicyNumber?.trim() !== ""
          );
        return false;
      case "patient":
        return userType === "individual" ? patientType !== null : true;
      case "symptoms":
        return symptoms.length > 0;
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
      "userType",
      "userDetails",
      "patient",
      "symptoms",

      "care",
      "results",
    ];
    const currentIndex = steps.indexOf(step);

    if (step === "userDetails" && userType !== "individual") {
      setStep("symptoms");
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
      "userType",
      "userDetails",
      "patient",
      "symptoms",

      "care",
      "results",
    ];
    const currentIndex = steps.indexOf(step);

    if (step === "symptoms" && userType !== "individual") {
      setStep("userDetails");
    } else {
      setStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        <div className='bg-white shadow-xl rounded-lg overflow-hidden'>
          <div className='p-6 sm:p-10'>
            {renderStep()}
            <div className='mt-8 flex items-center justify-between'>
              {step !== "welcome" && (
                <Button
                  variant='outline'
                  onClick={prevStep}
                  className='gap-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-400'
                >
                  <ChevronLeft className='h-4 w-4' />
                  Back
                </Button>
              )}
              {step !== "results" && (
                <Button
                  className='ml-auto gap-2 bg-blue-600 hover:bg-blue-700 text-white'
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
        </div>
      </div>
    </div>
  );
}
