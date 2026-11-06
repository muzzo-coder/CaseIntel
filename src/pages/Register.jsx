import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import GoldSeal from "../components/ui/GoldSeal";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Adv. Rajesh Verma",
    chambers: "Verma & Associates Legal",
    barNumber: "D/1482/2018",
    email: "counsel@verma-law.in",
    password: "Password123!",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Please complete all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("legalAI_loggedIn", "true");
      setLoading(false);
      navigate("/app/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ─── Left Panel: 50% Black Surface ───────────────────────────────── */}
      <div className="surface-black w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--ink-700)]">
        <div>
          <Link to="/" className="flex items-center gap-3 group inline-flex">
            <GoldSeal size={32} />
            <div className="flex flex-col">
              <span className="font-display text-xl font-semibold tracking-wide text-[var(--paper-0)]">
                CaseIntel
              </span>
              <span className="case-id text-[10px] tracking-wider text-[var(--gold-400)] -mt-1">
                LEGAL INTELLIGENCE
              </span>
            </div>
          </Link>

          <div className="mt-16 lg:mt-24 max-w-lg">
            <span className="meta-label on-black text-[11px] text-[var(--gold-400)]">
              COUNSEL ONBOARDING
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[var(--paper-0)] mt-3 leading-[1.15]">
              Dedicated workspaces for your chambers.
            </h1>
            <p className="font-doc text-base text-[var(--ink-300)] mt-6 leading-relaxed">
              Every matter is isolated into a secure evidentiary silo. No data is shared, retained, or utilized for generative model training.
            </p>

            <div className="mt-10 space-y-4 text-xs text-[var(--ink-300)]">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[var(--gold-400)] shrink-0" />
                <span>Client matter data isolation with dedicated encryption keys</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[var(--gold-400)] shrink-0" />
                <span>Deterministic extraction with exact character span grounding</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-[var(--gold-400)] shrink-0" />
                <span>Compliant with High Court electronic filing guidelines</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--ink-800)] flex items-center gap-2 text-xs text-[var(--ink-400)]">
          <ShieldCheck size={16} className="text-[var(--gold-400)]" />
          <span>CaseIntel Professional Edition · ISO 27001 Certified Infrastructure</span>
        </div>
      </div>

      {/* ─── Right Panel: 50% Paper White Surface ───────────────────────── */}
      <div className="surface-white w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between bg-[var(--paper-50)]">
        <div className="flex justify-end">
          <Link
            to="/login"
            className="text-xs uppercase tracking-wider text-[var(--paper-700)] hover:text-[var(--paper-900)] transition-colors"
          >
            Existing workspace? <span className="font-semibold text-[var(--gold-600)] underline">Sign in</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[var(--paper-900)]">
              Register Counsel Workspace
            </h2>
            <p className="mt-2 text-xs text-[var(--paper-500)]">
              Set up your verified legal workspace to begin ingesting matter documents.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded border border-[var(--state-error-text)] bg-[var(--state-error-bg)] p-3 text-xs text-[var(--state-error-text)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="meta-label block mb-1" htmlFor="name">
                Counsel Name / Lead Advocate
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-base text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="meta-label block mb-1" htmlFor="chambers">
                  Chambers / Firm
                </label>
                <input
                  id="chambers"
                  type="text"
                  value={formData.chambers}
                  onChange={(e) => setFormData({ ...formData, chambers: e.target.value })}
                  className="input-base text-sm"
                />
              </div>

              <div>
                <label className="meta-label block mb-1" htmlFor="barNumber">
                  Bar Enrollment No.
                </label>
                <input
                  id="barNumber"
                  type="text"
                  value={formData.barNumber}
                  onChange={(e) => setFormData({ ...formData, barNumber: e.target.value })}
                  className="input-base text-sm"
                  placeholder="e.g. D/1234/2020"
                />
              </div>
            </div>

            <div>
              <label className="meta-label block mb-1" htmlFor="regEmail">
                Official Email Address
              </label>
              <input
                id="regEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-base text-sm"
                required
              />
            </div>

            <div>
              <label className="meta-label block mb-1" htmlFor="regPassword">
                Master Passphrase
              </label>
              <div className="relative">
                <input
                  id="regPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-base text-sm pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--paper-500)] hover:text-[var(--paper-700)]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="pt-2 text-xs">
              <label className="flex items-start gap-2 cursor-pointer text-[var(--paper-700)] leading-relaxed">
                <input
                  type="checkbox"
                  defaultChecked
                  required
                  className="mt-0.5 rounded border-[var(--paper-300)] text-[var(--ink-950)] focus:ring-[var(--gold-500)]"
                />
                <span>
                  I acknowledge that CaseIntel is an analysis aid and does not constitute formal legal counsel.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center py-2.5 text-xs uppercase tracking-wider mt-2"
            >
              {loading ? "Initializing Workspace..." : "Establish Workspace"}
              {!loading && <ArrowRight size={13} />}
            </button>
          </form>
        </div>

        <div className="pt-6 border-t border-[var(--paper-200)] text-center">
          <p className="text-[10px] text-[var(--paper-500)]">
            CaseIntel is a research and review aid, NOT legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
