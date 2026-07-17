export default function EmptyState({
  title,
  description,
}) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {title}
        </h3>

        {description && (
          <p className="mt-2 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}