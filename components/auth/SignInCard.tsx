"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function SignInCard() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch {
      toast.error("Sign in failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-full max-w-md mx-4"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #4f7fff, transparent)" }} />
      </div>

      <div className="glass-card p-8 relative overflow-hidden">
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #4f7fff, #a78bfa, transparent)" }} />

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="float-anim inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #4f7fff, #a78bfa)", boxShadow: "0 8px 32px rgba(79,127,255,0.4)" }}>
            <span className="text-3xl">🧬</span>
          </div>
          <h1 className="font-syne text-2xl font-bold" style={{ color: "var(--text)" }}>
            Welcome to MediLearn AI
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text3)" }}>
            AI-powered medical learning platform
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {["🎯 Smart Quizzes", "📹 Video Quizzes", "📊 Analytics", "🏆 Leaderboards"].map((f) => (
            <span key={f} className="text-xs font-medium px-3 py-1 rounded-full"
              style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text2)" }}>
              {f}
            </span>
          ))}
        </div>

        {/* Google Sign-in */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: loading ? "var(--surface2)" : "linear-gradient(135deg, #4f7fff, #a78bfa)",
            color: "#fff",
            boxShadow: loading ? "none" : "0 4px 20px rgba(79,127,255,0.4)",
          }}
          onMouseEnter={(e) => !loading && ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)")}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="rgba(255,255,255,0.8)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="rgba(255,255,255,0.6)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="rgba(255,255,255,0.9)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {loading ? "Signing in…" : "Continue with Google"}
        </button>

        <p className="text-center text-xs mt-6" style={{ color: "var(--text3)" }}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
          <br />Your data is securely stored and never shared.
        </p>
      </div>
    </motion.div>
  );
}
