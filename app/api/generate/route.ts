import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getGeneratePrompt } from "@/lib/prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { onboardingData, format } = await req.json();

    const candidateInfo =
      onboardingData.basicData.uploadedText ||
      JSON.stringify(onboardingData.basicData.manualInput || {});

    const starAnswers = onboardingData.dynamicQuestions
      .map(
        (q: { question: string; category: string; answer: string }) =>
          `[${q.category}] Q: ${q.question}\nA: ${q.answer}`
      )
      .join("\n\n");

    const { system, user } = getGeneratePrompt(
      candidateInfo,
      onboardingData.targetSetting.companyName,
      onboardingData.targetSetting.jobDescription,
      starAnswers,
      format
    );

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const cleanJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const resumeData = JSON.parse(cleanJson);

    // Override personalInfo with user-provided name/DOB from onboarding
    const { fullName, furigana, dateOfBirth } = onboardingData.basicData;
    if (fullName) {
      resumeData.personalInfo = resumeData.personalInfo || {};
      resumeData.personalInfo.fullName = fullName;
    }
    if (furigana) {
      resumeData.personalInfo = resumeData.personalInfo || {};
      resumeData.personalInfo.furigana = furigana;
    }
    if (dateOfBirth) {
      resumeData.personalInfo = resumeData.personalInfo || {};
      resumeData.personalInfo.dateOfBirth = dateOfBirth;
    }

    return NextResponse.json({ resumeData });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "職務経歴書の生成に失敗しました" },
      { status: 500 }
    );
  }
}
