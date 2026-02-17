import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // PDF
    if (file.type === "application/pdf") {
      const data = await pdfParse(buffer);
      return NextResponse.json({ text: data.text });
    }

    // DOCX
    if (file.type === DOCX_TYPE || file.name.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value });
    }

    // Plain text fallback
    const text = buffer.toString("utf-8");
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { error: "ファイルの解析に失敗しました" },
      { status: 500 }
    );
  }
}
