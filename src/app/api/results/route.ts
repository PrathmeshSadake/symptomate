import { FormStep, UserType } from "@/types/form";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a medical symptom analysis assistant. Analyze the provided symptoms, medical history, and user information to provide structured medical information. 
DO NOT provide actual medical diagnosis - only provide possible conditions and recommendations for seeking appropriate medical care.
Always encourage users to seek professional medical advice.
Respond with a structured analysis following this format exactly:
- Recommendation summary
- Specialist type and consultation format
- List of possible conditions with evidence levels
- Care plan recommendations
Your response must be structured and factual.`;

interface FormState {
  step: FormStep;
  acceptedTerms: boolean;
  userType: UserType;
  userDetails: {
    name: string;
    hospitalName?: string;
    patientName?: string;
    insurancePolicyNumber?: string;
  };
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
  specialist: string | null;
}

export async function POST(req: Request) {
  try {
    const formState: FormState = await req.json();

    // Extract relevant information from formState
    const userType = formState.userType;
    const userDetails = formState.userDetails;
    const patientType = formState.patientType;
    const medicalHistory = Object.entries(formState.medicalHistory)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key);
    const symptoms = formState.symptoms;
    const careType = formState.careType;
    const specialist = formState.specialist;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            SYSTEM_PROMPT +
            "\n" +
            `Strictly output in the following JSON format: ${SYMPTOM_ANALYSIS_SCHEMA}`,
        },
        {
          role: "user",
          content: `
            User Type: ${userType}
            User Details: ${JSON.stringify(userDetails)}
            Patient Type: ${patientType}
            Medical History: ${medicalHistory.join(", ")}
            Current Symptoms: ${symptoms.join(", ")}
            Preferred Care Type: ${careType}
            Assigned Specialist: ${specialist}
            
            Provide a structured analysis of these symptoms and recommend appropriate medical care.
          `,
        },
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(completion.choices[0].message.content!) as any;

    console.log("Symptom analysis:", analysis);

    return NextResponse.json(
      {
        success: true,
        analysis,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Symptom analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze symptoms",
      },
      {
        status: 500,
      }
    );
  }
}

const SYMPTOM_ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    recommendation: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "Brief summary of the main recommendation",
        },
        specialist: {
          type: "object",
          properties: {
            type: {
              type: "string",
              description: "Type of specialist recommended",
            },
            consultationType: {
              type: "string",
              description:
                "Recommended consultation format (e.g., Telephone, In-person)",
            },
            urgency: {
              type: "string",
              enum: ["routine", "soon", "urgent", "emergency"],
              description: "Urgency level of the consultation",
            },
          },
          required: ["type", "consultationType", "urgency"],
        },
        urgencyLevel: {
          type: "string",
          description: "Overall urgency level of the situation",
        },
        followUpInstructions: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of follow-up instructions",
        },
      },
      required: [
        "summary",
        "specialist",
        "urgencyLevel",
        "followUpInstructions",
      ],
    },
    possibleConditions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Common name of the condition",
          },
          scientificName: {
            type: "string",
            description: "Scientific/medical name of the condition",
          },
          evidenceLevel: {
            type: "string",
            enum: ["low", "moderate", "high"],
            description: "Level of evidence for this condition",
          },
          details: {
            type: "object",
            properties: {
              description: {
                type: "string",
                description: "Brief description of the condition",
              },
              symptoms: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Common symptoms of this condition",
              },
              recommendations: {
                type: "array",
                items: {
                  type: "string",
                },
                description: "Specific recommendations for this condition",
              },
            },
            required: ["description", "symptoms", "recommendations"],
          },
        },
        required: ["name", "scientificName", "evidenceLevel", "details"],
      },
    },
    carePlan: {
      type: "object",
      properties: {
        recommendedCareType: {
          type: "string",
          description: "Recommended type of care",
        },
        nextSteps: {
          type: "array",
          items: {
            type: "string",
          },
          description: "List of next steps to take",
        },
        selfCareInstructions: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Optional self-care instructions if applicable",
        },
        warningSymptoms: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "Symptoms that should trigger immediate medical attention",
        },
      },
      required: ["recommendedCareType", "nextSteps", "warningSymptoms"],
    },
  },
  required: ["recommendation", "possibleConditions", "carePlan"],
};
