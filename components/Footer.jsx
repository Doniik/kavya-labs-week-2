import { focus } from "./ui";

const link = `text-white/70 no-underline hover:text-white hover:underline ${focus}`;

export default function Footer() {
  return (
    <footer className="bg-deep text-white">
      <div className="mx-auto max-w-[1080px] px-6 pb-10 pt-14">
        <div className="flex flex-wrap justify-between gap-10">
          <div>
            <p className="font-heading text-xl font-bold">Kavya Labs</p>
            <p className="mt-1 text-white/60">AI assistants for busy teams.</p>
          </div>
          <div>
            <h2 className="mb-3 font-heading text-base font-bold">Product</h2>
            <ul className="space-y-2">
              <li><a href="#features" className={link}>Features</a></li>
              <li><a href="#how" className={link}>How it works</a></li>
              <li><a href="#faq" className={link}>FAQ</a></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-heading text-base font-bold">Contact</h2>
            <ul className="space-y-2">
              <li><a href="mailto:hello@kavyalabs.example" className={link}>hello@kavyalabs.example</a></li>
              <li><a href="#contact" className={link}>Get early access</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-5 text-sm text-white/50">&copy; 2026 Kavya Labs. All rights reserved.</p>
      </div>
    </footer>
  );
}
