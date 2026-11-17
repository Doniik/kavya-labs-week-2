"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronDown, Clock3, Search, ShieldCheck, UserPlus, UserRoundCog } from "lucide-react";
import { DemoNotice, PageHeading, Panel, inputClass } from "@/components/admin/admin-ui";

const icons = {
  Registration: UserPlus,
  "Role change": ShieldCheck,
  "Account update": UserRoundCog,
  Login: Activity,
};

function formatTimestamp(value) {
  return new Date(value).toLocaleString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminActivityClient({ events: initialEvents, source: initialSource = "demo" }) {
  const [events, setEvents] = useState(initialEvents || []);
  const [source, setSource] = useState(initialSource);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        const response = await fetch("/api/admin/activity", { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        if (!isMounted || !payload?.events) return;
        setEvents(payload.events);
        setSource(payload.source || "demo");
      } catch (error) {
        // preserve fallback data if backend is unavailable
      }
    }

    loadEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return events
      .filter((event) => category === "All categories" || event.category === category)
      .filter((event) => `${event.title} ${event.person} ${event.description} ${event.type}`.toLowerCase().includes(query))
      .sort((a, b) => (sortOrder === "newest" ? new Date(b.date).getTime() - new Date(a.date).getTime() : new Date(a.date).getTime() - new Date(b.date).getTime()));
  }, [events, search, category, sortOrder]);

  return (
    <>
      <DemoNotice />
      <PageHeading title="Activity logs" description={source === "demo" ? "Demo audit trail with search and filtering controls." : "Live account and security events for the platform."} meta="Audit trail" />
      <Panel title="Platform events" description={`${filteredEvents.length} ${source === "demo" ? "demo events" : "events"}`} className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#F0F0F5] p-4 sm:flex-row sm:items-center sm:px-5">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search activity</span>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A1B1]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search events, people or details..." className={`${inputClass} pl-9`} />
          </label>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <label className="relative">
              <span className="sr-only">Filter activity category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full appearance-none rounded-xl border border-[#E5E6EE] bg-white py-2.5 pl-3 pr-8 text-xs text-[#57586C] outline-none focus:border-[#7770C3] sm:w-40">
                <option>All categories</option><option>Users</option><option>Permissions</option><option>Security</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-3 text-[#9293A5]" />
            </label>
            <label className="relative">
              <span className="sr-only">Sort activity by time</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="w-full appearance-none rounded-xl border border-[#E5E6EE] bg-white py-2.5 pl-3 pr-8 text-xs text-[#57586C] outline-none focus:border-[#7770C3] sm:w-36">
                <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-3 text-[#9293A5]" />
            </label>
          </div>
        </div>
        <div className="divide-y divide-[#F3F3F7]">
          {filteredEvents.map((event) => {
            const Icon = icons[event.type] ?? Activity;
            return (
              <article key={event.id} className="flex gap-3.5 px-5 py-4 sm:px-6">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F0FA] text-[#5147A5]"><Icon size={16} /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h2 className="text-xs font-semibold text-[#303146]">{event.title}</h2>
                    <span className="rounded-md bg-[#F6F6F9] px-1.5 py-0.5 text-[10px] text-[#77798D]">{event.category}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#77798D]">{event.person} <span className="px-1 text-[#D0D1DA]">·</span> {event.description}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-[#A0A1B1]"><Clock3 size={12} /> {formatTimestamp(event.date)}</p>
                </div>
                <span className="hidden shrink-0 self-start rounded-full border border-[#EAEBF2] px-2.5 py-1 text-[10px] text-[#77798D] sm:inline-flex">{event.type}</span>
              </article>
            );
          })}
          {filteredEvents.length === 0 && <div className="px-5 py-14 text-center text-sm text-[#9293A5]">No events match your current search.</div>}
        </div>
        <div className="border-t border-[#F0F0F5] px-5 py-3 text-[11px] text-[#A0A1B1]">{source === "demo" ? "Demo data is shown while the database connection is unavailable." : "Current activity records from the application database."}</div>
      </Panel>
    </>
  );
}
