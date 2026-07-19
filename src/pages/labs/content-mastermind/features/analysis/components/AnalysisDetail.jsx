import SectionCard from "../../../shared/components/SectionCard";
import EmptyState from "../../../shared/components/EmptyState";
import Button from "../../../shared/components/Button";

export default function AnalysisDetail({
  analysis,
  onGenerate,
  generating = false,
}) {
  if (!analysis) {
    return (
      <EmptyState
        title="No analysis selected"
        description="Select an article from the list to view its analysis."
      />
    );
  }

  return (
    <div className="space-y-5 p-5">
      <SectionCard
        title="Summary"
        action={
          <Button
            loading={generating}
            loadingText="Generando Post ..."
            onClick={() => onGenerate?.(analysis.id)}
          >
            Generar Post
          </Button>
        }
      >
        <p className="leading-7 text-gray-700">
          {analysis.summary || "-"}
        </p>
      </SectionCard>

      <SectionCard title="Key Takeaways">
        {analysis.key_takeaways?.length ? (
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            {analysis.key_takeaways.map((item, index) => (
              <li key={`${item}-${index}`}>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">
            No key takeaways available.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Keywords">
        {analysis.keywords?.length ? (
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, index) => (
              <span
                key={`${keyword}-${index}`}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No keywords available.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Recommended Action">
        <p className="leading-7 text-gray-700">
          {analysis.recommended_action || "-"}
        </p>
      </SectionCard>

      <SectionCard title="Metadata">
        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <Info
            label="Topic"
            value={analysis.topic}
          />

          <Info
            label="Audience"
            value={analysis.target_audience}
          />

          <Info
            label="Sentiment"
            value={analysis.sentiment}
          />

          <Info
            label="Relevance"
            value={
              analysis.relevance_score !== null &&
              analysis.relevance_score !== undefined
                ? `${analysis.relevance_score}/10`
                : "-"
            }
          />

          <Info
            label="Confidence"
            value={
              analysis.confidence_score !== null &&
              analysis.confidence_score !== undefined
                ? `${analysis.confidence_score}/10`
                : "-"
            }
          />

          <Info
            label="Provider"
            value={analysis.ai_provider}
          />

          <Info
            label="Model"
            value={analysis.ai_model}
          />

          <Info
            label="Prompt"
            value={analysis.prompt_version}
          />
        </div>
      </SectionCard>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-medium text-gray-800">
        {value || "-"}
      </p>
    </div>
  );
}