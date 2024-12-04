"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "@/components/ui/chart";
import { Download, RefreshCw } from "lucide-react";
import { useSetAtom } from "jotai";
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
} from "@/atoms/symptom-checker";
import { usePDF } from "react-to-pdf";

interface AnalysisResult {
  "Recommendation summary": string;
  "Specialist type and consultation format": {
    "Specialist type": string;
    "Consultation format": string;
  };
  "List of possible conditions with evidence levels": Array<{
    Condition: string;
    "Evidence level": string;
  }>;
  "Care plan recommendations": {
    "Immediate actions": string;
    "Follow-up": string;
    "Self-care": string;
  };
}

interface SymptomAnalysisResultsProps {
  results: AnalysisResult | null;
}

function ChartTooltipContent({ payload, label }: any) {
  if (!payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <div className='rounded-lg border bg-background p-2 shadow-sm'>
      <div className='grid grid-cols-2 gap-2'>
        <div className='flex flex-col'>
          <span className='text-[0.70rem] uppercase text-muted-foreground'>
            Condition
          </span>
          <span className='font-bold text-muted-foreground'>
            {data.Condition}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='text-[0.70rem] uppercase text-muted-foreground'>
            Evidence Level
          </span>
          <span className='font-bold'>{data["Evidence level"]}</span>
        </div>
      </div>
    </div>
  );
}

export function ChartContainer({ config, children, className }: any) {
  return (
    <div className={className}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            ${Object.entries(config)
              .map(([key, value]: [string, any]) => {
                return `--color-${key}: ${value.color};`;
              })
              .join("\n")}
          }
        `,
        }}
      />
      {children}
    </div>
  );
}

export function SymptomAnalysisResults({
  results,
}: SymptomAnalysisResultsProps) {
  const { toPDF, targetRef } = usePDF({ filename: "symptom-analysis.pdf" });
  const setStep = useSetAtom(stepAtom);
  const setAcceptedTerms = useSetAtom(acceptedTermsAtom);
  const setUserType = useSetAtom(userTypeAtom);
  const setUserDetails = useSetAtom(userDetailsAtom);
  const setPatientType = useSetAtom(patientTypeAtom);
  const setMedicalHistory = useSetAtom(medicalHistoryAtom);
  const setSymptoms = useSetAtom(symptomsAtom);
  const setCareType = useSetAtom(careTypeAtom);
  const setSpecialist = useSetAtom(specialistAtom);
  const setResults = useSetAtom(resultsAtom);

  const chartData =
    results?.["List of possible conditions with evidence levels"]?.map(
      (condition) => ({
        Condition: condition.Condition,
        "Evidence level":
          condition["Evidence level"] === "Low"
            ? 1
            : condition["Evidence level"] === "Moderate"
            ? 2
            : 3,
      })
    ) || [];

  const restartProcess = () => {
    setStep("welcome");
    setAcceptedTerms(false);
    setUserType(null);
    setUserDetails({
      name: "",
      hospitalName: "",
      patientName: "",
      insurancePolicyNumber: "",
    });
    setPatientType(null);
    setMedicalHistory({
      recentInjury: null,
      smoking: null,
      allergies: null,
      overweight: null,
      hypertension: null,
    });
    setSymptoms([]);
    setCareType(null);
    setSpecialist(null);
    setResults(null);
  };

  if (!results) {
    return (
      <Card className='w-full max-w-4xl mx-auto'>
        <CardContent className='p-6'>
          <p className='text-center text-gray-600'>
            No results available. Please try again.
          </p>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button
            variant='outline'
            className='flex items-center gap-2'
            onClick={restartProcess}
          >
            <RefreshCw className='h-4 w-4' />
            Start a fresh case
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-4xl mx-auto'>
     
      <CardContent ref={targetRef} className='space-y-6'>
      <CardHeader className='px-0'>
        <CardTitle className='text-2xl font-bold text-blue-600'>
          Symptom Analysis Results
        </CardTitle>
        <CardDescription>
          Based on the information you provided, here are the potential
          conditions and recommendations.
        </CardDescription>
      </CardHeader>
        {results["Recommendation summary"] && (
          <Card className='bg-blue-50'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-blue-800'>
                Recommendation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700'>
                {results["Recommendation summary"]}
              </p>
            </CardContent>
          </Card>
        )}
        {chartData.length > 0 && (
          <ChartContainer
            config={{
              name: {
                label: "Condition",
                color: "hsl(var(--chart-1))",
              },
              value: {
                label: "Evidence Level",
                color: "hsl(var(--chart-2))",
              },
            }}
            className='h-[300px] w-full'
          >
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                layout='vertical'
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' domain={[0, 3]} tickCount={4} />
                <YAxis
                  dataKey='Condition'
                  type='category'
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey='Evidence level'
                  fill='var(--color-value)'
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}

        {results["Specialist type and consultation format"] && (
          <Card className='bg-blue-50'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-blue-800'>
                Specialist Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700'>
                <strong>Specialist Type:</strong>{" "}
                {results["Specialist type and consultation format"][
                  "Specialist type"
                ] || "Not specified"}
              </p>
              <p className='text-gray-700'>
                <strong>Consultation Format:</strong>{" "}
                {results["Specialist type and consultation format"][
                  "Consultation format"
                ] || "Not specified"}
              </p>
            </CardContent>
          </Card>
        )}

        {results["Care plan recommendations"] && (
          <Card className='bg-blue-50'>
            <CardHeader>
              <CardTitle className='text-lg font-semibold text-blue-800'>
                Care Plan Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results["Care plan recommendations"]["Immediate actions"] && (
                <>
                  <h4 className='mt-2 font-medium text-blue-800'>
                    Immediate Actions:
                  </h4>
                  <p className='text-gray-700'>
                    {results["Care plan recommendations"]["Immediate actions"]}
                  </p>
                </>
              )}

              {results["Care plan recommendations"]["Follow-up"] && (
                <>
                  <h4 className='mt-4 font-medium text-blue-800'>Follow-up:</h4>
                  <p className='text-gray-700'>
                    {results["Care plan recommendations"]["Follow-up"]}
                  </p>
                </>
              )}

              {results["Care plan recommendations"]["Self-care"] && (
                <>
                  <h4 className='mt-4 font-medium text-blue-800'>Self-care:</h4>
                  <p className='text-gray-700'>
                    {results["Care plan recommendations"]["Self-care"]}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button
          variant='outline'
          className='flex items-center gap-2'
          onClick={restartProcess}
        >
          <RefreshCw className='h-4 w-4' />
          Start a fresh case
        </Button>
        <Button
          onClick={() => toPDF()}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white'
        >
          <Download className='h-4 w-4' />
          Download Report
        </Button>
      </CardFooter>
    </Card>
  );
}
