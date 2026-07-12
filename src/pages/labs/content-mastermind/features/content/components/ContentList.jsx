import ContentListItem from "./ContentListItem";

export default function ContentList({
  contents,
  selectedContent,
  onSelect,
}) {

  if (!contents.length) {
    return (
      <div className="p-8 text-center text-gray-500">

        <p className="text-lg font-medium">
          No se encontraron contenidos
        </p>

        <p className="mt-2 text-sm">
          Intenta cambiar el filtro o la búsqueda.
        </p>

      </div>
    );
  }

  return (
    <div>

      {contents.map(content => (

        <ContentListItem
          key={content.id}
          content={content}
          selected={selectedContent?.id === content.id}
          onClick={() => onSelect(content)}
        />

      ))}

    </div>
  );
}