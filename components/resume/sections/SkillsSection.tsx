interface SkillsSectionProps {
  skills: string[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="mb-4">
      <h2
        className="font-bold border-b border-foreground pb-0.5 mb-2"
        style={{ fontSize: "12pt" }}
      >
        【スキル・知識】
      </h2>
      <div className="space-y-0.5" style={{ fontSize: "10.5pt" }}>
        {skills.map((skill, i) => (
          <p key={i}>・{skill}</p>
        ))}
      </div>
    </div>
  );
}
