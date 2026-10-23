import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Topbar />

      <main className="ml-64 min-h-screen pt-16">
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AppShell;