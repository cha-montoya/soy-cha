import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import StatusBadge from "../../../shared/components/StatusBadge";
import { formatDate } from "../../../shared/utils/filters";

function formatNumber(value) {
  return new Intl.NumberFormat("es-MX").format(Number(value || 0));
}

export default function PostPerformanceTable({ posts }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">Published posts</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[900px] divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
            <tr>
              <th className="px-5 py-3">Post</th>
              <th className="px-4 py-3">Source / Topic</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Impressions</th>
              <th className="px-4 py-3 text-right">Interactions</th>
              <th className="px-4 py-3 text-right">Engagement</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.map((post) => {
              const interactions = Number(post.reactions || 0) + Number(post.comments || 0) + Number(post.shares || 0) + Number(post.clicks || 0);
              return (
                <tr key={post.publication_id} className="align-top hover:bg-slate-50/70">
                  <td className="max-w-md px-5 py-4">
                    <p className="font-semibold leading-5 text-slate-900">{post.title || "Untitled post"}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <StatusBadge value={post.status} />
                      {post.prompt_version ? <span className="text-xs text-slate-500">{post.prompt_version}</span> : null}
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-4 text-slate-600">
                    <p className="font-medium text-slate-800">{post.source_name || "—"}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5">{post.topic || "No topic"}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">{formatDate(post.published_at)}</td>
                  <td className="px-4 py-4 text-right tabular-nums">{formatNumber(post.impressions)}</td>
                  <td className="px-4 py-4 text-right tabular-nums">{formatNumber(interactions)}</td>
                  <td className="px-4 py-4 text-right tabular-nums">{post.engagement_rate == null ? "—" : `${Number(post.engagement_rate).toFixed(2)}%`}</td>
                  <td className="px-4 py-4 text-right">
                    {post.external_url ? (
                      <a
                        href={post.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 text-slate-600 transition hover:border-slate-950 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20"
                        aria-label="Open LinkedIn post"
                      >
                        <ArrowSquareOutIcon size={17} weight="regular" />
                      </a>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!posts.length ? <div className="p-8 text-center text-sm text-slate-500">No LinkedIn publications match this period.</div> : null}
      </div>
    </section>
  );
}
