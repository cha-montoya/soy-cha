import { NavLink } from "react-router-dom";
import navigation from "./navigation";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r min-h-[calc(100vh-64px)]">
      <nav className="flex flex-col p-4 gap-2">
        {navigation.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === ""}
            className="px-3 py-2 rounded hover:bg-gray-100"
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}