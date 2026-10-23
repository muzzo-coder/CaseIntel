import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scale,
  Eye,
  EyeOff,
  User,
  Mail,
  LockKeyhole,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.auth.register({
        name,
        email,
        password,
        confirm_password: confirmPassword,
      });

      if (response && response.access_token) {
        localStorage.setItem("legalAI_token", response.access_token);
        localStorage.setItem("legalAI_user", JSON.stringify(response.user));
        localStorage.setItem("legalAI_loggedIn", "true");
      }

      setLoading(false);
      setSuccess("Account created successfully. Redirecting to workspace...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to create account. Please try again.");
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
            to="/login"
            className="text-sm font-semibold text-blue-900 hover:text-blue-700"
          >
            Sign In
          </Link>

        </div>
      </header>

      {/* Main */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">

          {/* Information Panel */}
          <div className="hidden bg-blue-900 p-10 text-white lg:block">

            <div className="flex h-full flex-col justify-between">

              <div>
                <div className="mb-8 inline-flex rounded-xl bg-white/10 p-3">
                  <UserPlus size={28} />
                </div>

                <h2 className="text-3xl font-bold leading-tight">
                  Create your Legal AI Workspace account.
                </h2>

                <p className="mt-5 leading-7 text-blue-100">
                  Create an account to organize legal documents, access AI
                  assistance, perform legal research and manage analysis
                  reports in one workspace.
                </p>
              </div>

              <div className="mt-10 space-y-4">

                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <ShieldCheck size={18} />
                  Centralized legal workspace
                </div>

                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <ShieldCheck size={18} />
                  AI-assisted document analysis
                </div>

                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <ShieldCheck size={18} />
                  Legal research and verification
                </div>

              </div>

            </div>
          </div>

          {/* Registration Form */}
          <div className="p-8 sm:p-10">

            <div className="mx-auto max-w-md">

              <div className="mb-7">
                <h2 className="text-2xl font-bold text-slate-900">
                  Create an account
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Register to start using your Legal AI Workspace.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

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
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
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

                {/* Confirm Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-11 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <label
                    htmlFor="terms"
                    className="text-xs leading-5 text-slate-500"
                  >
                    I understand that AI-generated information is for
                    informational purposes and should be reviewed by a
                    qualified legal professional.
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating Account..." : "Create Account"}

                  {!loading && <UserPlus size={18} />}
                </button>

              </form>

              {/* Login */}
              <p className="mt-7 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-900 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>

              {/* Disclaimer */}
              <p className="mt-7 text-center text-xs leading-5 text-slate-400">
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

export default Register;