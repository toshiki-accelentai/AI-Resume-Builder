"use client";

import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/types";
import { pdfStyles } from "@/lib/pdf-styles";

interface ResumeDocumentProps {
  data: ResumeData;
}

export default function ResumeDocument({ data }: ResumeDocumentProps) {
  const now = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page} wrap>
        {/* Header */}
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>職務経歴書</Text>
          <Text style={pdfStyles.dateNameRow}>{now}</Text>
          <Text style={pdfStyles.name}>
            氏名 {data.personalInfo.fullName}
            {data.personalInfo.furigana ? `　${data.personalInfo.furigana}` : ""}
          </Text>
          {data.personalInfo.dateOfBirth && (
            <Text style={pdfStyles.name}>
              生年月日 {data.personalInfo.dateOfBirth}
            </Text>
          )}
        </View>

        {/* Summary */}
        <View style={pdfStyles.section} wrap={false}>
          <Text style={pdfStyles.sectionTitle}>【経歴要約】</Text>
          <Text style={pdfStyles.body}>{data.summary}</Text>
        </View>

        {/* Work Experience */}
        {data.workExperience && data.workExperience.length > 0 && (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>【職務内容】</Text>
            {data.workExperience.map((exp) => (
              <View key={exp.id} style={pdfStyles.expBox} wrap={false}>
                <View style={pdfStyles.expHeader}>
                  <Text style={pdfStyles.expHeaderBold}>
                    {exp.startDate}～{exp.isCurrent ? "現在" : exp.endDate}
                  </Text>
                  <Text style={pdfStyles.expHeaderBold}>{exp.companyName}</Text>
                </View>
                {exp.companyDescription && (
                  <View style={pdfStyles.expDesc}>
                    <Text>
                      事業内容：{exp.companyDescription}
                      {exp.employeeCount ? `／従業員数：${exp.employeeCount}` : ""}
                    </Text>
                  </View>
                )}
                <Text style={pdfStyles.expPosition}>
                  {exp.position}
                  {exp.department ? `　${exp.department}` : ""}
                </Text>
                <View style={pdfStyles.expContent}>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <>
                      <Text style={pdfStyles.subLabel}>【業務内容】</Text>
                      {exp.responsibilities.map((r, i) => (
                        <Text key={i} style={pdfStyles.bulletItem}>・{r}</Text>
                      ))}
                    </>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <>
                      <Text style={pdfStyles.subLabel}>【実績】</Text>
                      {exp.achievements.map((a, i) => (
                        <Text key={i} style={pdfStyles.bulletItem}>{a}</Text>
                      ))}
                    </>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <Text style={{ fontSize: 7, color: "#6b7280", marginTop: 2 }}>
                      使用技術：{exp.technologies.join("、")}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={pdfStyles.section} wrap={false}>
            <Text style={pdfStyles.sectionTitle}>【スキル・知識】</Text>
            {data.skills.map((skill, i) => (
              <Text key={i} style={pdfStyles.skillItem}>・{skill}</Text>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={pdfStyles.section} wrap={false}>
            <Text style={pdfStyles.sectionTitle}>【資格・免許】</Text>
            {data.certifications.map((cert) => (
              <Text key={cert.id} style={pdfStyles.skillItem}>・{cert.name}</Text>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={pdfStyles.section} wrap={false}>
            <Text style={pdfStyles.sectionTitle}>【学歴】</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={pdfStyles.eduRow}>
                <Text>
                  {edu.institution}
                  {edu.degree ? ` ${edu.degree}` : ""}
                  {edu.field ? ` ${edu.field}` : ""}
                </Text>
                <Text style={pdfStyles.period}>{edu.startDate}～{edu.endDate}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Self PR */}
        {data.selfPR && (
          <View style={pdfStyles.section} wrap={false}>
            <Text style={pdfStyles.sectionTitle}>【自己PR】</Text>
            <Text style={pdfStyles.body}>{data.selfPR}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
