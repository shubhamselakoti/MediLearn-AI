"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ background: "#0a0d14", color: "#e8eaf6", fontFamily: "sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", maxWidth: 400, padding: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: "sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: "#9da4c2", fontSize: 14, marginBottom: 24 }}>{error.message ?? "An unexpected error occurred."}</p>
          <button onClick={reset} style={{ background: "linear-gradient(135deg,#4f7fff,#a78bfa)", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 10, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
