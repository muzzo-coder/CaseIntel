import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scale,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    // Frontend-only login for now.
    // Later this will be replaced with the backend API.
    setTimeout(() => {
      localStorage.setItem("legalAI_loggedIn", "true");
      setLoading(false);
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link to="/" className="flex items-center gap-3">
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
          </Link>

          <Link
            to="/register"
            className="text-sm font-semibold text-blue-900 hover:text-blue-700"
          >
            Create Account
          </Link>

        </div>
      </header>

      {/* Main */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">

          {/* Left Information Panel */}
          <div className="hidden bg-blue-900 p-10 text-white lg:block">

            <div className="flex h-full flex-col justify-between">

              <div>
                <div className="mb-8 inline-flex rounded-xl bg-white/10 p-3">
                  <ShieldCheck size={28} />
                </div>

                <h2 className="text-3xl font-bold leading-tight">
                  Welcome back to your Legal AI Workspace.
                </h2>

                <p className="mt-5 leading-7 text-blue-100">
                  Access your legal documents, AI assistance, research,
                  analysis and reports from one secure workspace.
                </p>
              </div>

              <div className="mt-10 space-y-4">

                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <ShieldCheck size={18} />
                  AI-assisted legal analysis
                </div>

                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <ShieldCheck size={18} />
                  Document intelligence
                </div>

                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <ShieldCheck size={18} />
                  Legal research and verification
                </div>

              </div>

            </div>
          </div>

          {/* Login Form */}
          <div className="p-8 sm:p-10">

            <div className="mx-auto max-w-md">

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  Sign in
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Sign in to continue to your Legal AI Workspace.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-medium text-blue-900 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-slate-300"
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-600"
                  >
                    Remember me
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In"}

                  {!loading && <ArrowRight size={18} />}
                </button>

              </form>

              {/* Register */}
              <p className="mt-7 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-900 hover:text-blue-700"
                >
                  Create an account
                </Link>
              </p>

              {/* Disclaimer */}
              <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                AI-generated information is provided for informational
                purposes and should be reviewed by a qualified legal
                professional.
              </p>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;