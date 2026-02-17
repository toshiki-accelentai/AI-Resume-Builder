import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getChatPrompt } from "@/lib/prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { resumeData, instruction, targetSetting } = await req.json();

    const { system, user } = getChatPrompt(
      JSON.stringify(resumeData),
      targetSetting.companyName,
      instruction
    );

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 16384,
      system,
      messages: [{ role: "user", content: user }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const separator = "---JSON---";
    let explanation = responseText;
    let updatedResumeData = null;

    if (responseText.includes(separator)) {
      explanation = responseText.split(separator)[0].trim();
      const jsonPart = responseText.split(separator).slice(1).join(separator);
      const cleanJson = jsonPart
        .trim()
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      try {
        updatedResumeData = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Chat JSON parse failed on server:", e);
      }
    }

    return NextResponse.json({ explanation, updatedResumeData });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    );
  }
}
