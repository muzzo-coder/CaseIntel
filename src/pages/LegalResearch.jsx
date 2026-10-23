import {
  Search,
  SlidersHorizontal,
  BookOpen,
  FileText,
  ExternalLink,
  ShieldCheck,
  Clock,
} from "lucide-react";

function LegalResearch() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">

      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-8 py-5">

        <div className="flex items-center justify-between">

          <div>
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-blue-900" />

              <h1 className="text-lg font-semibold text-slate-900">
                Legal Research
              </h1>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Search legal information and explore source-backed results.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Clock size={16} />
            Research History
          </button>

        </div>

      </div>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-8 py-8">

        {/* Search */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <label className="mb-2 block text-sm font-semibold text-slate-800">
            What would you like to research?
          </label>

          <div className="flex gap-3">

            <div className="flex flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

              <Search size={19} className="text-slate-400" />

              <input
                type="text"
                placeholder="Enter a legal topic, case, statute, or question..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

            </div>

            <button className="flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800">
              <Search size={17} />
              Search
            </button>

          </div>

          <div className="mt-4 flex items-center justify-between">

            <div className="flex items-center gap-2 text-xs text-slate-500">

              <SlidersHorizontal size={14} />

              <button className="hover:text-blue-900">
                Filters
              </button>

              <span>•</span>

              <span>All sources</span>

            </div>

            <span className="text-[11px] text-slate-400">
              AI-assisted research
            </span>

          </div>

        </div>

        {/* Research workspace */}
        <div className="mt-6 grid grid-cols-3 gap-6">

          {/* Results */}
          <section className="col-span-2">

            <div className="mb-4 flex items-center justify-between">

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Research Results
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Source-backed legal information will appear here.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                0 results
              </span>

            </div>

            {/* Empty state */}
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                <Search size={22} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-800">
                Start your legal research
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
                Enter a legal question, case name, statute, or topic above.
                The research system will retrieve relevant information and sources.
              </p>

            </div>

          </section>

          {/* Research tools */}
          <aside>

            <h2 className="mb-4 text-sm font-semibold text-slate-900">
              Research Tools
            </h2>

            <div className="space-y-3">

              <ToolCard
                icon={<BookOpen size={18} />}
                title="Case Law"
                description="Search relevant case decisions and legal authorities."
              />

              <ToolCard
                icon={<FileText size={18} />}
                title="Legal Documents"
                description="Explore statutes, regulations, and legal documents."
              />

              <ToolCard
                icon={<ShieldCheck size={18} />}
                title="Source Verification"
                description="Review the reliability and verification status of sources."
              />

            </div>

            {/* Disclaimer */}
            <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">

              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-blue-900" />

                <span className="text-xs font-semibold text-slate-800">
                  Research Notice
                </span>
              </div>

              <p className="mt-2 text-[11px] leading-5 text-slate-500">
                Research results are AI-assisted and should be independently
                verified before being relied upon for legal decisions.
              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

function ToolCard({ icon, title, description }) {
  return (
    <button className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/30">

      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
          {icon}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-center justify-between">

            <h3 className="text-sm font-semibold text-slate-800">
              {title}
            </h3>

            <ExternalLink size={14} className="text-slate-400" />

          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </button>
  );
}

export default LegalResearch;