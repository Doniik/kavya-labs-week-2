"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { btnPrimary, focus } from "./ui";

const links = [
  { id: "features", label: "Features" },
  { id: "how", label: "How it works" },
  { id: "faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { status } = useSession();
  const signedIn = status === "authenticated";

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ["top", ...links.map((l) => l.id), "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const authLinks = signedIn ? (
    <>
      <Link href="/dashboard" className={`${btnPrimary} !py-2`}>Dashboard</Link>
      <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className={`cursor-pointer text-white/70 hover:text-white ${focus}`}>
        Sign out
      </button>
    </>
  ) : (
    <Link href="/login" className={`${btnPrimary} !py-2`}>Sign in</Link>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night/85 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-4">
        <Link href="/" className={`flex items-center gap-2 font-heading text-xl font-bold no-underline ${focus}`}>
          <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
          Kavya Labs
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.id}
              href={`/#${l.id}`}
              aria-current={active === l.id ? "true" : undefined}
              className={`border-b-2 py-1 no-underline transition ${focus} ${
                active === l.id ? "border-accent text-white" : "border-transparent text-white/70 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
          {authLinks}
        </nav>
        <button
          type="button"
          className={`rounded-md p-2 md:hidden ${focus}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="flex flex-col gap-1 border-t border-white/10 px-6 pb-5 pt-3 md:hidden">
          {links.map((l) => (
            <a key={l.id} href={`/#${l.id}`} onClick={() => setOpen(false)} className={`py-2 text-lg text-white/85 no-underline ${focus}`}>{l.label}</a>
          ))}
          {signedIn ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className={`${btnPrimary} mt-2 text-center`}>Dashboard</Link>
              <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className={`py-2 text-left text-lg text-white/85 ${focus}`}>Sign out</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className={`${btnPrimary} mt-2 text-center`}>Sign in</Link>
          )}
        </nav>
      )}
    </header>
  );
}
