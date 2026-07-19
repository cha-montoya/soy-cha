import { supabase } from "../../../lib/supabase";

const BRAND_ASSET_KEYS = ["company_logo", "company_name"];

async function getTableCount(table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", {
      count: "exact",
      head: true,
    });

  if (error) {
    throw error;
  }

  return count ?? 0;
}

async function getGeneratedContent() {
  const { data, error } = await supabase
    .from("generated_content")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function getPublicationQueue() {
  const { data, error } = await supabase
    .from("publication_queue")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function getBrandIdentity() {
  const { data, error } = await supabase
    .from("brand_assets")
    .select("asset_key, asset_name, asset_type, content, metadata")
    .in("asset_key", BRAND_ASSET_KEYS)
    .eq("active", true);

  if (error) {
    throw error;
  }

  const assets = data ?? [];

  const companyNameAsset = assets.find(
    (asset) => asset.asset_key === "company_name"
  );

  const companyLogoAsset = assets.find(
    (asset) => asset.asset_key === "company_logo"
  );

  return {
    companyName:
      companyNameAsset?.content?.trim() ||
      companyNameAsset?.asset_name?.trim() ||
      "",
    companyLogo:
      companyLogoAsset?.content?.trim() ||
      companyLogoAsset?.metadata?.public_url ||
      companyLogoAsset?.metadata?.url ||
      "",
  };
}

function normalizeStatus(status) {
  return String(status ?? "")
    .trim()
    .toLowerCase();
}

function countQueueStatuses(queue) {
  return queue.reduce(
    (totals, item) => {
      const status = normalizeStatus(item.status);

      if (["pending", "queued", "pending_review"].includes(status)) {
        totals.pending += 1;
      } else if (["scheduled"].includes(status)) {
        totals.scheduled += 1;
      } else if (["published", "completed", "success"].includes(status)) {
        totals.published += 1;
      } else if (["failed", "error"].includes(status)) {
        totals.failed += 1;
      }

      return totals;
    },
    {
      pending: 0,
      scheduled: 0,
      published: 0,
      failed: 0,
    }
  );
}

export async function getOverviewData() {
  const [
    articles,
    analysis,
    generatedContent,
    publicationQueue,
    brandIdentity,
  ] = await Promise.all([
    getTableCount("articles"),
    getTableCount("article_analysis"),
    getGeneratedContent(),
    getPublicationQueue(),
    getBrandIdentity(),
  ]);

  const images = generatedContent.filter(
    (item) => Boolean(item.image_url)
  ).length;

  const publicationMetrics = countQueueStatuses(publicationQueue);

  return {
    brandIdentity,
    metrics: {
      articles,
      analysis,
      content: generatedContent.length,
      images,
      published: publicationMetrics.published,
    },
    pipeline: [
      {
        key: "articles",
        label: "Articles",
        value: articles,
      },
      {
        key: "analysis",
        label: "Analysis",
        value: analysis,
      },
      {
        key: "content",
        label: "Content",
        value: generatedContent.length,
      },
      {
        key: "images",
        label: "Images",
        value: images,
      },
      {
        key: "published",
        label: "Published",
        value: publicationMetrics.published,
      },
    ],
    publicationQueue: publicationMetrics,
    recentContent: generatedContent.slice(0, 5),
  };
}