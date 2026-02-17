"use client";

import { useState } from "react";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/hooks/useResumeStore";
import { buildDocx } from "@/lib/docx-builder";
import { saveAs } from "file-saver";

export default function DocxExport() {
  const { state } = useResumeStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    if (!state.resumeData) return;
    setIsGenerating(true);

    try {
      const blob = await buildDocx(state.resumeData);
      saveAs(blob, "職務経歴書.docx");
    } catch (error) {
      console.error("DOCX export error:", error);
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
        <FileText className="w-3.5 h-3.5" />
      )}
      Word
    </Button>
  );
}
