import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const hasApiKey = apiKey.trim().length > 0;

export async function POST(req: NextRequest) {
  try {
    const { category, description, location } = await req.json();

    if (!category || !description) {
      return NextResponse.json({ error: "Missing category or description" }, { status: 400 });
    }

    let reportDetails = null;

    if (hasApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          You are the CivicAI Incident Classifier.
          A citizen is reporting an issue.
          - Category: ${category}
          - Raw User Description: "${description}"
          - Location: "${location || 'Not provided'}"

          Task:
          1. Auto-generate a formal, structured complaint summary for municipal workers.
          2. Auto-detect the responsible department.
          3. Provide 2 AI-generated suggestions for immediate action or safety advice.

          Return a JSON object containing:
          - "formalTitle": string (a short, clear title for the ticket),
          - "formalSummary": string (the detailed formal complaint description),
          - "department": string (e.g., 'Public Works Department', 'Municipal Sanitation', 'Water Board', 'Traffic Police'),
          - "aiSuggestions": array of strings (2 practical suggestions)

          Return ONLY the raw JSON object. No markdown.
        `;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        
        if (text.startsWith("```json")) {
          text = text.substring(7, text.length - 3).trim();
        } else if (text.startsWith("```")) {
          text = text.substring(3, text.length - 3).trim();
        }

        reportDetails = JSON.parse(text);

      } catch (error) {
        console.error("Gemini report routing failed, using fallback:", error);
        reportDetails = runFallbackReporting(category, description);
      }
    } else {
      await new Promise(r => setTimeout(r, 600));
      reportDetails = runFallbackReporting(category, description);
    }

    return NextResponse.json(reportDetails);
  } catch (error: unknown) {
    console.error("Report API error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function runFallbackReporting(category: string, description: string) {
  let department = "General Administration";
  let formalTitle = "Civic Issue Report";
  let formalSummary = `A civic issue of type ${category} has been reported: "${description}". Investigation is requested.`;
  let aiSuggestions = [
    "Place visual warnings or safety cones around the area.",
    "Alert local traffic controls if safety is compromised."
  ];

  const cat = category.toLowerCase();

  if (cat.includes("road") || cat.includes("pothole")) {
    department = "Public Works Department (PWD)";
    formalTitle = "Hazardous Road Pavement Damage";
    formalSummary = `URGENT REQUEST: Roadway defect reported. Physical description: "${description}". Structural integrity and asphalt repair required at the designated site coordinates.`;
    aiSuggestions = [
      "Use high-durability cold-mix asphalt due to seasonal moisture.",
      "Install retro-reflective hazard markers immediately to alert night drivers."
    ];
  } else if (cat.includes("garbage") || cat.includes("cleanliness") || cat.includes("dumping")) {
    department = "Municipal Sanitation Department";
    formalTitle = "Accumulated Solid Waste Discard";
    formalSummary = `SANITATION TICKET: Solid waste accumulation reported. Description: "${description}". Waste collection truck dispatch requested for site clearing and bin sterilization.`;
    aiSuggestions = [
      "Reroute local waste pickup vehicle to complete clearing within 12 hours.",
      "Check colony sensor load capacity to schedule additional bins."
    ];
  } else if (cat.includes("water") || cat.includes("leak")) {
    department = "Municipal Water Supply Board";
    formalTitle = "Subsurface/Surface Water Mains Leakage";
    formalSummary = `UTILITY TICKET: Water pipe leakage or drainage overflow reported. Description: "${description}". Supply isolation and pipe inspection team requested.`;
    aiSuggestions = [
      "Isolate adjacent pipeline grid control valves to stop water loss.",
      "Check water pressure sensor telemetry in the local sector to locate pressure drops."
    ];
  } else if (cat.includes("light") || cat.includes("street")) {
    department = "Municipal Electric Board";
    formalTitle = "Street Light Luminary Outage";
    formalSummary = `LIGHTING TICKET: Street light grid failure or individual bulb outage. Description: "${description}". Technical review requested.`;
    aiSuggestions = [
      "Replace defective high-pressure sodium bulb with low-energy LED module.",
      "Audit secondary circuit breakers to check for power supply lines shorts."
    ];
  } else if (cat.includes("traffic")) {
    department = "Traffic Police Control Room";
    formalTitle = "Local Intersection Congestion Block";
    formalSummary = `TRAFFIC TICKET: Severe vehicle backup or faulty traffic signal reported. Description: "${description}". Field officers requested.`;
    aiSuggestions = [
      "Coordinate manual traffic routing controls during peak hour rush.",
      "Send technical signal team to reset traffic controller microprocessor timer."
    ];
  }

  return {
    formalTitle,
    formalSummary,
    department,
    aiSuggestions
  };
}
