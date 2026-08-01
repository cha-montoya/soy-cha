import { useMemo, useState } from "react";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";

import Button from "../../../shared/components/Button";
import EmptyState from "../../../shared/components/EmptyState";
import PageHeader from "../../../shared/components/PageHeader";
import SectionLoader from "../../../shared/components/SectionLoader";
import { DateInput } from "../../../shared/components/filters/FilterControls";
import useLinkedInAnalytics from "../hooks/useLinkedInAnalytics";
import MetricCard from "../components/MetricCard";
import PerformanceBars from "../components/PerformanceBars";
import PostPerformanceTable from "../components/PostPerformanceTable";

function formatNumber(value) {
  return new Intl.NumberFormat("es-MX").format(Number(value || 0));
}

export default function Analytics() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const filters = useMemo(() => ({ from, to }), [from, to]);
  const { overview, posts, daily, topics, sources, loading, error, reload } = useLinkedInAnalytics(filters);

  if (loading) return <SectionLoader text="Loading LinkedIn analytics..." />;
  if (error) return <EmptyState title="Unable to load Analytics" description={error.message || "The analytics API could not be reached."} />;

  const metricsPending = posts.length > 0 && posts.every((post) => post.metrics_captured_at == null);

  return (
    <div className="min-h-full space-y-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <PageHeader
          title="LinkedIn Analytics"
          description="Daily publishing performance connected to the source, topic, prompt version and Brand Voice behind each post."
          action={
            <Button variant="secondary" onClick={reload} className="min-w-0 px-4 py-2.5">
              <ArrowClockwiseIcon size={17} weight="bold" />
              Refresh
            </Button>
          }
        />
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-end">
          <DateInput label="From" value={from} onChange={setFrom} />
          <DateInput label="To" value={to} onChange={setTo} />
          {(from || to) ? (
            <button type="button" onClick={() => { setFrom(""); setTo(""); }} className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-slate-900">
              Clear period
            </button>
          ) : null}
        </div>
      </div>

      {metricsPending ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
          Publications are connected, but LinkedIn metric snapshots have not been captured yet. The dashboard will populate automatically when <code className="font-mono">publication_metrics</code> receives data.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Published posts" value={formatNumber(overview?.posts)} />
        <MetricCard label="Impressions" value={formatNumber(overview?.impressions)} />
        <MetricCard label="Interactions" value={formatNumber(overview?.interactions)} helper="Reactions + comments + shares + clicks" />
        <MetricCard label="Engagement rate" value={overview?.engagement_rate == null ? "—" : `${Number(overview.engagement_rate).toFixed(2)}%`} />
        <MetricCard label="Reactions" value={formatNumber(overview?.reactions)} />
        <MetricCard label="Comments" value={formatNumber(overview?.comments)} />
        <MetricCard label="Shares" value={formatNumber(overview?.shares)} />
        <MetricCard label="Clicks" value={formatNumber(overview?.clicks)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PerformanceBars title="Posts by topic" items={topics} metric={overview?.impressions ? "impressions" : "posts"} />
        <PerformanceBars title="Posts by source" items={sources} metric={overview?.impressions ? "impressions" : "posts"} />
      </div>

      <PostPerformanceTable posts={posts} />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-500">Daily publishing activity</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {daily.map((item) => (
            <div key={item.publication_date} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{item.publication_date}</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{item.posts_published}</p>
              <p className="text-xs text-slate-500">post{Number(item.posts_published) === 1 ? "" : "s"} published</p>
            </div>
          ))}
          {!daily.length ? <p className="text-sm text-slate-500">No daily activity for this period.</p> : null}
        </div>
      </section>
    </div>
  );
}
