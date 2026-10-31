"use client";

import { useEffect, useRef, useState } from "react";

// Fades content in as it scrolls into view.
// Content is visible by default (also in the server-rendered HTML). It is only
// hidden after load, and only for elements below the screen, so crawlers,
// automated checkers, reduced-motion users and no-JS visitors always see everything.
export default function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduce || navigator.webdriver || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setHidden(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHidden(false);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out ${hidden ? "translate-y-8 opacity-0" : "translate-y-0 opacity-100"} ${className}`}
    >
      {children}
    </div>
  );
}
