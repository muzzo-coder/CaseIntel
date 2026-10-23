import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileSearch,
  Brain,
  Scale,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900 text-white">
              <Scale size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Legal AI Workspace
              </h1>
              <p className="text-xs text-slate-500">
                Intelligent Legal Assistance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Get Started
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">

            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-900">
                <ShieldCheck size={16} />
                AI-Powered Legal Assistance
              </div>

              <h2 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
                Smarter Legal Analysis.
                <span className="block text-blue-900">
                  Faster Legal Decisions.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Legal AI Workspace helps users analyze legal documents,
                research legal information, identify risks, and understand
                complex legal content using intelligent AI assistance.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-900 px-6 py-3 font-semibold text-white shadow-sm hover:bg-blue-800"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/login"
                  className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Document Analysis
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Legal Research
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Risk Analysis
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 size={18} className="text-green-600" />
                  AI Legal Assistant
                </div>
              </div>
            </div>

            {/* Hero Preview */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Legal AI Workspace
                  </p>
                  <p className="text-xs text-slate-500">
                    AI-powered legal analysis
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  System Ready
                </div>
              </div>

              <div className="space-y-4">

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-900">
                      <Brain size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        AI Legal Assistant
                      </p>
                      <p className="text-xs text-slate-500">
                        Ask questions and receive AI-assisted responses
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-900">
                      <FileSearch size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Document Intelligence
                      </p>
                      <p className="text-xs text-slate-500">
                        Analyze clauses, risks and important information
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-900">
                      <ShieldCheck size={20} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        Verification & Risk
                      </p>
                      <p className="text-xs text-slate-500">
                        Review sources and identify potential legal risks
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Features */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">

            <div className="mx-auto max-w-2xl text-center">
              <h3 className="text-3xl font-bold text-slate-900">
                One Workspace for Legal Intelligence
              </h3>

              <p className="mt-4 text-slate-600">
                Bring document analysis, legal research and AI assistance
                together in one professional workspace.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">

              <FeatureCard
                icon={<FileSearch size={22} />}
                title="Document Analysis"
                description="Upload legal documents and identify important clauses, risks and key information."
              />

              <FeatureCard
                icon={<Brain size={22} />}
                title="AI Legal Assistant"
                description="Interact with an AI assistant to ask questions and understand legal information."
              />

              <FeatureCard
                icon={<ShieldCheck size={22} />}
                title="Verified Insights"
                description="Review citations, verification status and confidence information for AI-generated responses."
              />

            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <p className="text-center text-xs leading-5 text-slate-500">
              AI-generated information is provided for informational purposes
              and should be reviewed by a qualified legal professional.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-900">
        {icon}
      </div>

      <h4 className="text-lg font-semibold text-slate-900">
        {title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

export default LandingPage;