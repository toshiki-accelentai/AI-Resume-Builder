import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getInterviewPrompt } from "@/lib/prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { basicData, targetSetting } = await req.json();

    const candidateInfo =
      basicData.uploadedText || JSON.stringify(basicData.manualInput || {});

    const { system, user } = getInterviewPrompt(
      candidateInfo,
      targetSetting.companyName,
      targetSetting.jobDescription
    );

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system,
      messages: [{ role: "user", content: user }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const cleanJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const questions = JSON.parse(cleanJson);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "質問の生成に失敗しました" },
      { status: 500 }
    );
  }
}
