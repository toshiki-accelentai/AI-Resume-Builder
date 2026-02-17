import type { PersonalInfo } from "@/types";

interface HeaderSectionProps {
  personalInfo: PersonalInfo;
}

export default function HeaderSection({ personalInfo }: HeaderSectionProps) {
  const now = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <div className="mb-6">
      <h1
        className="font-bold text-center tracking-widest mb-4"
        style={{ fontSize: "16pt" }}
      >
        職務経歴書
      </h1>
      <div className="text-right space-y-0.5" style={{ fontSize: "10.5pt" }}>
        <p>{now}</p>
        <p>
          氏名 {personalInfo.fullName}
          {personalInfo.furigana ? `　${personalInfo.furigana}` : ""}
        </p>
        {personalInfo.dateOfBirth && (
          <p>生年月日 {personalInfo.dateOfBirth}</p>
        )}
      </div>
    </div>
  );
}
