import { NavLink, Outlet } from "react-router-dom";
import {
  Buildings,
  Palette,
  Robot,
  PaperPlaneTilt,
  Bell,
  Users,
  Info,
} from "@phosphor-icons/react";

import { routes } from "../../../config/routes";

const settingsItems = [
  {
    label: "Workspace",
    icon: Buildings,
    to: routes.settingsWorkspace,
  },
  {
    label: "Brand Assets",
    icon: Palette,
    to: routes.settingsBrandAssets,
  },
  {
    label: "AI Models",
    icon: Robot,
    disabled: true,
  },
  {
    label: "Publishing",
    icon: PaperPlaneTilt,
    disabled: true,
  },
  {
    label: "Notifications",
    icon: Bell,
    disabled: true,
  },
  {
    label: "Users",
    icon: Users,
    disabled: true,
  },
  {
    label: "About",
    icon: Info,
    disabled: true,
  },
];

export default function SettingsLayout() {
  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white lg:flex-row">
      <aside className="w-full border-b border-slate-200 bg-slate-50/70 p-4 lg:w-64 lg:border-b-0 lg:border-r">
        <div className="mb-6 px-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Settings
          </p>

          <h1 className="mt-2 text-xl font-semibold text-slate-900">
            Workspace setup
          </h1>
        </div>

        <nav className="space-y-1">
          {settingsItems.map(({ label, icon: Icon, to, disabled }) => {
            if (disabled) {
              return (
                <div
                  key={label}
                  className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400"
                >
                  <Icon size={19} />
                  <span>{label}</span>

                  <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon size={19} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 bg-white">
        <Outlet />
      </main>
    </div>
  );
}