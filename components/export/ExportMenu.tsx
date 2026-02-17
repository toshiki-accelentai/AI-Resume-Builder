"use client";

import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PdfExport from "./PdfExport";
import DocxExport from "./DocxExport";
import GoogleDocsExport from "./GoogleDocsExport";

export default function ExportMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Download className="w-3.5 h-3.5" />
          エクスポート
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 space-y-0.5">
        <PdfExport />
        <DocxExport />
        <GoogleDocsExport />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
