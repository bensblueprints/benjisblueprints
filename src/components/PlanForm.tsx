"use client";

import { useState } from "react";

const PLANS_URL =
  process.env.NEXT_PUBLIC_PLANS_URL ||
  "https://drive.google.com/drive/folders/1I--Aa_uMJMtv5p95IHHBcEGPJj1gEA0u";

export default function PlanForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/get-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "Something went wrong. Try again.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="planform-done">
        <div className="planform-check">✓</div>
        <h2>You&apos;re in!</h2>
        <p>Your business plans are ready — and we emailed the link to you too.</p>
        <a className="planform-open" href={PLANS_URL} target="_blank" rel="noopener noreferrer">
          Open the plans folder →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="planform" noValidate>
      <input
        type="email"
        required
        autoComplete="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading"}
        aria-label="Email address"
      />
      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send Me The Plans →"}
      </button>
      {status === "error" && <p className="planform-error">{error}</p>}
      <p className="planform-fine">Free. No spam. Unsubscribe anytime.</p>
    </form>
  );
}
