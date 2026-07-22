import {
  CheckCircleIcon,
  FileTextIcon,
  PaintBrushIcon,
  BrainIcon,
  ArticleNyTimesIcon,
} from "@phosphor-icons/react";

import SectionLoader from "../../../shared/components/SectionLoader";
import BrandHeader from "../components/BrandHeader";
import MetricCard from "../components/MetricCard";
import PipelineCard from "../components/PipelineCard";
import QueueCard from "../components/QueueCard";
import QuickActions from "../components/QuickActions";
import RecentContent from "../components/RecentContent";
import useOverview from "../hooks/useOverview";

export default function Overview() {
  const {
    brandIdentity,
    metrics,
    pipeline,
    publicationQueue,
    recentContent,
    loading,
    refreshing,
    error,
    refresh,
  } = useOverview();

  if (loading) {
    return <SectionLoader label="Loading overview..." />;
  }

  return (
    <div className="space-y-8">
      <BrandHeader
        companyName={brandIdentity.companyName}
        companyLogo={brandIdentity.companyLogo}
      />

      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor your AI content production pipeline.
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? "Refreshing..." : "Refresh data"}
        </button>
      </header>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">
            Unable to load all overview data.
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Articles"
          value={metrics.articles}
          description="RSS and source articles ingested."
          icon={FileTextIcon}
        />

        <MetricCard
          label="Analysis"
          value={metrics.analysis}
          description="AI article analyses completed."
          icon={BrainIcon}
        />

        <MetricCard
          label="Content"
          value={metrics.content}
          description="Generated content records."
          icon={ArticleNyTimesIcon}
        />

        <MetricCard
          label="Image Studio"
          value={metrics.images}
          description="Generated visual assets."
          icon={PaintBrushIcon}
        />

        <MetricCard
          label="Published"
          value={metrics.published}
          description="Successfully published items."
          icon={CheckCircleIcon}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <PipelineCard pipeline={pipeline} />
        <QueueCard queue={publicationQueue} />
      </section>

      <RecentContent items={recentContent} />

      <QuickActions />
    </div>
  );
}