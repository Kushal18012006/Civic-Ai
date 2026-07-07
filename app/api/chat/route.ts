import { NextRequest, NextResponse } from "next/server";
import { getGeminiResponse } from "../../../lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, history, context } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const reply = await getGeminiResponse(message, history || [], context || "");
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
