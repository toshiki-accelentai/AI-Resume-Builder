"use client";

import type { ResumeData } from "@/types";
import HeaderSection from "@/components/resume/sections/HeaderSection";
import SummarySection from "@/components/resume/sections/SummarySection";
import SkillsSection from "@/components/resume/sections/SkillsSection";
import ExperienceSection from "@/components/resume/sections/ExperienceSection";
import EducationSection from "@/components/resume/sections/EducationSection";
import SelfPRSection from "@/components/resume/sections/SelfPRSection";

interface ResumePreviewProps {
  data: ResumeData;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div className="font-sans text-foreground">
      <HeaderSection personalInfo={data.personalInfo} />
      <SummarySection summary={data.summary} />
      <SkillsSection skills={data.skills} />
      <ExperienceSection experiences={data.workExperience} />
      <EducationSection education={data.education} />
      <SelfPRSection selfPR={data.selfPR} />
    </div>
  );
}
