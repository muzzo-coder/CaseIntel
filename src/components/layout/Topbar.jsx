import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Scale,
  LayoutDashboard,
  BriefcaseBusiness,
  Bot,
  Search,
  FileText,
  Upload,
  ScanSearch,
  Clock3,
  ListChecks,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [researchOpen, setResearchOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);

  const goTo = (path) => {
    navigate(path);
    setResearchOpen(false);
    setTimelineOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#08090C]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full items-center justify-between px-5">

        {/* ================= LOGO ================= */}
        <button
          onClick={() => goTo("/app/dashboard")}
          className="flex shrink-0 items-center gap-2.5"
        >
          <Scale
            size={25}
            strokeWidth={1.5}
            className="text-[#d8ae62]"
          />

          <div className="leading-none text-left">
            <span className="font-serif text-[15px] tracking-[0.08em] text-white">
              CASEINTEL
            </span>

            <span className="mt-1 block text-[7px] uppercase tracking-[0.18em] text-[#d8ae62]">
              AI Legal Intelligence
            </span>
          </div>
        </button>

        {/* ================= MAIN NAVIGATION ================= */}
        <nav className="ml-8 flex flex-1 items-center gap-1">

          {/* Dashboard */}
          <button
            onClick={() => goTo("/app/dashboard")}
            className={`flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs transition ${
              isActive("/app/dashboard")
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <LayoutDashboard size={15} />
            Dashboard
          </button>

          {/* Matters */}
          <button
            onClick={() => goTo("/app/matters")}
            className={`flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs transition ${
              isActive("/app/matters")
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <BriefcaseBusiness size={15} />
            Matters
          </button>

          {/* AI Investigation */}
          <button
            onClick={() => goTo("/app/investigation")}
            className={`flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs transition ${
              isActive("/app/investigation")
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Bot size={15} />
            AI Investigation
          </button>

          {/* ================= LEGAL RESEARCH ================= */}
          <div className="relative">
            <button
              onClick={() => {
                setResearchOpen(!researchOpen);
                setTimelineOpen(false);
              }}
              className="flex items-center gap-1 rounded-full px-3.5 py-2.5 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Legal Research

              <ChevronDown
                size={13}
                className={`transition-transform ${
                  researchOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {researchOpen && (
              <div className="absolute left-0 top-12 z-[100] w-64 rounded-xl border border-black/10 bg-white p-2 text-black shadow-2xl">

                <button
                  onClick={() => goTo("/app/research")}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition hover:bg-[#f1ede5]"
                >
                  <Search
                    size={17}
                    className="text-[#a47731]"
                  />
                  <span>Legal Research</span>
                </button>

                <button
                  onClick={() => goTo("/app/documents")}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition hover:bg-[#f1ede5]"
                >
                  <FileText
                    size={17}
                    className="text-[#a47731]"
                  />
                  <span>Documents</span>
                </button>

                <button
                  onClick={() => goTo("/app/upload")}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition hover:bg-[#f1ede5]"
                >
                  <Upload
                    size={17}
                    className="text-[#a47731]"
                  />
                  <span>Upload Evidence</span>
                </button>

                <button
                  onClick={() => goTo("/app/analysis")}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition hover:bg-[#f1ede5]"
                >
                  <ScanSearch
                    size={17}
                    className="text-[#a47731]"
                  />
                  <span>Document Analysis</span>
                </button>
              </div>
            )}
          </div>

          {/* ================= TIMELINE ================= */}
          <div className="relative">
            <button
              onClick={() => {
                setTimelineOpen(!timelineOpen);
                setResearchOpen(false);
              }}
              className="flex items-center gap-1 rounded-full px-3.5 py-2.5 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Timeline

              <ChevronDown
                size={13}
                className={`transition-transform ${
                  timelineOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {timelineOpen && (
              <div className="absolute left-0 top-12 z-[100] w-56 rounded-xl border border-black/10 bg-white p-2 text-black shadow-2xl">

                <button
                  onClick={() => goTo("/app/timeline")}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition hover:bg-[#f1ede5]"
                >
                  <Clock3
                    size={17}
                    className="text-[#a47731]"
                  />
                  <span>Case Timeline</span>
                </button>

                <button
                  onClick={() => goTo("/app/findings")}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition hover:bg-[#f1ede5]"
                >
                  <ListChecks
                    size={17}
                    className="text-[#a47731]"
                  />
                  <span>Findings</span>
                </button>

                <button
                  onClick={() => goTo("/app/conversations")}
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition hover:bg-[#f1ede5]"
                >
                  <MessageSquare
                    size={17}
                    className="text-[#a47731]"
                  />
                  <span>Conversations</span>
                </button>
              </div>
            )}
          </div>

          {/* Reports */}
          <button
            onClick={() => goTo("/app/reports")}
            className={`flex items-center gap-2 rounded-full px-3.5 py-2.5 text-xs transition ${
              isActive("/app/reports")
                ? "bg-white/10 text-white"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <BarChart3 size={15} />
            Reports
          </button>
        </nav>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex shrink-0 items-center gap-2">

          {/* Profile */}
          <button
            title="Profile"
            onClick={() => goTo("/app/profile")}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
              isActive("/app/profile")
                ? "border-[#d8ae62] bg-[#d8ae62] text-black"
                : "border-[#d8ae62]/40 text-[#d8ae62] hover:bg-[#d8ae62] hover:text-black"
            }`}
          >
            <User size={17} />
          </button>

          {/* Settings */}
          <button
            title="Settings"
            onClick={() => goTo("/app/settings")}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
              isActive("/app/settings")
                ? "border-[#d8ae62] text-[#d8ae62]"
                : "border-white/20 text-white hover:border-[#d8ae62] hover:text-[#d8ae62]"
            }`}
          >
            <Settings size={17} />
          </button>

          {/* Logout */}
          <button
            title="Logout"
            onClick={() => {
              localStorage.removeItem("legalAI_loggedIn");
              navigate("/login");
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-red-400 hover:text-red-400"
          >
            <LogOut size={17} />
          </button>

        </div>
      </div>
    </header>
  );
}