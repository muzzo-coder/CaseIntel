import {
  Bot,
  Send,
  Plus,
  Paperclip,
  Mic,
  FileText,
  Search,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";

function AIAssistant() {
  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-slate-50">

      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot size={20} className="text-blue-900" />
            <h1 className="text-lg font-semibold text-slate-900">
              AI Legal Assistant
            </h1>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Ask questions, analyze legal information, and get AI-assisted insights.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Plus size={16} />
          New Chat
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex min-h-0 flex-1">

        {/* Chat Area */}
        <section className="flex min-w-0 flex-1 flex-col">

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto px-8 py-8">

            {/* Welcome */}
            <div className="mx-auto max-w-3xl">

              <div className="mb-8 text-center">

                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-900 text-white">
                  <Sparkles size={23} />
                </div>

                <h2 className="text-xl font-semibold text-slate-900">
                  How can I help with your legal work?
                </h2>

                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                  Ask a legal question, upload a document, or request research.
                  The system can route your request to specialized legal AI agents.
                </p>

              </div>

              {/* Suggested Questions */}
              <div className="grid grid-cols-2 gap-3">

                <SuggestionCard
                  icon={<FileText size={18} />}
                  title="Analyze a document"
                  description="Summarize important clauses and identify potential issues."
                />

                <SuggestionCard
                  icon={<Search size={18} />}
                  title="Research a legal topic"
                  description="Find relevant legal information and supporting sources."
                />

                <SuggestionCard
                  icon={<ShieldCheck size={18} />}
                  title="Review a clause"
                  description="Check a contract clause for risks and concerns."
                />

                <SuggestionCard
                  icon={<Bot size={18} />}
                  title="Ask a legal question"
                  description="Get an AI-assisted explanation of a legal concept."
                />

              </div>

              {/* Example Response Preview */}
              <div className="mt-8">

                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-white">
                    <Bot size={14} />
                  </div>

                  <span className="text-sm font-semibold text-slate-800">
                    Legal AI
                  </span>

                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                    Ready
                  </span>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                  <p className="text-sm leading-7 text-slate-700">
                    Your conversation will appear here. The AI assistant can
                    analyze documents, perform legal research, identify relevant
                    clauses, and provide source-backed responses.
                  </p>

                  {/* Verification */}
                  <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">

                    <div className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                      <ShieldCheck size={15} />
                      Verification ready
                    </div>

                    <span className="text-slate-300">•</span>

                    <span className="text-xs text-slate-500">
                      Sources will appear with responses
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white px-8 py-5">

            <div className="mx-auto max-w-3xl">

              <div className="rounded-xl border border-slate-300 bg-white shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">

                <textarea
                  rows="3"
                  placeholder="Ask a legal question..."
                  className="w-full resize-none bg-transparent px-4 pt-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />

                <div className="flex items-center justify-between px-3 pb-3">

                  <div className="flex items-center gap-1">

                    <button
                      title="Attach document"
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                      <Paperclip size={18} />
                    </button>

                    <button
                      title="Voice input"
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                      <Mic size={18} />
                    </button>

                  </div>

                  <button className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">
                    Send
                    <Send size={15} />
                  </button>

                </div>

              </div>

              <p className="mt-2 text-center text-[11px] text-slate-400">
                AI-generated information is provided for informational purposes
                and should be reviewed by a qualified legal professional.
              </p>

            </div>

          </div>

        </section>

        {/* Right Agent Panel */}
        <aside className="hidden w-72 border-l border-slate-200 bg-white xl:block">

          <div className="border-b border-slate-200 px-5 py-4">

            <div className="flex items-center justify-between">

              <h3 className="text-sm font-semibold text-slate-900">
                AI Agents
              </h3>

              <ChevronDown size={16} className="text-slate-400" />

            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Specialized agents are selected by the orchestrator based on your request.
            </p>

          </div>

          <div className="space-y-3 p-5">

            <AgentStatus
              name="Orchestrator Agent"
              description="Request routing"
              status="Ready"
            />

            <AgentStatus
              name="Legal Research Agent"
              description="Legal information retrieval"
              status="Ready"
            />

            <AgentStatus
              name="Document Analysis Agent"
              description="Document understanding"
              status="Ready"
            />

            <AgentStatus
              name="Citation Agent"
              description="Source identification"
              status="Ready"
            />

            <AgentStatus
              name="Verification Agent"
              description="Response verification"
              status="Ready"
            />

          </div>

          {/* System Status */}
          <div className="mx-5 mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-green-500" />

              <span className="text-xs font-semibold text-slate-800">
                System operational
              </span>

            </div>

            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              AI services are ready to process your request.
            </p>

          </div>

        </aside>

      </div>

    </div>
  );
}

function SuggestionCard({ icon, title, description }) {
  return (
    <button className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/30">

      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-900">
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </button>
  );
}

function AgentStatus({ name, description, status }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <span className="h-2 w-2 rounded-full bg-green-500" />

          <p className="text-xs font-semibold text-slate-800">
            {name}
          </p>

        </div>

        <span className="text-[10px] font-medium text-green-700">
          {status}
        </span>

      </div>

      <p className="mt-1 pl-4 text-[11px] text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default AIAssistant;