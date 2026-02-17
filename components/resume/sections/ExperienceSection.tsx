import type { WorkExperience } from "@/types";

interface ExperienceSectionProps {
  experiences: WorkExperience[];
}

export default function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <div className="mb-4">
      <h2
        className="font-bold border-b border-foreground pb-0.5 mb-2"
        style={{ fontSize: "12pt" }}
      >
        【職務内容】
      </h2>
      <div className="space-y-3">
        {experiences.map((exp) => (
          <div key={exp.id} className="border border-foreground/40">
            {/* Company header row */}
            <div className="border-b border-foreground/40 px-2 py-1 bg-secondary/30">
              <div className="flex items-center justify-between" style={{ fontSize: "11pt" }}>
                <span className="font-bold">
                  {exp.startDate}～{exp.isCurrent ? "現在" : exp.endDate}
                </span>
                <span className="font-bold">{exp.companyName}</span>
              </div>
              {exp.companyDescription && (
                <p className="text-muted-foreground" style={{ fontSize: "9pt" }}>
                  事業内容：{exp.companyDescription}
                  {exp.employeeCount ? `／従業員数：${exp.employeeCount}` : ""}
                </p>
              )}
            </div>

            {/* Position */}
            <div className="px-2 py-1 border-b border-foreground/20">
              <p className="font-bold" style={{ fontSize: "11pt" }}>
                {exp.position}
                {exp.department ? `　${exp.department}` : ""}
              </p>
            </div>

            {/* Content area */}
            <div className="px-2 py-1.5 space-y-1.5" style={{ fontSize: "10.5pt" }}>
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div>
                  <p className="font-bold">【業務内容】</p>
                  <ul className="ml-1">
                    {exp.responsibilities.map((r, i) => (
                      <li key={i}>・{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {exp.achievements && exp.achievements.length > 0 && (
                <div>
                  <p className="font-bold">【実績】</p>
                  {exp.achievements.map((a, i) => (
                    <p key={i} className="ml-1">{a}</p>
                  ))}
                </div>
              )}

              {exp.technologies && exp.technologies.length > 0 && (
                <p className="text-muted-foreground" style={{ fontSize: "9pt" }}>
                  使用技術：{exp.technologies.join("、")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
