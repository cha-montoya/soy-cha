import { useEffect, useState } from "react";

import useContent from "../hooks/useContent";

import FilterBar from "../components/FilterBar";
import ContentList from "../components/ContentList";
import ContentListItem from "../components/ContentListItem";
import ContentDetail from "../components/ContentDetail";
import StatusBadge from "../components/StatusBadge";
import SearchBar from "../components/SearchBar";

export default function Content() {
  const { contents, loading, error } = useContent();

  const [selectedContent, setSelectedContent] = useState(null);
  const [filter, setFilter] = useState("all");

  const [search, setSearch] = useState("");

  const filteredContents = contents
  .filter((content) => {
    const matchesStatus =
      filter === "all"
        ? true
        : filter === "draft"
        ? content.status === "draft"
        : filter === "image_ready"
        ? content.image_status === "ready"
        : filter === "pending_review"
        ? content.review_status === "pending"
        : filter === "published"
        ? content.status === "published"
        : true;

    const matchesSearch = content.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  })
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  useEffect(() => {
    if (!filteredContents.length) {
      setSelectedContent(null);
      return;
    }

    const exists = filteredContents.find(
      (item) => item.id === selectedContent?.id
    );

    if (!exists) {
      setSelectedContent(filteredContents[0]);
    }
  }, [filteredContents, selectedContent]);

  if (loading) {
    return <p>Cargando contenido...</p>;
  }

  if (error) {
    return <p>Error cargando contenido.</p>;
  }

  return (
    <div className="flex gap-6 h-full">
      
      <div className="w-1/3 flex flex-col">
        <div className="mb-3">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="mb-3">
          <FilterBar
            value={filter}
            onChange={setFilter}
          />
        </div>

        <p className="mb-3 text-sm text-gray-500">
          {filteredContents.length} contenido
          {filteredContents.length !== 1 ? "s" : ""}
        </p>

        <div className="border rounded-lg overflow-auto flex-1">
          <ContentList
            contents={filteredContents}
            selectedContent={selectedContent}
            onSelect={setSelectedContent}
          />
        </div>
      </div>

      <div className="flex-1 border rounded-lg overflow-auto">
        <ContentDetail
          content={selectedContent}
        />
      </div>
    </div>
  );
}