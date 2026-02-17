"use client";

import { FileText } from "lucide-react";

export default function Header() {
  return (
    <header className="h-14 border-b border-border bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-navy" />
        <span className="font-bold text-navy text-lg">AI職務経歴書ビルダー</span>
      </div>
    </header>
  );
}
