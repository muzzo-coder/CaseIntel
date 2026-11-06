import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import GoldSeal from "../components/ui/GoldSeal";
import DemoTag from "../components/ui/DemoTag";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("counsel@caseintel.law");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your registered email address and credentials.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("legalAI_loggedIn", "true");
      setLoading(false);
      navigate("/app/dashboard");
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail("counsel@caseintel.law");
    setPassword("matter-ci-2026");
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ─── Left Panel: 50% Black Surface ───────────────────────────────── */}
      <div className="surface-black w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--ink-700)]">
        <div>
          {/* Brand header */}
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
              MATTER WORKSPACE ACCESS
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[var(--paper-0)] mt-3 leading-[1.15]">
              Evidentiary rigor for complex litigation.
            </h1>
            <p className="font-doc text-base text-[var(--ink-300)] mt-6 leading-relaxed">
              Log in to review cross-document contradictions, explore char-grounded timelines, and prepare court-ready briefs with zero probabilistic drift.
            </p>

            {/* Matter dossier badge */}
            <div className="mt-10 rounded border border-[var(--ink-800)] bg-[var(--ink-900)] p-4 shadow-on-black max-w-md">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--ink-800)] text-xs">
                <span className="case-id text-[11px] text-[var(--gold-400)]">ACTIVE DOSSIER</span>
                <DemoTag />
              </div>
              <div className="mt-2 text-sm font-medium text-[var(--paper-0)]">
                Sharma v. Regional Bank of Delhi
              </div>
              <div className="mt-1 text-xs text-[var(--ink-400)] flex items-center justify-between">
                <span>Delhi High Court · Commercial Appellate</span>
                <span className="text-[var(--gold-400)] font-mono">5 Findings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security badge at bottom */}
        <div className="mt-12 pt-6 border-t border-[var(--ink-800)] flex items-center gap-2 text-xs text-[var(--ink-400)]">
          <ShieldCheck size={16} className="text-[var(--gold-400)]" />
          <span>FIPS 140-3 Compliant Session · Deterministic Audit Trail</span>
        </div>
      </div>

      {/* ─── Right Panel: 50% Paper White Surface ───────────────────────── */}
      <div className="surface-white w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between bg-[var(--paper-50)]">
        <div className="flex justify-end">
          <Link
            to="/register"
            className="text-xs uppercase tracking-wider text-[var(--paper-700)] hover:text-[var(--paper-900)] transition-colors"
          >
            Need an account? <span className="font-semibold text-[var(--gold-600)] underline">Register</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-12">
          <div className="mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[var(--paper-900)]">
              Sign in to CaseIntel
            </h2>
            <p className="mt-2 text-xs text-[var(--paper-500)]">
              Enter your credentials to access active client matters and verified evidence.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded border border-[var(--state-error-text)] bg-[var(--state-error-bg)] p-3 text-xs text-[var(--state-error-text)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="meta-label block mb-1.5" htmlFor="email">
                Bar / Institutional Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base text-sm"
                  placeholder="counsel@chambers.law"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="meta-label" htmlFor="password">
                  Security Passphrase
                </label>
                <a
                  href="#reset"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Demo environment: Use 'password123' to log in.");
                  }}
                  className="text-[11px] text-[var(--gold-600)] hover:underline"
                >
                  Forgot passphrase?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base text-sm pr-10"
                  placeholder="••••••••••••"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[var(--paper-700)]">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-[var(--paper-300)] text-[var(--ink-950)] focus:ring-[var(--gold-500)]"
                />
                <span>Keep workstation authorized for 8 hours</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center py-2.5 text-xs uppercase tracking-wider"
            >
              {loading ? "Authenticating Session..." : "Access Matter Workspace"}
              {!loading && <ArrowRight size={13} />}
            </button>
          </form>

          {/* Quick Demo Login Fill */}
          <div className="mt-6 pt-6 border-t border-[var(--paper-200)] text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-[var(--gold-600)] hover:text-[var(--gold-500)] font-mono underline inline-flex items-center gap-1.5"
            >
              <GoldSeal size={14} />
              Fill Demo Credentials (Sharma v. Bank)
            </button>
          </div>
        </div>

        {/* Footer legal disclaimer */}
        <div className="pt-6 border-t border-[var(--paper-200)] text-center">
          <p className="text-[10px] text-[var(--paper-500)]">
            CaseIntel is a research and review aid, NOT legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
