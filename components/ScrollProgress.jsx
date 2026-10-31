"use client";

import { useEffect, useState } from "react";

// Thin bar at the top of the screen that fills as you scroll down the page.
export default function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? el.scrollTop / max : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-1 w-full origin-left bg-gradient-to-r from-accent via-[#ffd36e] to-brand"
      style={{ transform: `scaleX(${p})` }}
    />
  );
}
