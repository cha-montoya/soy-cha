import Header from "./Header";
import Router from "./Router";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Router />
        </main>
      </div>
    </div>
  );
}
