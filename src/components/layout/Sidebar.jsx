import {
  LayoutDashboard,
  Bot,
  Search,
  FileText,
  Upload,
  ScanSearch,
  FileCheck,
  Scale,
  Gavel,
  History,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronDown,
  BriefcaseBusiness,
  Files,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";


function Sidebar() {
    const navigate = useNavigate();
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">

      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-white">
            <Scale size={20} />
          </div>

          <div>
            <h1 className="text-sm font-bold text-slate-900">
              Legal AI
            </h1>
            <p className="text-xs text-slate-500">
              Workspace
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
     <nav className="h-[calc(100vh-160px)] space-y-1 overflow-y-auto px-3 py-5">

        <NavItem
  icon={<LayoutDashboard size={18} />}
  label="Dashboard"
  to="/"
/>

        <NavItem
  icon={<Bot size={18} />}
  label="AI Assistant"
  to="/ai-assistant"
/>

        <NavItem
  icon={<Search size={18} />}
  label="Legal Research"
  to="/legal-research"
/>

        {/* Documents */}
        <div className="pt-2">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Documents
          </p>

          <NavItem
  icon={<FileText size={18} />}
  label="Document Library"
  to="/documents"
/>

          <NavItem
  icon={<Upload size={18} />}
  label="Upload Document"
  to="/documents/upload"
/>

          <NavItem
  icon={<ScanSearch size={18} />}
  label="Document Analysis"
  to="/documents/analysis"
/>
        </div>

        {/* Phase 2 */}
        <div className="pt-4">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Phase 2
          </p>

          <NavItem
  icon={<FileText size={18} />}
  label="Contract Review"
  to="/contract-review"
/>

         <NavItem
  icon={<BriefcaseBusiness size={18} />}
  label="Case Analysis"
  to="/case-analysis"
/>

          <NavItem
  icon={<Gavel size={18} />}
  label="Judgment Analysis"
  to="/judgment-analysis"
/>

<NavItem
  icon={<Files size={18} />}
  label="Multi-Document Analysis"
  to="/multi-document-analysis"
/>
        </div>

        <div className="pt-2">
          <NavItem
  icon={<History size={18} />}
  label="Conversation History"
  to="/conversation-history"
/>

          <NavItem
  icon={<BarChart3 size={18} />}
  label="Reports"
  to="/reports"
/>

          <NavItem
  icon={<User size={18} />}
  label="Profile"
  to="/profile"
/>

          <NavItem
  icon={<Settings size={18} />}
  label="Settings"
  to="/settings"
/>
        </div>

      </nav>

      {/* User section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-3">

        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-900">
            SS
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              User
            </p>
            <p className="truncate text-xs text-slate-500">
              Legal Workspace
            </p>
          </div>

          <ChevronDown size={16} className="text-slate-400" />

        </div>

       <button
  onClick={() => {
    localStorage.removeItem("legalAI_loggedIn");
    navigate("/login");
  }}
  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-red-50 hover:text-red-700"
>
  <LogOut size={18} />
  <span>Logout</span>
</button>

      </div>

    </aside>
  );
}

function NavItem({ icon, label, to, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
          isActive
            ? "bg-blue-50 font-semibold text-blue-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`
      }
    >
      {icon}

      <span className="flex-1 text-left">
        {label}
      </span>

      {badge && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

export default Sidebar;