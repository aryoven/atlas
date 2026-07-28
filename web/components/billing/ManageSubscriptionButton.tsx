"use client";

import { useState } from "react";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Unable to open Billing Portal.");
      }
    } catch {
      alert("Unable to open Billing Portal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-xl border border-white/20 px-5 py-3 text-white hover:bg-white/10 disabled:opacity-50"
    >
      {loading ? "Opening..." : "Manage Subscription"}
    </button>
  );
}