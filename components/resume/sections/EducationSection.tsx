import type { Education } from "@/types";

interface EducationSectionProps {
  education: Education[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  if (!education || education.length === 0) return null;

  return (
    <div className="mb-4">
      <h2
        className="font-bold border-b border-foreground pb-0.5 mb-2"
        style={{ fontSize: "12pt" }}
      >
        【学歴】
      </h2>
      <div className="space-y-0.5" style={{ fontSize: "10.5pt" }}>
        {education.map((edu) => (
          <div key={edu.id} className="flex items-center justify-between">
            <span>
              {edu.institution}
              {edu.degree ? ` ${edu.degree}` : ""}
              {edu.field ? ` ${edu.field}` : ""}
            </span>
            <span className="text-muted-foreground" style={{ fontSize: "9pt" }}>
              {edu.startDate}～{edu.endDate}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
