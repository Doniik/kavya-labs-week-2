"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { btnPrimary, btnGhost, glow } from "./ui";
import Reveal from "./Reveal";

const prompts = [
  { q: "Summarise this week's customer complaints", a: "Three themes this week: late deliveries (42%), billing confusion (27%) and login errors (18%). I drafted replies for each and flagged 6 urgent tickets for your team." },
  { q: "Reply to a refund request", a: "Hi Sam, I've checked your order and approved a refund of $24. It will reach your account in 3 to 5 days. Is there anything else I can help with?" },
  { q: "Book a meeting with the design team", a: "Found a slot: Thursday at 3:00 pm for 30 minutes, with all four designers free. I sent the invite and added an agenda." },
];

const chip =
  "rounded-full border px-3.5 py-1.5 text-sm transition " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent";
const chipOn = "border-accent bg-accent text-ink";
const chipOff = "border-white/25 text-white/85 hover:bg-white/10";

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const answer = prompts[idx].a;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(answer.length);
      return;
    }
    setShown(0);
    const t = setInterval(() => setShown((s) => (s >= answer.length ? s : s + 2)), 20);
    return () => clearInterval(t);
  }, [answer]);

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-night text-white"
      style={glow}
    >
      <div className="mx-auto grid max-w-[1080px] items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:pb-28 md:pt-24">
        <Reveal>
          <p className="mb-5 inline-block rounded-full border border-white/20 px-3 py-1 text-sm text-white/80">
            Now in early access
          </p>
          <h1 className="font-heading text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl">
            AI that takes the <span className="bg-gradient-to-r from-accent to-[#ffd36e] bg-clip-text text-transparent">busywork</span> off your team.
          </h1>
          <p className="mb-9 mt-6 max-w-xl text-xl text-white/75">
            Kavya Labs builds AI assistants that answer questions, sort requests and finish routine tasks, so your people can focus on the work that matters.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className={btnPrimary}>Get started</Link>
            <a href="#how" className={btnGhost}>See how it works</a>
          </div>
        </Reveal>

        <Reveal delay={200}>
        <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
          <p className="mb-3 text-sm text-white/60">Try a sample task</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {prompts.map((p, i) => (
              <button
                key={p.q}
                type="button"
                aria-pressed={i === idx}
                onClick={() => setIdx(i)}
                className={`${chip} ${i === idx ? chipOn : chipOff}`}
              >
                {p.q}
              </button>
            ))}
          </div>
          <div className="space-y-3" aria-live="polite">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-white/15 px-4 py-3 text-[0.98rem]">{prompts[idx].q}</div>
            <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-[0.98rem] text-ink">
              <small className="mb-1 block text-xs font-medium text-muted">Kavya AI</small>
              {answer.slice(0, shown)}
              {shown < answer.length && <span className="animate-pulse">▍</span>}
            </div>
          </div>
          <p className="mt-4 text-xs text-white/50">Sample conversation, written in advance.</p>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
