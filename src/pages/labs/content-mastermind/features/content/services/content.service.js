import { supabase } from "../../../lib/supabase";

async function fetchByIds(table, columns, ids) {
  if (!ids.length) return new Map();

  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .in("id", ids);

  if (error) throw error;
  return new Map((data || []).map((item) => [String(item.id), item]));
}

export async function getContents() {
  const { data, error } = await supabase
    .from("generated_content")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = Array.isArray(data) ? data : [];
  const articleIds = [...new Set(rows.map((item) => item.article_id).filter(Boolean))];
  const analysisIds = [...new Set(rows.map((item) => item.analysis_id).filter(Boolean))];

  const articles = await fetchByIds(
    "articles",
    "id,title,url,source_id,published_at,created_at,status",
    articleIds
  );
  const analyses = await fetchByIds(
    "article_analysis",
    "id,topic,relevance_score,target_audience,summary",
    analysisIds
  );
  const sourceIds = [...new Set([...articles.values()].map((item) => item.source_id).filter(Boolean))];
  const sources = await fetchByIds("sources", "id,name,slug", sourceIds);

  return rows.map((item) => {
    const article = articles.get(String(item.article_id)) || null;
    const analysis = item.analysis_id
      ? analyses.get(String(item.analysis_id)) || null
      : null;
    const source = article?.source_id
      ? sources.get(String(article.source_id)) || null
      : null;

    return {
      ...item,
      article,
      analysis,
      article_title: article?.title || null,
      source,
      source_id: source?.id || article?.source_id || null,
      source_name: source?.name || null,
      source_slug: source?.slug || null,
      topic: analysis?.topic || null,
      relevance_score: analysis?.relevance_score ?? null,
    };
  });
}
