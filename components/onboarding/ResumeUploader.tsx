"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResumeUploaderProps {
  onTextExtracted: (text: string) => void;
}

export default function ResumeUploader({ onTextExtracted }: ResumeUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      const validTypes = [
        "application/pdf",
        "text/plain",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const isDocx = file.name.endsWith(".docx");
      if (!validTypes.includes(file.type) && !isDocx) {
        setError("PDF、Word（.docx）、またはテキストファイルのみ対応しています");
        return;
      }

      setIsLoading(true);
      setError(null);
      setFileName(file.name);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/parse-resume", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Parse failed");

        const { text } = await response.json();
        onTextExtracted(text);
      } catch {
        setError("ファイルの解析に失敗しました。別のファイルをお試しください。");
        setFileName(null);
      } finally {
        setIsLoading(false);
      }
    },
    [onTextExtracted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleClear = () => {
    setFileName(null);
    setError(null);
    onTextExtracted("");
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-accent bg-accent/5"
            : "border-border hover:border-muted-foreground"
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <p className="text-sm text-muted-foreground">解析中...</p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-8 h-8 text-primary" />
            <p className="text-sm font-medium">{fileName}</p>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="w-4 h-4 mr-1" />
              削除
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              PDF・Word・テキストファイルをドラッグ＆ドロップ
            </p>
            <label>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={handleFileInput}
              />
              <Button variant="outline" size="sm" asChild>
                <span>ファイルを選択</span>
              </Button>
            </label>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
