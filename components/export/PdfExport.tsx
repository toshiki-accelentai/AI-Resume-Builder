"use client";

import { useState } from "react";
import { Loader2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/hooks/useResumeStore";

export default function PdfExport() {
  const { state } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    if (!state.resumeData) return;
    setIsGenerating(true);

    try {
      const { pdf } = await import("@react-pdf/renderer");
      const { default: ResumeDocument } = await import(
        "@/components/resume/ResumeDocument"
      );

      const blob = await pdf(
        <ResumeDocument data={state.resumeData} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "職務経歴書.pdf";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleExport}
      disabled={isGenerating || !state.resumeData}
      className="gap-1.5 text-xs"
    >
      {isGenerating ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <FileDown className="w-3.5 h-3.5" />
      )}
      PDF
    </Button>
  );
}
