import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Play,
  Scale,
  ShieldCheck,
  FileText,
  Users,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08090C] text-white">

      {/* =====================================================
          TOP HEADER
      ===================================================== */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <Scale
              size={30}
              strokeWidth={1.5}
              className="text-[#d8ae62]"
            />

            <div>
              <span className="font-serif text-lg tracking-wide">
                CASEINTEL
              </span>

              <span className="block text-[8px] uppercase tracking-[0.18em] text-[#d8ae62]">
                AI-First Legal Intelligence
              </span>
            </div>

          </div>


          {/* Header Button */}
          <button
            onClick={() => navigate("/app/dashboard")}
            className="rounded-full bg-[#d8ae62] px-6 py-2.5 text-xs font-semibold text-black transition hover:bg-white"
          >
            Enter Dashboard
          </button>

        </div>
      </header>


      {/* =====================================================
          FULL SCREEN VIDEO HERO
      ===================================================== */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-16">

        {/* ---------------------------------------------------
            BACKGROUND VIDEO
        --------------------------------------------------- */}
        <div className="absolute inset-0">

          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source
              src="/caseintel-law-hero.mp4"
              type="video/mp4"
            />
          </video>


          {/* Overall dark overlay */}
          <div className="absolute inset-0 bg-black/45" />


          {/* Strong left gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />


          {/* Bottom cinematic fade */}
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black to-transparent" />

        </div>


        {/* ---------------------------------------------------
            HERO CONTENT
        --------------------------------------------------- */}
        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 py-24 lg:px-12">

          <div className="max-w-3xl">

            {/* Small Label */}
            <div className="mb-7 flex items-center gap-3">

              <span className="h-px w-12 bg-[#d8ae62]" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#d8ae62]">
                Investigation Command Center
              </span>

            </div>


            {/* Main Heading */}
            <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.03em] text-white sm:text-6xl lg:text-8xl">

              Every fact

              <br />

              <span className="text-[#d8ae62]">
                grounded.
              </span>

              <br />

              Every discrepancy

              <br />

              <span className="text-white/90">
                verified.
              </span>

            </h1>


            {/* Description */}
            <p className="mt-8 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
              CaseIntel transforms complex legal documents into
              verifiable intelligence — connecting evidence,
              entities, events, timelines and contradictions
              with source-grounded citations.
            </p>


            {/* Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              {/* Primary */}
              <button
                onClick={() => navigate("/login")}
                className="group flex items-center justify-center gap-3 rounded-full bg-[#d8ae62] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-black shadow-xl shadow-black/20 transition-all duration-300 hover:bg-white"
              >
                Open Matter Workspace

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </button>


              {/* Secondary */}
              <button
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-all duration-300 hover:border-[#d8ae62] hover:bg-white/10"
              >

                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/30">
                  <Play
                    size={11}
                    fill="currentColor"
                  />
                </span>

                Review Demo Matter

              </button>

            </div>


            {/* Feature row */}
            <div className="mt-12 grid max-w-2xl grid-cols-1 gap-6 border-t border-white/15 pt-7 sm:grid-cols-3">

              {/* Feature 1 */}
              <div>

                <div className="mb-2 flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#d8ae62]" />

                  <span className="text-[8px] uppercase tracking-[0.2em] text-white/40">
                    Grounding
                  </span>

                </div>

                <p className="text-xs text-white/75">
                  Verifiable Span Grounding
                </p>

              </div>


              {/* Feature 2 */}
              <div>

                <div className="mb-2 flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#d8ae62]" />

                  <span className="text-[8px] uppercase tracking-[0.2em] text-white/40">
                    Accuracy
                  </span>

                </div>

                <p className="text-xs text-white/75">
                  Zero Hallucination Tolerance
                </p>

              </div>


              {/* Feature 3 */}
              <div>

                <div className="mb-2 flex items-center gap-2">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#d8ae62]" />

                  <span className="text-[8px] uppercase tracking-[0.2em] text-white/40">
                    Audit
                  </span>

                </div>

                <p className="text-xs text-white/75">
                  Deterministic Audit Trail
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            LIVE STATUS
        ================================================= */}
        <div className="absolute right-6 top-24 z-20 hidden lg:block">

          <div className="rounded-full border border-white/15 bg-black/50 px-4 py-2 backdrop-blur-md">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 animate-pulse rounded-full bg-[#d8ae62]" />

              <span className="text-[9px] uppercase tracking-[0.22em] text-white/70">
                Intelligence Engine Active
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          METRICS
      ===================================================== */}
      <section className="relative z-20 bg-black px-6 py-10">

        <div className="mx-auto grid max-w-[1450px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-white/10">

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

    </div>
  );
}


/* =========================================================
   METRIC COMPONENT
========================================================= */

function Metric({ icon: Icon, number, label, growth }) {

  return (
    <div className="flex items-center gap-4 p-6">

      <Icon
        size={27}
        strokeWidth={1.5}
        className="text-[#d8ae62]"
      />

      <div>

        <div className="flex items-center gap-2">

          <span className="font-serif text-2xl text-white">
            {number}
          </span>

          {growth && (
            <span className="text-[10px] text-green-400">
              ↑ {growth}
            </span>
          )}

        </div>

        <p className="text-[9px] uppercase tracking-widest text-white/50">
          {label}
        </p>

      </div>

    </div>
  );
}