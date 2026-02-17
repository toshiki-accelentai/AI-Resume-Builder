interface SummarySectionProps {
  summary: string;
}

export default function SummarySection({ summary }: SummarySectionProps) {
  return (
    <div className="mb-4">
      <h2
        className="font-bold border-b border-foreground pb-0.5 mb-2"
        style={{ fontSize: "12pt" }}
      >
        【経歴要約】
      </h2>
      <p
        className="leading-relaxed whitespace-pre-wrap"
        style={{ fontSize: "10.5pt" }}
      >
        {summary}
      </p>
    </div>
  );
}
