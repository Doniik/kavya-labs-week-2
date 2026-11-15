"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  Clock3,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { DemoNotice, MetricCard, PageHeading, Panel, StatusBadge, primaryButtonClass, secondaryButtonClass } from "../../components/admin/admin-ui";
import { demoActivity, demoUsers, registrationData } from "../../components/admin/demo-data";

const metrics = [
  { label: "Total users", value: "2,840", change: "+12.8% vs. previous month", icon: Users },
  { label: "Active users", value: "1,926", change: "+8.2% vs. previous month", icon: Activity, tone: "green" },
  { label: "New registrations", value: "184", change: "+16.4% vs. previous month", icon: UserPlus },
  { label: "Administrators", value: "4", change: "No change this month", icon: ShieldCheck, tone: "gold" },
];

export default function AdminOverviewPage() {
  const [period, setPeriod] = useState("Last 12 months");
  const [search, setSearch] = useState("");
  const visibleUsers = useMemo(() => demoUsers.slice(0, 5).filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  ), [search]);
  const chartData = period === "Last 30 days"
    ? registrationData.slice(-5)
    : period === "Last 90 days"
      ? registrationData.slice(-3)
      : registrationData;

  return (
    <>
      <DemoNotice />
      <PageHeading
        title="Dashboard overview"
        description="A snapshot of activity across the platform."
        meta="Overview"
        action={
          <Link href="/admin/users" className={primaryButtonClass}>
            <Plus size={16} /> Add user
          </Link>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <Panel
          title="User growth"
          description="Illustrative registrations over time"
          action={
            <label className="relative">
              <span className="sr-only">Chart reporting period</span>
              <select value={period} onChange={(event) => setPeriod(event.target.value)} className="appearance-none rounded-lg border border-[#EAEBF2] bg-white py-2 pl-3 pr-8 text-xs text-[#57586C] outline-none focus:border-[#7770C3]">
                <option>Last 12 months</option>
                <option>Last 90 days</option>
                <option>Last 30 days</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-2.5 text-[#9293A5]" />
            </label>
          }
          className="overflow-hidden"
        >
          <div className="px-5 pb-5 pt-4 sm:px-6">
            <div className="mb-3 flex items-center gap-2 text-xs text-[#77798D]">
              <span className="h-2 w-2 rounded-sm bg-[#7770C3]" /> Sign-ups <span className="ml-auto inline-flex items-center gap-1 text-[#438861]"><ArrowUpRight size={14} /> 16.4%</span>
            </div>
            <div className="relative flex h-[210px] items-end gap-2 border-b border-[#EAEBF2] px-1 sm:gap-3">
              {[25, 50, 75, 100].map((line) => <div key={line} className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#F0F0F5]" style={{ bottom: `${line}%` }} />)}
              {chartData.map((item) => (
                <div key={item.month} className="group relative z-[1] flex h-full min-w-0 flex-1 items-end">
                  <div
                    title={`${item.month}: ${item.value} sample registrations`}
                    style={{ height: `${item.value}%` }}
                    className="w-full cursor-default rounded-t-md bg-[#8A83CC] transition-colors group-hover:bg-[#5147A5]"
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-[#A0A1B1]">
              {chartData.map((item) => <span key={item.month}>{item.month}</span>)}
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-[#A0A1B1]"><CalendarDays size={13} /> Reporting period: {period.toLowerCase()}</p>
          </div>
        </Panel>

        <Panel title="Recent activity" description="Latest sample platform events" action={<Link href="/admin/activity" className="text-xs font-medium text-[#5147A5] hover:text-[#29265B]">View logs</Link>}>
          <div className="divide-y divide-[#F3F3F7] px-5 sm:px-6">
            {demoActivity.slice(0, 4).map((event, index) => {
              const Icon = [UserPlus, ShieldCheck, Activity, Clock3][index];
              return (
                <div key={event.id} className="flex gap-3 py-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F0FA] text-[#5147A5]"><Icon size={15} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#303146]">{event.title}</p>
                    <p className="mt-1 truncate text-[11px] text-[#9293A5]">{event.person} · {event.description}</p>
                  </div>
                  <span className="shrink-0 pt-0.5 text-[10px] text-[#A0A1B1]">{index === 0 ? "10m" : `${index}h`}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <Panel
        title="Recent users"
        description="Recently registered sample accounts"
        className="mt-5 overflow-hidden"
        action={<Link href="/admin/users" className="text-xs font-semibold text-[#5147A5] hover:text-[#29265B]">View all users <span aria-hidden="true">→</span></Link>}
      >
        <div className="flex items-center gap-2 border-b border-[#F3F3F7] px-5 py-3 sm:px-6">
          <Search size={15} className="text-[#A0A1B1]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search sample users..." className="w-full max-w-xs bg-transparent text-xs outline-none placeholder:text-[#A0A1B1]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="bg-[#FAFAFC] text-[10px] uppercase tracking-[0.08em] text-[#9293A5]">
              <tr><th className="px-6 py-3 font-semibold">User</th><th className="px-4 py-3 font-semibold">Role</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Joined</th><th className="px-6 py-3 text-right font-semibold">Actions</th></tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user.id} className="border-t border-[#F3F3F7] hover:bg-[#FCFCFE]">
                  <td className="px-6 py-3.5">
                    <p className="font-medium text-[#303146]">{user.name}</p>
                    <p className="mt-0.5 text-[11px] text-[#9293A5]">{user.email}</p>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge>{user.role}</StatusBadge></td>
                  <td className="px-4 py-3.5"><StatusBadge>{user.status}</StatusBadge></td>
                  <td className="px-4 py-3.5 text-[#77798D]">{new Date(`${user.joined}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" })}</td>
                  <td className="px-6 py-3.5 text-right"><Link href="/admin/users" aria-label={`View ${user.name}`} className="inline-flex rounded-lg p-2 text-[#9293A5] hover:bg-[#F1F0FA] hover:text-[#5147A5]"><MoreHorizontal size={17} /></Link></td>
                </tr>
              ))}
              {visibleUsers.length === 0 && <tr><td colSpan="5" className="px-6 py-10 text-center text-xs text-[#9293A5]">No sample users match that search.</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
