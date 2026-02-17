import { NextRequest, NextResponse } from "next/server";

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

    // PDF — dynamic import to avoid pdf-parse test file loading issue
    if (file.type === "application/pdf") {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse/lib/pdf-parse.js");
      const data = await pdfParse(buffer);
      return NextResponse.json({ text: data.text });
    }

    // DOCX
    if (file.type === DOCX_TYPE || file.name.endsWith(".docx")) {
      const mammoth = (await import("mammoth")).default;
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value });
    }

    // Plain text fallback
    const text = buffer.toString("utf-8");
    return NextResponse.json({ text });
  } catch (err) {
    console.error("parse-resume error:", err);
    return NextResponse.json(
      { error: "ファイルの解析に失敗しました" },
      { status: 500 }
    );
  }
}
