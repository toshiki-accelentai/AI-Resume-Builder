"use client";

import { useState } from "react";
import { Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/hooks/useResumeStore";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { buildDocx } from "@/lib/docx-builder";
import { uploadToGoogleDrive } from "@/lib/google-drive";

type ExportState =
  | "idle"
  | "authenticating"
  | "generating"
  | "uploading"
  | "done"
  | "error";

const statusLabels: Record<ExportState, string> = {
  idle: "Google Docsへ保存",
  authenticating: "認証中...",
  generating: "文書作成中...",
  uploading: "アップロード中...",
  done: "Google Docsを開きました",
  error: "エラー",
};

export default function GoogleDocsExport() {
  const { state } = useResumeStore();
  const { isReady, getAccessToken } = useGoogleAuth();
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);

  const handleExport = async () => {
    if (!state.resumeData) return;
    setError(null);
    setDocUrl(null);

    try {
      setExportState("authenticating");
      const accessToken = await getAccessToken();

      setExportState("generating");
      const blob = await buildDocx(state.resumeData);

      setExportState("uploading");
      const fileName =
        `職務経歴書_${state.resumeData.personalInfo.fullName || ""}`.trim();
      const result = await uploadToGoogleDrive(accessToken, blob, fileName);

      setExportState("done");
      setDocUrl(result.webViewLink);

      // Try opening in new tab; if blocked by popup blocker, user can click the link
      const newWindow = window.open(result.webViewLink, "_blank", "noopener,noreferrer");
      if (!newWindow) {
        setError("ポップアップがブロックされました。下のリンクからGoogle Docsを開いてください。");
      }

      setTimeout(() => {
        setExportState("idle");
        setDocUrl(null);
        setError(null);
      }, 10000);
    } catch (err) {
      setExportState("error");
      const message =
        err instanceof Error ? err.message : "エクスポートに失敗しました";

      if (message === "AUTH_EXPIRED") {
        setError("認証が切れました。もう一度お試しください。");
      } else {
        setError(message);
      }

      setTimeout(() => {
        setExportState("idle");
        setError(null);
      }, 5000);
    }
  };

  const isProcessing = ["authenticating", "generating", "uploading"].includes(
    exportState
  );

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExport}
        disabled={isProcessing || !state.resumeData || !isReady}
        className="gap-1.5 text-xs w-full justify-start"
      >
        {isProcessing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : exportState === "error" ? (
          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
        ) : exportState === "done" ? (
          <ExternalLink className="w-3.5 h-3.5 text-green-600" />
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path
              d="M14.727 6.727H14V2H6.182C5.529 2 5 2.53 5 3.182v17.636C5 21.471 5.53 22 6.182 22h11.636c.653 0 1.182-.53 1.182-1.182V6.727h-4.273z"
              fill="#4285F4"
            />
            <path d="M14.727 6.727H19L14 2v4.727h.727z" fill="#A1C2FA" />
            <path d="M8 13h8v1H8zm0 2h8v1H8zm0 2h5v1H8z" fill="white" />
          </svg>
        )}
        {statusLabels[exportState]}
      </Button>

      {error && (
        <p className="text-[10px] text-red-500 px-2 pb-1 leading-tight">
          {error}
        </p>
      )}

      {docUrl && exportState === "done" && (
        <a
          href={docUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-blue-600 hover:underline px-2 pb-1 block leading-tight font-medium"
        >
          Google Docsを開く
        </a>
      )}
    </div>
  );
}
