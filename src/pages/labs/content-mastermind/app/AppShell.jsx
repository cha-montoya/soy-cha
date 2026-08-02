import Header from "./Header";
import Sidebar from "./Sidebar";
import Workspace from "./Workspace";
import Router from "./Router";

export default function AppShell() {
    return (
        <div className="min-h-screen bg-gray-100">
        <Header />

        <div className="flex flex-col lg:flex-row">
            <Sidebar />

            <Workspace>
            <Router />
            </Workspace>
        </div>
        </div>
    );
}