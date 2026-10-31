import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export const metadata = { title: "Dashboard — Kavya Labs" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { name, email, image } = session.user;

  return (
    <main className="min-h-screen bg-tint">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold no-underline">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
            Kavya Labs
          </Link>
          <SignOutButton />
        </div>
      </header>
      <section className="mx-auto max-w-[1080px] px-6 py-16">
        <div className="flex items-center gap-5 rounded-2xl border border-line bg-white p-6">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" referrerPolicy="no-referrer" className="h-16 w-16 rounded-full" />
          )}
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome, {name || "there"}.</h1>
            <p className="text-muted">Signed in as {email}</p>
          </div>
        </div>
        <p className="mt-6 text-muted">
          You're signed in with Google. This page is only visible to signed-in users.
        </p>
      </section>
    </main>
  );
}
