"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { focus } from "./ui";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const on = () => setVisible(window.scrollY > 700);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-50 rounded-full bg-accent p-3 text-ink shadow-xl transition duration-300 hover:-translate-y-1 ${focus} ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp size={22} aria-hidden="true" />
    </button>
  );
}
