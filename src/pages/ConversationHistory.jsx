import {
  Search,
  MessageSquare,
  Clock,
  MoreVertical,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";

const conversations = [
  {
    title: "Contract termination clause analysis",
    preview:
      "Analyze the termination conditions and identify potential risks...",
    date: "Today, 10:42 AM",
    messages: 8,
  },
  {
    title: "Plant disease research",
    preview:
      "What are the important legal considerations for agricultural technology?",
    date: "Yesterday, 4:18 PM",
    messages: 12,
  },
  {
    title: "Liability clause review",
    preview:
      "Explain the liability provisions in this agreement and highlight...",
    date: "18 Oct 2026",
    messages: 6,
  },
  {
    title: "Legal document summary",
    preview:
      "Summarize the important points from the uploaded document.",
    date: "17 Oct 2026",
    messages: 9,
  },
];

function ConversationHistory() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Conversation History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and manage your previous AI legal conversations.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800">
          <Plus size={17} />
          New Conversation
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Conversations</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">18</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">This Week</p>
          <p className="mt-2 text-2xl font-semibold text-blue-800">7</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">AI Messages</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">96</p>
        </div>
      </div>

      {/* Conversations */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Recent Conversations
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Your recent conversations with the Legal AI Assistant.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {conversations.map((conversation, index) => (
            <div
              key={index}
              className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50 lg:flex-row lg:items-center"
            >
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-800">
                <MessageSquare size={20} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-slate-900">
                  {conversation.title}
                </h3>

                <p className="mt-1 truncate text-sm text-slate-500">
                  {conversation.preview}
                </p>

                <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={13} />
                    {conversation.date}
                  </span>

                  <span>
                    {conversation.messages} messages
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  title="Open conversation"
                  className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Eye size={17} />
                </button>

                <button
                  title="More options"
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                >
                  <MoreVertical size={17} />
                </button>

                <button
                  title="Delete conversation"
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty-state guidance */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-4">
        <p className="text-xs leading-5 text-slate-500">
          Your conversations will appear here automatically after interacting
          with the AI Legal Assistant.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
        <p className="text-xs leading-5 text-blue-900">
          <span className="font-semibold">Legal AI Notice:</span>{" "}
          Conversation history may contain AI-generated legal information.
          Always review important information with a qualified legal
          professional.
        </p>
      </div>
    </div>
  );
}

export default ConversationHistory;