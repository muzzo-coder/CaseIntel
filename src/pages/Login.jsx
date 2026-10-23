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
  X,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.auth.login({ email, password });
      if (response && response.access_token) {
        localStorage.setItem("legalAI_token", response.access_token);
        localStorage.setItem("legalAI_user", JSON.stringify(response.user));
        localStorage.setItem("legalAI_loggedIn", "true");
      }
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");

    if (!forgotEmail) {
      setForgotError("Please enter your registered email address.");
      return;
    }

    setForgotLoading(true);
    try {
      const response = await api.auth.forgotPassword(forgotEmail);
      setForgotLoading(false);
      setForgotMessage(
        response.message || "Password reset instructions have been sent to your email."
      );
    } catch (err) {
      setForgotLoading(false);
      setForgotError(err.message || "Failed to request password reset.");
    }
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
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotMessage("");
                        setForgotError("");
                      }}
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Reset Your Password
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-3 text-sm text-slate-600">
              Enter your registered email address and we'll send you instructions to reset your password.
            </p>

            {forgotMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                <CheckCircle2 size={18} className="shrink-0 text-green-600" />
                <span>{forgotMessage}</span>
              </div>
            )}

            {forgotError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {forgotError}
              </div>
            )}

            {!forgotMessage && (
              <form onSubmit={handleForgotPassword} className="mt-4 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="lawyer@example.com"
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60"
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}

            {forgotMessage && (
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;