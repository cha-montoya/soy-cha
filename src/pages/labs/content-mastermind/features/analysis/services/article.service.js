import { supabase } from "../../../lib/supabase";

async function fetchArticlesByIds(articleIds) {
  if (!articleIds.length) return new Map();

  const { data, error } = await supabase
    .from("articles")
    .select("id,title,url,source_id,published_at,created_at,status")
    .in("id", articleIds);

  if (error) throw error;
  return new Map((data || []).map((item) => [String(item.id), item]));
}

async function fetchSourcesByIds(sourceIds) {
  if (!sourceIds.length) return new Map();

  const { data, error } = await supabase
    .from("sources")
    .select("id,name,slug")
    .in("id", sourceIds);

  if (error) throw error;
  return new Map((data || []).map((item) => [String(item.id), item]));
}

class ArticleService {
  async getAnalysis() {
    const { data, error } = await supabase
      .from("article_analysis")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];
    const articleIds = [...new Set(rows.map((item) => item.article_id).filter(Boolean))];
    const articles = await fetchArticlesByIds(articleIds);
    const sourceIds = [...new Set([...articles.values()].map((item) => item.source_id).filter(Boolean))];
    const sources = await fetchSourcesByIds(sourceIds);

    return rows.map((item) => {
      const article = articles.get(String(item.article_id)) || null;
      const source = article?.source_id
        ? sources.get(String(article.source_id)) || null
        : null;

      return {
        ...item,
        article,
        article_title: article?.title || null,
        article_url: article?.url || null,
        article_status: article?.status || null,
        source,
        source_id: source?.id || article?.source_id || null,
        source_name: source?.name || null,
        source_slug: source?.slug || null,
      };
    });
  }

  async getById(id) {
    const rows = await this.getAnalysis();
    const item = rows.find((row) => String(row.id) === String(id));
    if (!item) throw new Error("Analysis not found");
    return item;
  }
}

export default new ArticleService();
