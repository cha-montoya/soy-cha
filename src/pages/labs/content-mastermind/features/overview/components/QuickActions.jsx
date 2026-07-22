import {
  PaintBrushIcon,
  PaletteIcon,
  BrainIcon,
  ArticleNyTimesIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const ACTIONS = [
  {
    label: "Open analysis",
    description: "Review AI article analysis.",
    to: "/labs/content-mastermind/analysis",
    icon: BrainIcon,
  },
  {
    label: "Content library",
    description: "Review generated posts and images.",
    to: "/labs/content-mastermind/content",
    icon: ArticleNyTimesIcon,
  },
  {
    label: "Image Studio workspace",
    description: "Manage visual generation.",
    to: "/labs/content-mastermind/image-studio",
    icon: PaintBrushIcon,
  },
  {
    label: "Brand assets",
    description: "Manage brand identity and AI rules.",
    to: "/labs/content-mastermind/settings",
    icon: PaletteIcon,
  },
];

export default function QuickActions() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-950">
          Quick actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Jump directly into the main workspaces.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ACTIONS.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.label}
              to={action.to}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-slate-900 group-hover:text-white">
                <Icon size={20} weight="duotone" />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {action.label}
              </h3>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}