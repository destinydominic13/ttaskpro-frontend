"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import API from "../lib/api";
import { saveToken, saveUser } from "../lib/auth";
import Link from "next/link";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/verify-otp", { email, otp });
      saveToken(res.data.token);
      saveUser(res.data.user);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");
    setResending(true);
    try {
      const res = await API.post("/auth/resend-otp", { email });
      setSuccess(res.data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📧</div>
          <h1 className="text-2xl font-bold text-[#0d2d6e]">
            Verify Your Email
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl mb-4 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            required
            maxLength={6}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-[#0d2d6e] transition-colors"
            placeholder="------"
          />

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-[#0d2d6e] text-white py-3 rounded-xl font-semibold hover:bg-[#0a2458] transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Didn't receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-[#0d2d6e] font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend Code"}
          </button>
        </div>

        <div className="text-center mt-4">
          <Link href="/login" className="text-gray-400 text-sm hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
