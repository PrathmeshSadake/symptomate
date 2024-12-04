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
import {
  AlertTriangle,
  Info,
  Activity,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

const evidenceLevelToNumber = (level: string) => {
  switch (level?.toLowerCase() || "low") {
    case "high":
      return 3;
    case "moderate":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
};

export function SymptomAnalysisResults({ results }: { results: any }) {
  if (!results || typeof results !== "object") {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Unable to process the symptom analysis results. Please try again
          later.
        </AlertDescription>
      </Alert>
    );
  }

  const chartData = Array.isArray(
    results["List of possible conditions with evidence levels"]
  )
    ? results["List of possible conditions with evidence levels"].map(
        (condition: any) => ({
          name: condition.Condition || "Unknown",
          value: evidenceLevelToNumber(condition["Evidence level"]),
        })
      )
    : [];

  const carePlanRecommendations = results["Care plan recommendations"] || {};

  return (
    <div className='max-w-7xl mx-auto space-y-6 p-4'>
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Medical Disclaimer</AlertTitle>
        <AlertDescription>
          This information is for educational purposes only and is not a
          substitute for professional medical advice. Always consult with a
          qualified healthcare provider for proper diagnosis and treatment.
        </AlertDescription>
      </Alert>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Info className='h-5 w-5 text-blue-500' />
              Symptom Analysis Results
            </CardTitle>
            <CardDescription>
              Based on the information you provided
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className='text-lg font-semibold mb-2'>
              Recommendation Summary
            </h3>
            <p className='mb-4 text-gray-700'>
              {results["Recommendation summary"] ||
                "No recommendation available."}
            </p>

            <h3 className='text-lg font-semibold mb-2'>
              Specialist Consultation
            </h3>
            {results["Specialist type and consultation format"] ? (
              <div className='space-y-2'>
                <p className='flex items-center gap-2'>
                  <Stethoscope className='h-4 w-4 text-blue-500' />
                  <strong>Type:</strong>{" "}
                  {results["Specialist type and consultation format"][
                    "Specialist type"
                  ] || "Not specified"}
                </p>
                <p className='flex items-center gap-2'>
                  <Activity className='h-4 w-4 text-blue-500' />
                  <strong>Format:</strong>{" "}
                  {results["Specialist type and consultation format"][
                    "Consultation format"
                  ] || "Not specified"}
                </p>
              </div>
            ) : (
              <p className='text-gray-500'>
                No specialist information available.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ClipboardList className='h-5 w-5 text-blue-500' />
              Possible Conditions
            </CardTitle>
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
                  <Badge variant='outline' className='bg-red-100'>
                    Low: 1
                  </Badge>
                  <Badge variant='outline' className='bg-yellow-100'>
                    Moderate: 2
                  </Badge>
                  <Badge variant='outline' className='bg-green-100'>
                    High: 3
                  </Badge>
                </div>
              </>
            ) : (
              <p className='text-gray-500'>No condition data available.</p>
            )}
          </CardContent>
        </Card>

        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <ClipboardList className='h-5 w-5 text-blue-500' />
              Care Plan Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(carePlanRecommendations).length > 0 ? (
              <div className='space-y-4'>
                {Object.entries(carePlanRecommendations).map(([key, value]) => (
                  <div key={key} className='border-b pb-2 last:border-b-0'>
                    <h4 className='font-semibold text-blue-600 mb-1'>{key}</h4>
                    <p className='text-gray-700'>{value as string}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500'>
                No care plan recommendations available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
