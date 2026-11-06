import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  Play,
  CalendarDays,
  Users,
  ShieldCheck,
  Scale,
  FileText,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f2ee] text-[#111]">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative min-h-[650px] overflow-hidden bg-[#08090C] pt-8 text-white">

        {/* Atmospheric lighting */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(216,174,98,0.12),transparent_60%)]" />

          <div className="absolute right-[-150px] top-[-150px] h-[650px] w-[650px] rounded-full border border-[#d8ae62]/15" />

          <div className="absolute right-[10%] top-[20%] h-[450px] w-[450px] rounded-full border border-white/5" />
        </div>

        <div className="relative mx-auto grid max-w-[1550px] grid-cols-1 gap-8 px-6 md:px-10 lg:grid-cols-12">

          {/* =================================================
              LEFT — HERO CONTENT
          ================================================== */}

          <div className="z-10 flex flex-col justify-center py-16 lg:col-span-5 lg:min-h-[530px]">

            {/* Section label */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#d8ae62]">
                Investigation Command Center
              </span>

              <span className="h-px w-10 bg-[#d8ae62]" />
            </div>

            {/* Main heading */}
            <h1 className="max-w-[620px] font-serif text-5xl leading-[0.92] tracking-tight sm:text-6xl md:text-7xl">
              Find the
              <br />

              <span className="italic font-serif">
                story
              </span>

              <br />
              between the
              <br />
              documents.
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[590px] text-sm leading-7 text-white/65 md:text-base">
              Connect evidence. Trace events. Verify claims. Understand the
              case.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex items-center gap-5">

              {/* Open Matter */}
              <button
                onClick={() => navigate("/app/documents")}
                className="flex items-center gap-3 rounded-full bg-[#d8ae62] px-7 py-3.5 text-xs font-semibold text-black shadow-lg shadow-[#d8ae62]/20 transition hover:bg-white"
              >
                Open Matter
                <ArrowUpRight size={15} />
              </button>

              {/* Explore Platform */}
              <button
                onClick={() => navigate("/app/investigation")}
                className="flex items-center gap-3 text-xs text-white/75 transition hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 backdrop-blur-sm">
                  <Play
                    size={12}
                    fill="currentColor"
                  />
                </span>

                Explore Platform
              </button>
            </div>
          </div>

          {/* =================================================
              RIGHT — LEGAL OBJECT COMPOSITION
          ================================================== */}

          <div className="relative hidden min-h-[530px] items-center justify-center lg:col-span-7 lg:flex">

            {/* Dark Marble Texture */}
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl bg-cover bg-center opacity-30"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop')",
              }}
            />

            {/* =================================================
                CONSTITUTION BOOK
            ================================================== */}

            <div className="absolute left-[2%] top-[12%] z-20 w-[240px] cursor-pointer filter drop-shadow-[-15px_25px_25px_rgba(0,0,0,0.85)] transition-all duration-500 hover:-translate-y-2 hover:scale-105">

              <div className="relative overflow-hidden rounded-xl border border-[#d8ae62]/40 bg-[#120D0A] shadow-2xl">

                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop"
                  alt="Constitution of India"
                  className="h-[270px] w-full object-cover brightness-90 opacity-90"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 text-center">

                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d8ae62]">
                    THE
                  </span>

                  <h3 className="mt-1 font-serif text-xl font-bold tracking-wide text-white drop-shadow-md">
                    Constitution
                    <br />
                    of India
                  </h3>

                  <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#d8ae62]/50 bg-black/40 backdrop-blur-sm">
                    <Scale
                      size={20}
                      className="text-[#d8ae62]"
                    />
                  </div>
                </div>
              </div>
            </div>

           {/* =================================================
    SUPREME COURT OF INDIA
================================================== */}

<div className="absolute right-[4%] top-[4%] z-30 w-[300px] cursor-pointer filter drop-shadow-[-20px_30px_30px_rgba(0,0,0,0.9)] transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]">

  <div className="overflow-hidden rounded-xl border border-[#d8ae62]/30 bg-[#120D0A] shadow-2xl">

    <img
      src="https://assets.thehansindia.com/h-upload/2026/09/24/1705501-supreme-court-of-india.jpg"
      alt="Supreme Court of India"
      className="h-[235px] w-full object-cover brightness-[0.82]"
    />

    {/* Dark cinematic overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

    {/* Label */}
    <div className="absolute bottom-0 left-0 right-0 p-4">

      <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#d8ae62]">
        INDIAN JUDICIARY
      </p>

      <p className="mt-1 font-serif text-lg text-white">
        Supreme Court of India
      </p>

    </div>

  </div>

</div>

            {/* =================================================
                CASE FILE DOCUMENTS
            ================================================== */}

            <div className="absolute left-[36%] top-[20%] z-10 w-[200px] cursor-pointer filter drop-shadow-[-15px_20px_20px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-2">

              <img
                src="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop"
                alt="Case File Papers"
                className="h-auto w-full rounded-md border border-white/10"
              />
            </div>

            {/* =================================================
                GAVEL
            ================================================== */}

            <div className="absolute bottom-[6%] right-[12%] z-40 w-[250px] cursor-pointer filter drop-shadow-[-20px_35px_30px_rgba(0,0,0,0.95)] transition-all duration-500 hover:-translate-y-2">

              <img
                src="https://images.unsplash.com/photo-1589994965851-a8f479c573a9?q=80&w=800&auto=format&fit=crop"
                alt="Wooden Gavel"
                className="h-auto w-full"
              />
            </div>

            {/* Gold Highlight Ring */}
            <div className="pointer-events-none absolute right-[15%] top-[25%] h-[350px] w-[350px] rounded-full border border-[#d8ae62]/20" />
          </div>
        </div>
      </section>

      {/* =====================================================
          METRICS
      ====================================================== */}

      <section className="relative z-20 mx-auto -mt-7 max-w-[1450px] px-5">

        <div className="grid overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl sm:grid-cols-2 lg:grid-cols-5">

          <Metric
            icon={FileText}
            number="24"
            label="Documents"
            growth="12%"
          />

          <Metric
            icon={Users}
            number="148"
            label="Entities"
            growth="8%"
          />

          <Metric
            icon={CalendarDays}
            number="67"
            label="Events"
            growth="15%"
          />

          <Metric
            icon={AlertTriangle}
            number="09"
            label="Findings"
            growth="0%"
          />

          <Metric
            icon={ShieldCheck}
            number="94%"
            label="Verification Rate"
          />
        </div>
      </section>

      {/* =====================================================
          CONTENT CARDS
      ====================================================== */}

      <section className="mx-auto max-w-[1450px] px-5 py-8">

        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr_1fr]">

          {/* =================================================
              ACTIVE MATTER
          ================================================== */}

          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white p-7">

            <div className="absolute bottom-[-100px] left-[-80px] h-60 w-60 rounded-full bg-black/[0.025]" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
                    Active Matter
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Acquirer Merger Investigation
                  </h2>
                </div>

                <Scale
                  size={40}
                  strokeWidth={1}
                  className="text-[#c3974d]"
                />
              </div>

              <p className="mt-3 text-xs text-black/45">
                Case ID: CI-2026-0042
              </p>

              <div className="mt-4 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#5e965d]" />

                <span className="text-xs">
                  Active
                </span>
              </div>

              {/* Progress */}
              <div className="mt-7">

                <div className="mb-2 flex justify-between text-[10px] uppercase tracking-widest text-black/45">
                  <span>
                    Analysis Progress
                  </span>

                  <span>
                    78%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-black/10">

                  <div className="h-full w-[78%] rounded-full bg-[#c3974d]" />

                </div>
              </div>

              {/* Analysts */}
              <div className="mt-6 flex items-center gap-2">

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[9px] text-white">
                  JD
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ddd] text-[9px]">
                  AS
                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eee] text-[9px]">
                  PK
                </div>

                <span className="text-[10px] text-black/40">
                  +2 more analysts
                </span>
              </div>

              {/* View Details */}
              <button
                onClick={() => navigate("/app/documents")}
                className="mt-6 flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-[10px] uppercase tracking-widest text-white transition hover:bg-neutral-800"
              >
                View Details
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* =================================================
              TIMELINE
          ================================================== */}

          <div className="rounded-2xl border border-black/10 bg-white p-7">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
                  Case Timeline
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Key Events
                </h2>
              </div>

              <button
                onClick={() => navigate("/app/timeline")}
                className="text-xs text-black/50 transition hover:text-black"
              >
                View All →
              </button>
            </div>

            <div className="relative mt-7">

              <div className="absolute bottom-0 left-[7px] top-2 w-px bg-[#c3974d]" />

              <TimelineItem
                date="12 Mar 2026"
                title="Merger Agreement Signed"
                source="Document #1"
              />

              <TimelineItem
                date="18 Mar 2026"
                title="Amendment Filed"
                source="Document #2"
              />

              <TimelineItem
                date="24 Mar 2026"
                title="Board Resolution"
                source="Document #3"
              />
            </div>
          </div>

          {/* =================================================
              FINDINGS
          ================================================== */}

          <div className="rounded-2xl border border-black/10 bg-white p-7">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
                  Intelligence
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Recent Findings
                </h2>
              </div>

              <button
                onClick={() => navigate("/app/findings")}
                className="text-xs text-black/50 transition hover:text-black"
              >
                View All →
              </button>
            </div>

            <div className="mt-6 space-y-3">

              <Finding
                title="Date Inconsistency Detected"
                text="Two documents reference different dates."
                warning
              />

              <Finding
                title="Amount Verified"
                text="Transaction value matches across sources."
              />

              <Finding
                title="Entity Match"
                text="Company name consistent in all documents."
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUOTE / FOOTER
      ====================================================== */}

      <section className="relative mt-4 overflow-hidden bg-black py-10 text-white">

        <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-8 px-5">

          <div className="flex items-center gap-5">

            <span className="font-serif text-5xl text-[#d8ae62]">
              “
            </span>

            <p className="font-serif text-lg md:text-xl">
              Every claim should have evidence.
              Every evidence item should have a source.
            </p>
          </div>

          <div className="hidden items-center gap-3 md:flex">

            <span className="h-px w-8 bg-[#d8ae62]" />

            <span className="text-[10px] uppercase tracking-widest text-[#d8ae62]">
              Indian Constitution
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
    METRIC COMPONENT
========================================================= */

function Metric({
  icon: Icon,
  number,
  label,
  growth,
}) {
  return (
    <div className="border-b border-black/10 p-5 lg:border-b-0 lg:border-r">

      <div className="flex items-center gap-3">

        <Icon
          size={25}
          strokeWidth={1.3}
          className="text-black/70"
        />

        <div>

          <div className="flex items-center gap-2">

            <span className="font-serif text-2xl">
              {number}
            </span>

            {growth && (
              <span className="text-[9px] text-[#54824e]">
                ↑ {growth}
              </span>
            )}
          </div>

          <p className="text-[9px] uppercase tracking-widest text-black/45">
            {label}
          </p>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
    TIMELINE ITEM
========================================================= */

function TimelineItem({
  date,
  title,
  source,
}) {
  return (
    <div className="relative mb-7 flex gap-4 last:mb-0">

      <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-white bg-[#c3974d] shadow-[0_0_0_1px_rgba(0,0,0,0.12)]" />

      <div>

        <p className="text-[9px] text-black/40">
          {date}
        </p>

        <p className="mt-1 text-xs font-semibold">
          {title}
        </p>

        <p className="mt-1 text-[9px] text-black/40">
          Source: {source}
        </p>

      </div>

      <div className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2f0eb]">

        <FileText
          size={15}
          className="text-black/50"
        />

      </div>
    </div>
  );
}

/* =========================================================
    FINDING COMPONENT
========================================================= */

function Finding({
  title,
  text,
  warning = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        warning
          ? "border-[#d5b36d]/40 bg-[#f6ead2]"
          : "border-black/5 bg-[#f7f6f3]"
      }`}
    >

      <div className="flex items-start gap-3">

        <div
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            warning
              ? "bg-[#e9d29f] text-[#9b6e21]"
              : "bg-white text-black/50"
          }`}
        >

          {warning ? (
            <AlertTriangle size={15} />
          ) : (
            <ShieldCheck size={15} />
          )}

        </div>

        <div>

          <p className="text-xs font-semibold">
            {title}
          </p>

          <p className="mt-1 text-[10px] leading-4 text-black/45">
            {text}
          </p>

        </div>

        <ChevronRight
          size={14}
          className="ml-auto mt-2 text-black/30"
        />

      </div>
    </div>
  );
}

export default Dashboard;