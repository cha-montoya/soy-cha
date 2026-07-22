import { useEffect, useMemo, useState } from "react";

import { routes } from "../../../config/routes";
import useSelectedResource from "../../../shared/hooks/useSelectedResource";

import useContent from "../hooks/useContent";

import FilterBar from "../components/FilterBar";
import ContentList from "../components/ContentList";
import ContentDetail from "../components/ContentDetail";
import SearchBar from "../components/SearchBar";

import SectionLoader from "../../../shared/components/SectionLoader";

export default function Content() {
  const { contents, loading, error } = useContent();

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const {
    selectedResource: selectedContent,
    selectResource: selectContent,
    invalidSelection,
  } = useSelectedResource(contents, routes.content, {
    loading,
    autoSelectFirst: true,
  });

  const filteredContents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return contents
      .filter((content) => {
        const matchesStatus =
          filter === "all"
            ? true
            : filter === "draft"
              ? content.status === "draft"
              : filter === "image_ready"
                ? content.image_status === "ready" ||
                  content.image_status === "generated"
                : filter === "pending_review"
                  ? content.review_status === "pending"
                  : filter === "published"
                    ? content.status === "published"
                    : true;

        const matchesSearch = normalizedSearch
          ? String(content.title || "")
              .toLowerCase()
              .includes(normalizedSearch)
          : true;

        return matchesStatus && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
  }, [contents, filter, search]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (invalidSelection) {
      return;
    }

    if (!filteredContents.length) {
      return;
    }

    if (!selectedContent) {
      return;
    }

    const selectedIsVisible = filteredContents.some(
      (item) => item.id === selectedContent.id
    );

    if (!selectedIsVisible) {
      selectContent(filteredContents[0], {
        replace: true,
      });
    }
  }, [
    filteredContents,
    invalidSelection,
    loading,
    selectedContent,
    selectContent,
  ]);

  if (loading) {
    return (
      <SectionLoader text="Loading generated content..." />
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-800">
          Unable to load generated content
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error?.message || "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      <div className="flex w-1/3 flex-col">
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

        <div className="flex-1 overflow-auto rounded-lg border">
          <ContentList
            contents={filteredContents}
            selectedContent={selectedContent}
            onSelect={selectContent}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border">
        {invalidSelection ? (
          <div className="flex min-h-80 items-center justify-center p-8">
            <div className="max-w-md text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Content not found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                The selected content does not exist or is no longer
                available.
              </p>
            </div>
          </div>
        ) : (
          <ContentDetail content={selectedContent} />
        )}
      </div>
    </div>
  );
}