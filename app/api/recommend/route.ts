import { NextRequest, NextResponse } from "next/server";
import { mockSchemes } from "../../../services/mock-data";
import { UserProfile, GovernmentScheme } from "../../../types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const hasApiKey = apiKey.trim().length > 0;

export async function POST(req: NextRequest) {
  try {
    const profile = await req.json();
    const { age, occupation, income, education, location } = profile;

    if (!age || !occupation || income === undefined) {
      return NextResponse.json({ error: "Missing required profile fields" }, { status: 400 });
    }

    let recommended = [];

    if (hasApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          You are the CivicAI Scheme Recommender.
          Given this citizen profile:
          - Age: ${age}
          - Occupation: ${occupation}
          - Monthly/Annual Income: ₹${income}
          - Education: ${education}
          - Location: ${location}

          Evaluate these available schemes (provided in JSON format):
          ${JSON.stringify(mockSchemes)}

          For each scheme, determine if they are eligible and calculate a match percentage (0 to 100) based on their profile.
          Return a JSON array of objects, where each object has:
          "id": string (the matching scheme id),
          "matchPercentage": number (score from 0 to 100),
          "aiExplanation": string (a short 2-sentence explanation of why they matched, tailored to their profile e.g., 'As a freelance developer earning ₹3,50,000, this grant will help reduce your overhead costs by covering co-working rents.')

          Return ONLY the raw JSON array. No markdown code blocks, no other text.
        `;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        
        // Strip markdown backticks if any
        if (text.startsWith("```json")) {
          text = text.substring(7, text.length - 3).trim();
        } else if (text.startsWith("```")) {
          text = text.substring(3, text.length - 3).trim();
        }

        const parsed = JSON.parse(text);
        
        // Merge the AI recommendations with the original scheme data
        recommended = mockSchemes.map(scheme => {
          const match = parsed.find((p: { id: string }) => p.id === scheme.id);
          return {
            ...scheme,
            matchPercentage: match ? match.matchPercentage : 50,
            aiExplanation: match ? match.aiExplanation : "You qualify under general eligibility rules."
          };
        });

      } catch (error) {
        console.error("Gemini recommendation failed, using fallback rule-engine:", error);
        recommended = runFallbackRecommendation(profile);
      }
    } else {
      await new Promise(r => setTimeout(r, 600));
      recommended = runFallbackRecommendation(profile);
    }

    // Sort by match percentage descending
    recommended.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));

    return NextResponse.json({ schemes: recommended });
  } catch (error: unknown) {
    console.error("Recommend API error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function runFallbackRecommendation(profile: UserProfile): GovernmentScheme[] {
  const { age, occupation, income } = profile;
  const isStudentOrYoung = age <= 28 || occupation.toLowerCase().includes("student");
  const isFreelancer = occupation.toLowerCase().includes("freelance") || occupation.toLowerCase().includes("developer") || occupation.toLowerCase().includes("self");
  const isLowIncome = income < 50000;

  return mockSchemes.map(scheme => {
    let score = 70; // Base score
    let explanation = "Matched based on resident location and general eligibility.";

    if (scheme.id === "sch-solar") {
      if (income >= 30000 && income <= 100000) {
        score = 92;
        explanation = `As a ${occupation} earning ₹${income}, the 40% solar panel subsidy is highly accessible for your property level and will lower utility costs.`;
      } else {
        score = 65;
        explanation = "You qualify as a homeowner, though financial returns vary depending on roof sizing.";
      }
    } else if (scheme.id === "sch-tech") {
      if (isFreelancer && age <= 35) {
        score = 88;
        explanation = `As a ${age}-year-old developer/freelancer, this grant is designed for you, covering ₹10,000/month of co-working rent and high-speed internet.`;
      } else {
        score = 40;
        explanation = "This program prioritizes freelancers and tech contractors under 35 years old.";
      }
    } else if (scheme.id === "sch-health") {
      if (isLowIncome) {
        score = 85;
        explanation = `With an income of ₹${income}, you qualify for 100% free annual diagnostics and 50% prescription discounts at local clinics.`;
      } else {
        score = 75;
        explanation = "Universal screening is available to all residents regardless of tax thresholds.";
      }
    } else if (scheme.id === "sch-digital") {
      if (isStudentOrYoung || isFreelancer) {
        score = 80;
        explanation = "Upskilling scholarships cover tech certificate costs, matching your profile in technical sectors.";
      } else {
        score = 55;
        explanation = "Upskilling courses are open, though priority is given to career pivot applicants.";
      }
    }

    return {
      ...scheme,
      matchPercentage: score,
      aiExplanation: explanation
    };
  });
}
