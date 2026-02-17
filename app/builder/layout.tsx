"use client";

import { ResumeProvider } from "@/hooks/useResumeStore";
import Header from "@/components/layout/Header";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResumeProvider>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </ResumeProvider>
  );
}
