"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useResumeStore } from "@/hooks/useResumeStore";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ResumePreview from "./ResumePreview";
import EditHistory from "./EditHistory";
import ExportMenu from "@/components/export/ExportMenu";

// A4 page dimensions in px at 96dpi
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const PADDING_MM = 20;
const MM_TO_PX = 3.7795275591; // 1mm ≈ 3.78px at 96dpi
const PAGE_CONTENT_HEIGHT = (PAGE_HEIGHT_MM - PADDING_MM * 2) * MM_TO_PX;

export default function PreviewPanel() {
  const { state } = useResumeStore();
  const router = useRouter();
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  const measure = useCallback(() => {
    if (!measureRef.current) return;
    const contentHeight = measureRef.current.scrollHeight;
    setPageCount(Math.max(1, Math.ceil(contentHeight / PAGE_CONTENT_HEIGHT)));
  }, []);

  useEffect(() => {
    measure();
  }, [state.resumeData, measure]);

  // ResizeObserver to handle dynamic content changes
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  if (!state.resumeData) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        職務経歴書を生成してください
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-secondary/30">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-white">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-1.5 text-xs"
          >
            <Home className="w-3.5 h-3.5" />
            トップ
          </Button>
          <EditHistory />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {pageCount}ページ
          </span>
          <ExportMenu />
        </div>
      </div>
      {/* Hidden measurement container — placed outside scroll area */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          visibility: "hidden",
          top: 0,
          left: "-9999px",
          width: `${(PAGE_WIDTH_MM - PADDING_MM * 2) * MM_TO_PX}px`,
          pointerEvents: "none",
        }}
      >
        <div ref={measureRef}>
          <ResumePreview data={state.resumeData} />
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">

        {/* Visible pages */}
        <div className="flex flex-col items-center" style={{ gap: "40px" }}>
          {Array.from({ length: pageCount }, (_, pageIndex) => (
            <div
              key={pageIndex}
              className="bg-white border border-border relative shrink-0"
              style={{
                width: `${PAGE_WIDTH_MM}mm`,
                height: `${PAGE_HEIGHT_MM}mm`,
                padding: `${PADDING_MM}mm`,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              }}
            >
              <div
                style={{
                  height: `${PAGE_CONTENT_HEIGHT}px`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    transform: `translateY(-${pageIndex * PAGE_CONTENT_HEIGHT}px)`,
                  }}
                >
                  <ResumePreview data={state.resumeData!} />
                </div>
              </div>
              {/* Page number */}
              <div
                className="absolute bottom-2 right-4 text-xs text-muted-foreground"
              >
                {pageIndex + 1} / {pageCount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
