import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { srs } = await req.json();

    if (!srs || !srs.title || !Array.isArray(srs.functionalRequirements) || !Array.isArray(srs.nonFunctionalRequirements)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing SRS object" },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert requirements analyst. Based on the provided SRS summary, generate focused clarification questions to remove ambiguity. Return ONLY a JSON object with an array field \"questions\". Each question must be short, specific, and answerable by the client in 1-2 sentences. Prefer questions that materially affect scope, constraints, acceptance criteria, integrations, and edge cases.`;

    const userPrompt = `SRS Summary (JSON): ${JSON.stringify({
      title: srs.title,
      overview: srs.overview,
      functionalRequirements: srs.functionalRequirements?.slice(0, 12),
      nonFunctionalRequirements: srs.nonFunctionalRequirements?.slice(0, 12),
      technicalStack: srs.technicalStack || []
    })}

Generate 4-6 questions. Structure:
{"questions": ["q1", "q2", ...]}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 512
    });

    const responseText = completion.choices[0]?.message?.content?.trim();
    if (!responseText) {
      return NextResponse.json({ success: false, error: "No response from AI" }, { status: 500 });
    }

    let questions = [];
    try {
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed?.questions)) {
        questions = parsed.questions.filter((q) => typeof q === "string" && q.trim()).slice(0, 8);
      }
    } catch (_) {
      // Fallback: split by newlines
      questions = responseText
        .split(/\n+/)
        .map((l) => l.replace(/^[-*\d\.\)\s]+/, "").trim())
        .filter(Boolean)
        .slice(0, 6);
    }

    if (questions.length === 0) {
      return NextResponse.json({ success: false, error: "Failed to generate questions" }, { status: 500 });
    }

    return NextResponse.json({ success: true, questions });
  } catch (error) {
    console.error("Groq Clarify Error:", error);
    const status = error.message?.includes("API key") ? 401 : 500;
    const msg = error.message?.includes("API key") ? "Invalid or missing Groq API key" : "Failed to generate clarification questions";
    return NextResponse.json({ success: false, error: msg }, { status });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: "Use POST with SRS payload" }, { status: 405 });
}


