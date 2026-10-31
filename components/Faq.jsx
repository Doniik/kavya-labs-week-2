"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { focus } from "./ui";
import Reveal from "./Reveal";

const items = [
  { q: "What can Kavya do?", a: "It answers questions, sorts incoming requests and finishes routine tasks such as replying to emails, updating records and booking meetings." },
  { q: "Do I need to be technical?", a: "No. You describe the task in plain English and connect your tools in a few clicks." },
  { q: "Is my data safe?", a: "Your data is encrypted and never used to train public models. You choose how long it is kept." },
  { q: "How do I get started?", a: "Join the early access list below and we will contact you with next steps." },
];

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-tint py-24">
      <div className="mx-auto max-w-[760px] px-6">
        <Reveal>
        <p className="mb-4 inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">FAQ</p>
        <h2 className="mb-10 font-heading text-4xl font-bold tracking-tight md:text-5xl">Questions, answered.</h2>
        <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {items.map((it, i) => (
            <div key={it.q} className={`transition ${open === i ? "bg-brand/5" : ""}`}>
              <h3>
                <button
                  type="button"
                  aria-expanded={open === i}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-heading text-lg font-bold ${focus}`}
                >
                  {it.q}
                  <ChevronDown aria-hidden="true" className={`shrink-0 text-brand transition ${open === i ? "rotate-180" : ""}`} />
                </button>
              </h3>
              {open === i && <p id={`faq-${i}`} className="px-6 pb-5 text-muted">{it.a}</p>}
            </div>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
  );
}
