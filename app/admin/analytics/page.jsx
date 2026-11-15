"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowUpRight, CalendarDays, Clock3, UserRound, Users } from "lucide-react";
import { DemoNotice, MetricCard, PageHeading, Panel } from "../../../components/admin/admin-ui";
import { registrationData } from "../../../components/admin/demo-data";

const activeData = {
  Daily: [
    { month: "Mon", value: 32 }, { month: "Tue", value: 48 }, { month: "Wed", value: 41 },
    { month: "Thu", value: 68 }, { month: "Fri", value: 59 }, { month: "Sat", value: 78 }, { month: "Sun", value: 71 },
  ],
  Weekly: [
    { month: "W1", value: 41 }, { month: "W2", value: 58 }, { month: "W3", value: 49 },
    { month: "W4", value: 76 }, { month: "W5", value: 69 }, { month: "W6", value: 87 },
  ],
  Monthly: registrationData,
};

const distribution = [
  { label: "Active", value: 68, color: "bg-[#6D9E7D]" },
  { label: "Pending", value: 21, color: "bg-[#D3B35F]" },
  { label: "Suspended", value: 11, color: "bg-[#C77979]" },
];

export default function AdminAnalyticsPage() {
  const [granularity, setGranularity] = useState("Monthly");
  const [range, setRange] = useState("Last 12 months");
  const chartData = useMemo(() => {
    const data = activeData[granularity];
    if (range === "Last 30 days" && granularity === "Monthly") return data.slice(-1);
    if (range === "Last 90 days" && granularity === "Monthly") return data.slice(-3);
    if (range === "Last 30 days" && granularity === "Weekly") return data.slice(-4);
    if (range === "Last 90 days" && granularity === "Weekly") return data.slice(-6);
    if (range === "Last 30 days" && granularity === "Daily") return data.slice(-7);
    return data;
  }, [granularity, range]);

  return (
    <>
      <DemoNotice />
      <PageHeading title="Analytics" description="Explore illustrative platform activity and user growth." meta="Reports" />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Registered users" value="2,840" change="Illustrative total" icon={Users} />
        <MetricCard label="Active users" value="1,926" change="68% of sample accounts" icon={Activity} tone="green" />
        <MetricCard label="New registrations" value="184" change="Sample period total" icon={UserRound} />
        <MetricCard label="Growth rate" value="+12.8%" change="Compared with prior period" icon={ArrowUpRight} tone="gold" />
      </div>

      <Panel
        title="User activity over time"
        description="Sample registrations and active-user activity"
        action={
          <div className="flex flex-wrap gap-2">
            <label>
              <span className="sr-only">Select report date range</span>
              <select value={range} onChange={(event) => setRange(event.target.value)} className="rounded-lg border border-[#EAEBF2] bg-white px-2.5 py-2 text-xs text-[#57586C] outline-none focus:border-[#7770C3]">
                <option>Last 30 days</option><option>Last 90 days</option><option>Last 12 months</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Select chart interval</span>
              <select value={granularity} onChange={(event) => setGranularity(event.target.value)} className="rounded-lg border border-[#EAEBF2] bg-white px-2.5 py-2 text-xs text-[#57586C] outline-none focus:border-[#7770C3]">
                <option>Daily</option><option>Weekly</option><option>Monthly</option>
              </select>
            </label>
          </div>
        }
        className="overflow-hidden"
      >
        <div className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[#77798D]">
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-sm bg-[#7770C3]" /> New registrations</span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-sm bg-[#C7C3E8]" /> Active users index</span>
            <span className="ml-auto inline-flex items-center gap-1 text-[#438861]"><ArrowUpRight size={14} /> 12.8% period growth</span>
          </div>
          <div className="relative flex h-64 items-end gap-2 border-b border-[#EAEBF2] px-1 sm:gap-4">
            {[25, 50, 75, 100].map((line) => <div key={line} className="pointer-events-none absolute inset-x-0 border-t border-dashed border-[#F0F0F5]" style={{ bottom: `${line}%` }} />)}
            {chartData.map((item, index) => (
              <div key={`${item.month}-${index}`} className="group relative z-[1] flex h-full min-w-0 flex-1 items-end justify-center gap-1">
                <div title={`${item.month}: ${item.value} registration index`} style={{ height: `${item.value}%` }} className="w-full max-w-8 cursor-default rounded-t-sm bg-[#7770C3] transition-colors group-hover:bg-[#5147A5]" />
                <div title={`${item.month}: ${Math.max(12, item.value - 16)} active-user index`} style={{ height: `${Math.max(12, item.value - 16)}%` }} className="w-full max-w-8 cursor-default rounded-t-sm bg-[#C7C3E8] transition-colors group-hover:bg-[#9D98D2]" />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-[#A0A1B1]">{chartData.map((item, index) => <span key={`${item.month}-${index}`}>{item.month}</span>)}</div>
          <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-[#A0A1B1]"><CalendarDays size={13} /> {granularity} view · {range.toLowerCase()} · sample data</p>
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Account status" description="Illustrative share of sample accounts">
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex h-3 overflow-hidden rounded-full bg-[#F0F0F5]" aria-label="Account status distribution">
              {distribution.map((item) => <span key={item.label} title={`${item.label}: ${item.value}%`} className={item.color} style={{ width: `${item.value}%` }} />)}
            </div>
            {distribution.map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-xs">
                <span className={`h-2.5 w-2.5 rounded-sm ${item.color}`} />
                <span className="flex-1 text-[#57586C]">{item.label}</span>
                <span className="font-medium text-[#303146]">{item.value}%</span>
                <span className="w-12 text-right text-[#9293A5]">{Math.round(2840 * item.value / 100).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Users by role" description="Illustrative role distribution">
          <div className="space-y-5 p-5 sm:p-6">
            {[{ label: "Users", value: 82, color: "bg-[#7770C3]" }, { label: "Administrators", value: 18, color: "bg-[#D9C58B]" }].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-xs"><span className="text-[#57586C]">{item.label}</span><span className="font-medium text-[#303146]">{item.value}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-[#F0F0F5]"><div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} /></div>
              </div>
            ))}
            <p className="inline-flex items-center gap-1.5 pt-1 text-[11px] text-[#A0A1B1]"><Clock3 size={13} /> Updated just now in this preview</p>
          </div>
        </Panel>
      </div>
    </>
  );
}
