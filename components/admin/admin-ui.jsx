"use client";

import { X } from "lucide-react";

export function DemoNotice() {
  return (
    <div className="mb-6 flex items-start gap-2 rounded-xl border border-[#E8E5F8] bg-[#F7F6FD] px-4 py-3 text-xs leading-5 text-[#625C91]">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7770C3]" />
      <p><strong className="font-semibold">Preview with sample data.</strong> Figures and records shown here are illustrative, not live Kavya Labs data.</p>
    </div>
  );
}

export function PageHeading({ title, description, action, meta }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {meta && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#7770C3]">{meta}</p>}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[#17182B] sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-[#85869A]">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({ label, value, change, icon: Icon, tone = "purple" }) {
  const iconTone = tone === "green"
    ? "bg-[#EEF7F1] text-[#438861]"
    : tone === "gold"
      ? "bg-[#F9F5E9] text-[#9A8244]"
      : "bg-[#F1F0FA] text-[#5147A5]";

  return (
    <section className="rounded-2xl border border-[#EAEBF2] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#77798D]">{label}</p>
        {Icon && <span className={`rounded-xl p-2.5 ${iconTone}`}><Icon size={18} /></span>}
      </div>
      <p className="mt-4 font-heading text-[30px] font-bold leading-none tracking-tight text-[#17182B]">{value}</p>
      {change && <p className="mt-3 text-xs text-[#85869A]">{change}</p>}
    </section>
  );
}

export function StatusBadge({ children }) {
  const style = children === "Active"
    ? "bg-[#EDF7F0] text-[#438861]"
    : children === "Suspended"
      ? "bg-[#FBEFEF] text-[#B85A5A]"
      : children === "Admin"
        ? "bg-[#F1F0FA] text-[#5147A5]"
        : "bg-[#F4F4F7] text-[#77798D]";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${style}`}>{children}</span>;
}

export function Panel({ title, description, action, children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-[#EAEBF2] bg-white ${className}`}>
      {(title || description || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0F0F5] px-5 py-4 sm:px-6">
          <div>
            {title && <h2 className="text-sm font-semibold text-[#25263B]">{title}</h2>}
            {description && <p className="mt-1 text-xs text-[#9293A5]">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Modal({ title, description, onClose, children, width = "max-w-lg" }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#17182B]/35 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
        className={`w-full ${width} rounded-2xl border border-[#EAEBF2] bg-white shadow-2xl`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#F0F0F5] px-5 py-4">
          <div>
            <h2 id="admin-modal-title" className="font-heading text-lg font-bold text-[#17182B]">{title}</h2>
            {description && <p className="mt-1 text-sm text-[#85869A]">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-[#9293A5] hover:bg-[#F7F7FB]">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}

export const inputClass = "w-full rounded-xl border border-[#E5E6EE] bg-white px-3.5 py-2.5 text-sm text-[#25263B] outline-none transition placeholder:text-[#A0A1B1] focus:border-[#7770C3] focus:ring-2 focus:ring-[#7770C3]/10";
export const secondaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E6EE] bg-white px-3.5 py-2.5 text-sm font-medium text-[#57586C] transition hover:bg-[#FAFAFC] focus:outline-none focus:ring-2 focus:ring-[#7770C3]/20";
export const primaryButtonClass = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#29265B] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#403B80] focus:outline-none focus:ring-2 focus:ring-[#7770C3]/40 focus:ring-offset-2";
