"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { targetSettingSchema, type TargetSettingFormData } from "@/lib/resume-schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useResumeStore } from "@/hooks/useResumeStore";

interface StepTargetSettingProps {
  onNext: () => void;
  onBack: () => void;
}

export default function StepTargetSetting({
  onNext,
  onBack,
}: StepTargetSettingProps) {
  const { state, dispatch } = useResumeStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TargetSettingFormData>({
    resolver: zodResolver(targetSettingSchema),
    defaultValues: {
      companyName: state.onboardingData.targetSetting.companyName,
      jobDescription: state.onboardingData.targetSetting.jobDescription,
      jobTitle: state.onboardingData.targetSetting.jobTitle || "",
      industry: state.onboardingData.targetSetting.industry || "",
    },
  });

  const onSubmit = (data: TargetSettingFormData) => {
    dispatch({ type: "UPDATE_TARGET_SETTING", payload: data });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <Label htmlFor="companyName">
          応募先企業名 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="companyName"
          placeholder="例: 株式会社〇〇"
          {...register("companyName")}
          className="mt-1"
        />
        {errors.companyName && (
          <p className="text-sm text-destructive mt-1">
            {errors.companyName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="jobTitle">募集職種</Label>
        <Input
          id="jobTitle"
          placeholder="例: プロジェクトマネージャー"
          {...register("jobTitle")}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="industry">業界</Label>
        <Input
          id="industry"
          placeholder="例: IT・通信"
          {...register("industry")}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="jobDescription">
          求人内容（JD） <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="jobDescription"
          placeholder="求人票の内容をコピー＆ペーストしてください..."
          {...register("jobDescription")}
          rows={10}
          className="mt-1"
        />
        {errors.jobDescription && (
          <p className="text-sm text-destructive mt-1">
            {errors.jobDescription.message}
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          戻る
        </Button>
        <Button type="submit">
          次へ
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </form>
  );
}
