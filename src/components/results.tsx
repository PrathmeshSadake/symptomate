"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle } from "lucide-react";

interface Condition {
  condition: string;
  evidence_level: string;
}

interface SpecialistInfo {
  "Specialist type": string;
  "Consultation format": string;
}

interface SymptomAnalysisResults {
  "Recommendation summary"?: string;
  "Specialist type and consultation format"?: SpecialistInfo;
  "List of possible conditions with evidence levels"?: Condition[];
  "Care plan recommendations"?: string[];
}

const evidenceLevelToNumber = (level: string) => {
  switch (level?.toLowerCase() || "low") {
    case "low":
      return 1;
    case "moderate":
      return 2;
    case "high":
      return 3;
    default:
      return 0;
  }
};

export function SymptomAnalysisResults({
  results,
}: {
  results: SymptomAnalysisResults;
}) {
  const chartData =
    results["List of possible conditions with evidence levels"]?.map(
      (condition) => ({
        name: condition.condition,
        value: evidenceLevelToNumber(condition.evidence_level),
      })
    ) || [];

  return (
    <div className='max-w-4xl mx-auto space-y-6 p-4'>
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Medical Disclaimer</AlertTitle>
        <AlertDescription>
          This information is for educational purposes only and is not a
          substitute for professional medical advice. Always consult with a
          qualified healthcare provider for proper diagnosis and treatment.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Symptom Analysis Results</CardTitle>
          <CardDescription>
            Based on the information you provided
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className='text-lg font-semibold mb-2'>Recommendation Summary</h3>
          <p className='mb-4'>
            {results["Recommendation summary"] ||
              "No recommendation available."}
          </p>

          <h3 className='text-lg font-semibold mb-2'>
            Specialist Consultation
          </h3>
          {results["Specialist type and consultation format"] ? (
            <>
              <p>
                <strong>Type:</strong>{" "}
                {
                  results["Specialist type and consultation format"][
                    "Specialist type"
                  ]
                }
              </p>
              <p>
                <strong>Format:</strong>{" "}
                {
                  results["Specialist type and consultation format"][
                    "Consultation format"
                  ]
                }
              </p>
            </>
          ) : (
            <p>No specialist information available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Possible Conditions</CardTitle>
          <CardDescription>
            Evidence levels for potential conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <>
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
                className='h-[300px]'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={chartData}
                    layout='vertical'
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis type='number' domain={[0, 3]} tickCount={4} />
                    <YAxis dataKey='name' type='category' width={150} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey='value' fill='var(--color-value)' />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className='mt-4 flex justify-center space-x-4'>
                <Badge variant='outline'>Low: 1</Badge>
                <Badge variant='outline'>Moderate: 2</Badge>
                <Badge variant='outline'>High: 3</Badge>
              </div>
            </>
          ) : (
            <p>No condition data available.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Care Plan Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          {results["Care plan recommendations"] &&
          results["Care plan recommendations"].length > 0 ? (
            <ul className='list-disc pl-5 space-y-2'>
              {results["Care plan recommendations"].map(
                (recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                )
              )}
            </ul>
          ) : (
            <p>No care plan recommendations available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
