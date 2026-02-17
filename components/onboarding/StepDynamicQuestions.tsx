"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Sparkles, Loader2 } from "lucide-react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { STAR_CATEGORIES, FORMAT_OPTIONS } from "@/lib/constants";
import type { DynamicQuestion } from "@/types";

interface StepDynamicQuestionsProps {
  onBack: () => void;
}

export default function StepDynamicQuestions({
  onBack,
}: StepDynamicQuestionsProps) {
  const { state, dispatch } = useResumeStore();
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [format, setFormat] = useState<"chronological" | "reverse-chronological">(
    "reverse-chronological"
  );

  const questions = state.onboardingData.dynamicQuestions;

  useEffect(() => {
    if (questions.length > 0) return;

    async function fetchQuestions() {
      setIsLoadingQuestions(true);
      setError(null);
      try {
        const response = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            basicData: state.onboardingData.basicData,
            targetSetting: state.onboardingData.targetSetting,
          }),
        });

        if (!response.ok) throw new Error("Failed to generate questions");

        const { questions: rawQuestions } = await response.json();
        const formatted: DynamicQuestion[] = rawQuestions.map(
          (q: { id?: string; question: string; category: string }) => ({
            id: q.id || nanoid(),
            question: q.question,
            category: q.category,
            answer: "",
          })
        );

        dispatch({ type: "SET_DYNAMIC_QUESTIONS", payload: formatted });
      } catch {
        setError("質問の生成に失敗しました。もう一度お試しください。");
      } finally {
        setIsLoadingQuestions(false);
      }
    }

    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerChange = (id: string, answer: string) => {
    dispatch({ type: "UPDATE_QUESTION_ANSWER", payload: { id, answer } });
  };

  const allAnswered = questions.length > 0 && questions.every((q) => q.answer.trim().length > 0);

  const handleGenerateResume = async () => {
    setIsGeneratingResume(true);
    setError(null);
    dispatch({ type: "SET_GENERATING", payload: true });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          onboardingData: state.onboardingData,
          format,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate resume");

      const { resumeData } = await response.json();
      resumeData.format = format;

      dispatch({ type: "SET_RESUME_DATA", payload: resumeData });
      dispatch({
        type: "PUSH_HISTORY",
        payload: {
          id: nanoid(),
          timestamp: Date.now(),
          label: "初回生成",
          resumeData: structuredClone(resumeData),
        },
      });
      dispatch({ type: "SET_PHASE", payload: "editing" });
    } catch {
      setError("職務経歴書の生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsGeneratingResume(false);
      dispatch({ type: "SET_GENERATING", payload: false });
    }
  };

  return (
    <div className="space-y-6">
      {isLoadingQuestions ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <p className="text-sm text-muted-foreground">
            AIが質問を生成しています...
          </p>
        </div>
      ) : (
        <>
          {questions.length > 0 && (
            <Accordion type="multiple" defaultValue={questions.map((q) => q.id)}>
              {questions.map((q, index) => (
                <AccordionItem key={q.id} value={q.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={
                          STAR_CATEGORIES[q.category]?.color || ""
                        }
                      >
                        {STAR_CATEGORIES[q.category]?.label || q.category}
                      </Badge>
                      <span className="text-sm">
                        質問 {index + 1}: {q.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      placeholder="できるだけ具体的に回答してください。数値やエピソードを含めると効果的です。"
                      value={q.answer}
                      onChange={(e) =>
                        handleAnswerChange(q.id, e.target.value)
                      }
                      rows={4}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">
              職務経歴書のフォーマット
            </label>
            <Select
              value={format}
              onValueChange={(v) =>
                setFormat(v as "chronological" | "reverse-chronological")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          戻る
        </Button>
        <Button
          onClick={handleGenerateResume}
          disabled={!allAnswered || isGeneratingResume}
        >
          {isGeneratingResume ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-1" />
              職務経歴書を生成
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
