"use client";

import { useState } from "react";
import { Bell, Check, Globe2, LockKeyhole, Monitor, ShieldCheck, UserRound } from "lucide-react";
import { DemoNotice, PageHeading, Panel, inputClass, primaryButtonClass } from "../../../components/admin/admin-ui";

function Preference({ title, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3.5">
      <span><span className="block text-xs font-medium text-[#303146]">{title}</span><span className="mt-1 block text-[11px] leading-5 text-[#9293A5]">{description}</span></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span aria-hidden="true" className={`relative h-5 w-9 shrink-0 rounded-full transition ${checked ? "bg-[#5147A5]" : "bg-[#D9DAE3]"} after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition ${checked ? "after:translate-x-4" : ""}`} />
    </label>
  );
}

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("Kavya Labs");
  const [timezone, setTimezone] = useState("Asia/Tashkent");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const updatePreference = (setter) => (value) => {
    setter(value);
    setSaved(false);
  };

  const saveSettings = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <>
      <DemoNotice />
      <PageHeading title="Settings" description="Manage local preview preferences and workspace details." meta="Administration" />
      <form onSubmit={saveSettings}>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <div className="space-y-5">
            <Panel title="Administrator profile" description="Preview account details" >
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAE8FA] text-sm font-bold text-[#5147A5]">AD</span>
                  <div><p className="text-sm font-semibold text-[#303146]">Administrator</p><p className="mt-1 text-xs text-[#9293A5]">Admin account · Preview</p></div>
                </div>
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <div><p className="text-[10px] uppercase tracking-wide text-[#A0A1B1]">Email address</p><p className="mt-1 text-xs font-medium text-[#57586C]">admin@example.test</p></div>
                  <div><p className="text-[10px] uppercase tracking-wide text-[#A0A1B1]">Role</p><p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#57586C]"><ShieldCheck size={14} className="text-[#5147A5]" /> Administrator</p></div>
                </div>
              </div>
            </Panel>

            <Panel title="Account preferences" description="Choose how this preview workspace behaves.">
              <div className="divide-y divide-[#F3F3F7] px-5 sm:px-6">
                <Preference title="Email notifications" description="Receive updates about important workspace events." checked={emailNotifications} onChange={updatePreference(setEmailNotifications)} />
                <Preference title="Security alerts" description="Show a notification when account security events occur." checked={securityAlerts} onChange={updatePreference(setSecurityAlerts)} />
                <Preference title="Weekly summary" description="Include a weekly activity digest in notifications." checked={weeklySummary} onChange={updatePreference(setWeeklySummary)} />
                <Preference title="Compact display" description="Use a denser layout for tables and lists." checked={compactMode} onChange={updatePreference(setCompactMode)} />
                <label className="block py-4">
                  <span className="block text-xs font-medium text-[#303146]">Timezone</span>
                  <span className="mt-1 block text-[11px] text-[#9293A5]">Used for dates and activity timestamps.</span>
                  <select value={timezone} onChange={(event) => { setTimezone(event.target.value); setSaved(false); }} className={`${inputClass} mt-2 max-w-sm`}>
                    <option value="Asia/Tashkent">Asia/Tashkent (UTC+05:00)</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="UTC">UTC</option>
                  </select>
                </label>
              </div>
            </Panel>

            <Panel title="Platform settings" description="Branding preferences for this administration preview.">
              <div className="p-5 sm:p-6">
                <label className="block max-w-sm text-xs font-medium text-[#57586C]">Platform name<input value={platformName} onChange={(event) => { setPlatformName(event.target.value); setSaved(false); }} className={`${inputClass} mt-1.5`} /></label>
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#F0F0F5] bg-[#FAFAFC] p-3.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#29265B] font-heading font-bold text-white">K</span>
                  <span><span className="block text-xs font-semibold text-[#303146]">{platformName || "Platform name"}</span><span className="mt-0.5 block text-[10px] text-[#9293A5]">Brand preview</span></span>
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Security" description="Read-only account information">
              <div className="divide-y divide-[#F3F3F7] px-5 sm:px-6">
                <div className="flex gap-3 py-4">
                  <span className="mt-0.5 rounded-lg bg-[#F1F0FA] p-2 text-[#5147A5]"><LockKeyhole size={15} /></span>
                  <div><p className="text-xs font-medium text-[#303146]">Secure session</p><p className="mt-1 text-[11px] leading-5 text-[#9293A5]">Session controls will be connected when authentication integration is enabled.</p></div>
                </div>
                <div className="flex gap-3 py-4">
                  <span className="mt-0.5 rounded-lg bg-[#F1F0FA] p-2 text-[#5147A5]"><UserRound size={15} /></span>
                  <div><p className="text-xs font-medium text-[#303146]">Administrative access</p><p className="mt-1 text-[11px] leading-5 text-[#9293A5]">Permissions are not changed from this visual preview.</p></div>
                </div>
              </div>
            </Panel>

            <Panel title="Workspace details" description="Configuration overview">
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center gap-3"><span className="rounded-lg bg-[#F1F0FA] p-2 text-[#5147A5]"><Globe2 size={15} /></span><span><span className="block text-xs font-medium text-[#303146]">Workspace</span><span className="mt-0.5 block text-[11px] text-[#9293A5]">{platformName || "Platform name"}</span></span></div>
                <div className="flex items-center gap-3"><span className="rounded-lg bg-[#F1F0FA] p-2 text-[#5147A5]"><Monitor size={15} /></span><span><span className="block text-xs font-medium text-[#303146]">Display</span><span className="mt-0.5 block text-[11px] text-[#9293A5]">{compactMode ? "Compact" : "Comfortable"} layout</span></span></div>
                <div className="flex items-center gap-3"><span className="rounded-lg bg-[#F1F0FA] p-2 text-[#5147A5]"><Bell size={15} /></span><span><span className="block text-xs font-medium text-[#303146]">Notifications</span><span className="mt-0.5 block text-[11px] text-[#9293A5]">{emailNotifications ? "Email enabled" : "Email paused"}</span></span></div>
              </div>
            </Panel>
          </div>
        </div>

        <div className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EAEBF2] bg-white/95 p-3 shadow-lg shadow-[#17182B]/5 backdrop-blur">
          <p aria-live="polite" className="pl-2 text-xs text-[#77798D]">{saved ? <span className="inline-flex items-center gap-1.5 text-[#438861]"><Check size={14} /> Preferences saved in this preview.</span> : "Changes are local to this preview."}</p>
          <button type="submit" className={primaryButtonClass}>Save preferences</button>
        </div>
      </form>
    </>
  );
}
