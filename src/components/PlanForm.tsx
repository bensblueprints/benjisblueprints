"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlanForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
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
      // Email delivered + lead notified by the API; send them to the library.
      router.push("/plans");
    } catch {
      setStatus("error");
      setError("Network error. Try again.");
    }
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
