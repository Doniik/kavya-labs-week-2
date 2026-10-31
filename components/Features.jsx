import Reveal from "./Reveal";
import { Brain, Zap, Plug, Clock, Users, ShieldCheck } from "lucide-react";

const features = [
  { icon: Brain, title: "Knows your business", text: "Connect your docs, help centre and past conversations so answers come from your own information." },
  { icon: Zap, title: "Finishes routine tasks", text: "Replies, bookings, record updates and reports get done automatically." },
  { icon: Plug, title: "Works with your tools", text: "Plug into your inbox, helpdesk, calendar and chat in a few clicks." },
  { icon: Clock, title: "Always on", text: "Answers in seconds, any hour of the day, so nobody is left waiting." },
  { icon: Users, title: "Your team stays in charge", text: "Step in at any point, review what the AI did, and undo anything." },
  { icon: ShieldCheck, title: "Secure by default", text: "Your data is encrypted and never used to train public models." },
];

export default function Features() {
  return (
    <section id="features" className="bg-tint py-24">
      <div className="mx-auto max-w-[1080px] px-6">
        <Reveal>
          <p className="mb-4 inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">Features</p>
          <h2 className="mb-14 max-w-[18em] font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Everything you need to hand off the boring work.
          </h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={(i % 3) * 100} className="h-full">
            <div className="h-full rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/15">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-ink text-white shadow-md shadow-brand/30">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mb-2 font-heading text-xl font-bold">{title}</h3>
              <p className="text-muted">{text}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
