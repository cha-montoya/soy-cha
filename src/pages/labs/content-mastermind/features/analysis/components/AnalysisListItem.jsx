export default function AnalysisListItem({
  analysis,
  selected,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full
        text-left
        p-4
        border-b
        transition-colors
        hover:bg-gray-50
        ${
          selected
            ? "bg-blue-50 border-l-4 border-l-blue-600"
            : "bg-white"
        }
      `}
    >
      <p className="text-xs text-gray-500">
        {analysis.topic}
      </p>

      <h3 className="mt-1 font-semibold line-clamp-2">
        {analysis.summary}
      </h3>

      <div className="mt-3 flex justify-between text-xs text-gray-500">

        <span>{analysis.target_audience}</span>

        <span>
          {analysis.confidence_score}/10
        </span>

      </div>
    </button>
  );
}