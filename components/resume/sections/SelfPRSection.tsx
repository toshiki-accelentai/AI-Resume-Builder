interface SelfPRSectionProps {
  selfPR: string;
}

export default function SelfPRSection({ selfPR }: SelfPRSectionProps) {
  if (!selfPR) return null;

  return (
    <div className="mb-4">
      <h2
        className="font-bold border-b border-foreground pb-0.5 mb-2"
        style={{ fontSize: "12pt" }}
      >
        【自己PR】
      </h2>
      <div
        className="leading-relaxed whitespace-pre-wrap"
        style={{ fontSize: "10.5pt" }}
      >
        {selfPR}
      </div>
    </div>
  );
}
