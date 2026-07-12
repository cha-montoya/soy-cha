import { NavLink } from "react-router-dom";
import navigation from "./navigation";

export default function Sidebar() {
  return (
    <aside className="w-60 border-r bg-white min-h-[calc(100vh-64px)]">

      <nav className="flex flex-col gap-1 p-3">

        {navigation.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/labs/content-mastermind"}
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                rounded-lg
                px-3
                py-2.5
                text-sm
                font-medium
                transition-all

                ${
                  isActive
                    ? "bg-slate-100 text-slate-700 border-l-4 border-slate-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent"
                }
                `
              }
            >
              <Icon size={20} weight="duotone" />

              <span>{item.label}</span>

            </NavLink>

          );
        })}
      </nav>
    </aside>
  );
}