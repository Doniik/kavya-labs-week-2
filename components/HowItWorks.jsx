import Reveal from "./Reveal";

const steps = [
  { title: "Connect your tools", text: "Link your inbox, helpdesk and docs. It takes a few minutes and no code." },
  { title: "Tell it what to do", text: "Describe the task in plain English, such as \"reply to refund requests under $50\"." },
  { title: "Let it work, stay in control", text: "Kavya handles the task and shows you what it did. You can review or undo any step." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-[1080px] px-6 py-24">
      <Reveal>
        <p className="mb-4 inline-block rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">How it works</p>
        <h2 className="mb-14 max-w-[16em] font-heading text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          Up and running in three steps.
        </h2>
      </Reveal>
      <ol className="grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={i * 150} className="h-full border-t-2 border-brand/30 pt-5">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-ink font-heading font-bold text-white shadow-md shadow-brand/30">{i + 1}</span>
              <h3 className="mb-2 font-heading text-xl font-bold">{s.title}</h3>
              <p className="text-muted">{s.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
