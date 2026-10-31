"use client";

import { useState } from "react";
import { btnPrimary, focus, glow } from "./ui";
import Reveal from "./Reveal";

export default function Cta() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
  }

  return (
    <section id="contact" className="bg-night py-24 text-white" style={glow}>
      <Reveal className="mx-auto max-w-[760px] px-6 text-center">
        <h2 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">Get early access to Kavya.</h2>
        <p className="mx-auto mb-8 mt-4 max-w-md text-white/75">Join the list and we will email you when your spot is ready.</p>
        {done ? (
          <p role="status" className="rounded-2xl border border-accent/50 bg-white/10 px-6 py-5 text-lg">
            Thanks! We'll email {email.trim()} soon.
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row">
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "email-error" : undefined}
              className={`w-full flex-1 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-white placeholder:text-white/50 ${focus}`}
            />
            <button type="submit" className={`${btnPrimary} cursor-pointer`}>Join the list</button>
          </form>
        )}
        {error && <p id="email-error" role="alert" className="mt-3 text-sm text-accent">{error}</p>}
      </Reveal>
    </section>
  );
}
