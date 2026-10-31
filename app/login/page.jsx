import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import GoogleButton from "@/components/GoogleButton";
import { glow } from "@/components/ui";

export const metadata = { title: "Sign in — Kavya Labs" };

const messages = {
  AccessDenied: "Access was denied. Please try a different Google account.",
  Configuration: "Sign in is not set up correctly. Please contact the site owner.",
  OAuthAccountNotLinked: "This email is already linked to a different sign in method.",
  default: "Sign in did not work. Please try again.",
};

export default async function LoginPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  const { error, callbackUrl } = await searchParams;
  const missingKeys =
    process.env.NODE_ENV !== "production" &&
    !(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.NEXTAUTH_SECRET);

  return (
    <main className="flex min-h-screen items-center justify-center bg-night px-6 text-white" style={glow}>
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 font-heading text-xl font-bold no-underline">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
          Kavya Labs
        </Link>
        <h1 className="font-heading text-3xl font-bold tracking-tight">Sign in or create your account</h1>
        <p className="mb-7 mt-2 text-white/70">Continue with Google. If you are new, your account is created automatically.</p>
        {missingKeys && (
          <p role="status" className="mb-5 rounded-xl border border-white/30 px-4 py-3 text-left text-sm text-white/80">
            Developer note: Google keys are missing. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and NEXTAUTH_SECRET to .env.local and restart the server.
          </p>
        )}
        {error && (
          <p role="alert" className="mb-5 rounded-xl border border-accent/50 bg-accent/10 px-4 py-3 text-sm">
            {messages[error] || messages.default}
          </p>
        )}
        <GoogleButton callbackUrl={callbackUrl || "/dashboard"} />
        <p className="mt-6 text-sm text-white/50">
          <Link href="/" className="underline hover:text-white">Back to the home page</Link>
        </p>
      </div>
    </main>
  );
}
