import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  TableLayoutType,
} from "docx";
import type { ResumeData } from "@/types";

// docx size is in half-points (1pt = 2 half-points)
const SZ = {
  title: 32,      // 16pt
  heading: 24,    // 12pt
  subheading: 22, // 11pt
  body: 21,       // 10.5pt
  small: 18,      // 9pt
};

const JP_FONT = "游明朝";

// Table width in DXA (twips). A4 = 11906 twips, margins 1440 each side → content = 9026
const TABLE_WIDTH_DXA = 9026;

export async function buildDocx(data: ResumeData): Promise<Blob> {
  const now = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const children: (Paragraph | Table)[] = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "職務経歴書", bold: true, size: SZ.title }),
      ],
      spacing: { after: 200 },
    })
  );

  // Date + Name (right-aligned)
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: now, size: SZ.body })],
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({
          text: `氏名 ${data.personalInfo.fullName}${data.personalInfo.furigana ? `　${data.personalInfo.furigana}` : ""}`,
          size: SZ.body,
        }),
      ],
      spacing: { after: data.personalInfo.dateOfBirth ? 0 : 200 },
    })
  );
  if (data.personalInfo.dateOfBirth) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `生年月日 ${data.personalInfo.dateOfBirth}`,
            size: SZ.body,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  }

  // Section helper
  const sectionTitle = (title: string) =>
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, size: SZ.heading })],
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "1a1a2e" },
      },
      spacing: { before: 200, after: 100 },
    });

  // Summary
  children.push(sectionTitle("【経歴要約】"));
  children.push(
    new Paragraph({
      children: [new TextRun({ text: data.summary, size: SZ.body })],
      spacing: { after: 100 },
    })
  );

  // Work Experience
  if (data.workExperience && data.workExperience.length > 0) {
    children.push(sectionTitle("【職務内容】"));
    for (const exp of data.workExperience) {
      const rows: TableRow[] = [];

      // Company header row
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${exp.startDate}～${exp.isCurrent ? "現在" : exp.endDate}`,
                      bold: true,
                      size: SZ.subheading,
                    }),
                    new TextRun({ text: "　　", size: SZ.subheading }),
                    new TextRun({
                      text: exp.companyName,
                      bold: true,
                      size: SZ.subheading,
                    }),
                  ],
                }),
                ...(exp.companyDescription
                  ? [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `事業内容：${exp.companyDescription}${exp.employeeCount ? `／従業員数：${exp.employeeCount}` : ""}`,
                            size: SZ.small,
                            color: "6b7280",
                          }),
                        ],
                      }),
                    ]
                  : []),
              ],
              shading: { fill: "f5f5f5", type: ShadingType.CLEAR, color: "auto" },
              width: { size: TABLE_WIDTH_DXA, type: WidthType.DXA },
            }),
          ],
        })
      );

      // Position row
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${exp.position}${exp.department ? `　${exp.department}` : ""}`,
                      bold: true,
                      size: SZ.subheading,
                    }),
                  ],
                }),
              ],
              width: { size: TABLE_WIDTH_DXA, type: WidthType.DXA },
            }),
          ],
        })
      );

      // Content row
      const contentParagraphs: Paragraph[] = [];
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        contentParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: "【業務内容】", bold: true, size: SZ.body })],
          })
        );
        for (const r of exp.responsibilities) {
          contentParagraphs.push(
            new Paragraph({
              children: [new TextRun({ text: `・${r}`, size: SZ.body })],
              indent: { left: 100 },
            })
          );
        }
      }
      if (exp.achievements && exp.achievements.length > 0) {
        contentParagraphs.push(
          new Paragraph({
            children: [new TextRun({ text: "【実績】", bold: true, size: SZ.body })],
          })
        );
        for (const a of exp.achievements) {
          contentParagraphs.push(
            new Paragraph({
              children: [new TextRun({ text: a, size: SZ.body })],
              indent: { left: 100 },
            })
          );
        }
      }
      if (exp.technologies && exp.technologies.length > 0) {
        contentParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `使用技術：${exp.technologies.join("、")}`,
                size: SZ.small,
                color: "6b7280",
              }),
            ],
          })
        );
      }

      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: contentParagraphs,
              width: { size: TABLE_WIDTH_DXA, type: WidthType.DXA },
            }),
          ],
        })
      );

      children.push(
        new Table({
          rows,
          width: { size: TABLE_WIDTH_DXA, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          columnWidths: [TABLE_WIDTH_DXA],
        })
      );

      children.push(new Paragraph({ spacing: { after: 100 }, children: [] }));
    }
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    children.push(sectionTitle("【スキル・知識】"));
    for (const skill of data.skills) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `・${skill}`, size: SZ.body })],
        })
      );
    }
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    children.push(sectionTitle("【資格・免許】"));
    for (const cert of data.certifications) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `・${cert.name}`, size: SZ.body })],
        })
      );
    }
  }

  // Education
  if (data.education && data.education.length > 0) {
    children.push(sectionTitle("【学歴】"));
    for (const edu of data.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.institution}${edu.degree ? ` ${edu.degree}` : ""}${edu.field ? ` ${edu.field}` : ""}`,
              size: SZ.body,
            }),
            new TextRun({
              text: `　${edu.startDate}～${edu.endDate}`,
              size: SZ.small,
              color: "6b7280",
            }),
          ],
        })
      );
    }
  }

  // Self PR
  if (data.selfPR) {
    children.push(sectionTitle("【自己PR】"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: data.selfPR, size: SZ.body })],
        spacing: { after: 100 },
      })
    );
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: JP_FONT,
            size: SZ.body,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
