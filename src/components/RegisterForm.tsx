"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
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
        <h2>Check your inbox 📬</h2>
        <p>
          We just emailed <strong>{email}</strong> a one-click access link. Click it to unlock
          all 245+ plans — it logs you straight in.
        </p>
        <p className="planform-fine">
          No email in a minute? Check spam, or{" "}
          <a
            href="#"
            style={{ color: "var(--gold)", fontWeight: 700 }}
            onClick={(ev) => {
              ev.preventDefault();
              setStatus("idle");
            }}
          >
            try again
          </a>
          .
        </p>
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
        {status === "loading" ? "Sending your link…" : "Email Me My Access Link →"}
      </button>
      {status === "error" && <p className="planform-error">{error}</p>}
      <p className="planform-fine">Free forever. One email = instant access. No password.</p>
    </form>
  );
}
