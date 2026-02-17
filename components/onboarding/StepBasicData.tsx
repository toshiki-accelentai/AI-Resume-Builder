"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useResumeStore } from "@/hooks/useResumeStore";
import ResumeUploader from "./ResumeUploader";

interface StepBasicDataProps {
  onNext: () => void;
}

export default function StepBasicData({ onNext }: StepBasicDataProps) {
  const { state, dispatch } = useResumeStore();
  const [manualText, setManualText] = useState(
    state.onboardingData.basicData.uploadedText || ""
  );
  const [activeTab, setActiveTab] = useState(
    state.onboardingData.basicData.method
  );
  const [fullName, setFullName] = useState(
    state.onboardingData.basicData.fullName || ""
  );
  const [furigana, setFurigana] = useState(
    state.onboardingData.basicData.furigana || ""
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    state.onboardingData.basicData.dateOfBirth || ""
  );

  const handleTextExtracted = (text: string) => {
    dispatch({
      type: "UPDATE_BASIC_DATA",
      payload: { method: "upload", uploadedText: text },
    });
  };

  const handleNext = () => {
    const personalFields = { fullName, furigana, dateOfBirth };
    if (activeTab === "manual") {
      dispatch({
        type: "UPDATE_BASIC_DATA",
        payload: { method: "manual", uploadedText: manualText, ...personalFields },
      });
    } else {
      dispatch({
        type: "UPDATE_BASIC_DATA",
        payload: personalFields,
      });
    }
    onNext();
  };

  const hasName = fullName.trim().length > 0;
  const canProceed =
    hasName &&
    ((activeTab === "upload" && !!state.onboardingData.basicData.uploadedText) ||
    (activeTab === "manual" && manualText.length > 0));

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="full-name">
              氏名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="full-name"
              placeholder="山田 太郎"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="furigana">ふりがな</Label>
            <Input
              id="furigana"
              placeholder="やまだ たろう"
              value={furigana}
              onChange={(e) => setFurigana(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="date-of-birth">生年月日</Label>
          <Input
            id="date-of-birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="mt-1 w-48"
          />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "upload" | "manual")}
      >
        <TabsList className="w-full">
          <TabsTrigger value="upload" className="flex-1">
            アップロード
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex-1">
            手動入力
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <ResumeUploader onTextExtracted={handleTextExtracted} />
          {state.onboardingData.basicData.uploadedText && (
            <div className="mt-3 p-3 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">抽出されたテキスト:</p>
              <p className="text-sm line-clamp-5 whitespace-pre-wrap">
                {state.onboardingData.basicData.uploadedText}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="manual" className="mt-4 space-y-3">
          <div>
            <Label htmlFor="manual-text">職歴・スキルのテキスト</Label>
            <Textarea
              id="manual-text"
              placeholder="これまでの職歴、スキル、資格などを自由に入力してください..."
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              rows={8}
              className="mt-1"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!canProceed}>
          次へ
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
