"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { focus } from "./ui";

export default function GoogleButton({ callbackUrl = "/dashboard" }) {
  const [loading, setLoading] = useState(false);
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        signIn("google", { callbackUrl });
      }}
      className={`w-full cursor-pointer rounded-full bg-white px-6 py-3 font-medium text-ink shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60 ${focus}`}
    >
      {loading ? "Redirecting to Google…" : "Continue with Google"}
    </button>
  );
}
