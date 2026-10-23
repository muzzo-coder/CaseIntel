import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Scale,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Missing or invalid password reset token. Please request a new link.");
      return;
    }

    if (!newPassword || !confirmNewPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.auth.resetPassword({
        token,
        newPassword,
        confirmNewPassword,
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to reset password. The link may have expired.");
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

      {/* Main container */}
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Create New Password
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your new password below to regain access to your account.
            </p>
          </div>

          {!token && (
            <div className="mb-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">Reset token missing</p>
                <p className="mt-1 text-xs text-amber-700">
                  Please click the link sent to your email address or request a new reset link from the login page.
                </p>
                <Link
                  to="/login"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-900 underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                <CheckCircle2 size={26} />
              </div>
              <h3 className="mt-3 text-base font-bold text-green-900">
                Password Reset Successfully!
              </h3>
              <p className="mt-1 text-xs text-green-700">
                Your password has been updated. Redirecting to login...
              </p>
              <Link
                to="/login"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-900 hover:underline"
              >
                Go to Sign In now <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-11 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="mt-2 w-full rounded-lg bg-blue-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-60"
              >
                {loading ? "Updating Password..." : "Reset Password"}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-600 hover:text-blue-900"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
