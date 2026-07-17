import EmptyState from "../../../shared/components/EmptyState";
import SectionCard from "../../../shared/components/SectionCard";

export default function AnalysisDetail({
  analysis,
}) {
  if (!analysis) {
    return (
      <EmptyState
        title="No analysis selected"
        description="Select an article from the list."
      />
    );
  }

  return (
    <div className="space-y-4 p-4">

      <SectionCard title="Summary">
        <p>{analysis.summary}</p>
      </SectionCard>

      <SectionCard title="Key Takeaways">
        <ul className="list-disc pl-5 space-y-2">
          {analysis.key_takeaways.map((item) => (
            <li key={item}>
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Keywords">
        <div className="flex flex-wrap gap-2">
          {analysis.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recommended Action">
        <p>{analysis.recommended_action}</p>
      </SectionCard>

    </div>
  );
}