import {
  Menu,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

function Topbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white">

      <div className="flex h-full items-center justify-between px-6">

        {/* Left */}
        <div className="flex items-center gap-4">

          <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Menu size={20} />
          </button>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Legal AI Workspace
            </h2>

            <p className="text-xs text-slate-500">
              Intelligent legal assistance
            </p>
          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Search */}
          <div className="flex w-64 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">

            <Search size={17} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />

            <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
              /
            </span>

          </div>

          {/* Notifications */}
          <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <Bell size={19} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
          </button>

          {/* Profile */}
          <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-900">
              SS
            </div>

            <ChevronDown size={15} className="text-slate-400" />

          </button>

        </div>

      </div>

    </header>
  );
}

export default Topbar;