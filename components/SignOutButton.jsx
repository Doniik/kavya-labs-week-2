"use client";

import { signOut } from "next-auth/react";
import { focus } from "./ui";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`cursor-pointer rounded-full border-[1.5px] border-ink px-5 py-2 font-medium transition hover:bg-ink hover:text-white ${focus}`}
    >
      Sign out
    </button>
  );
}
