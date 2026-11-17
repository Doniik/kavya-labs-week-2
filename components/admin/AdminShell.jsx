"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  ChartNoAxesCombined,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import SignOutButton from "@/components/SignOutButton";

const navigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: ChartNoAxesCombined },
  { label: "Activity logs", href: "/admin/activity", icon: ClipboardList },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminShell({ children, admin }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const currentPage = navigation.find((item) => item.href === pathname)?.label ?? "Administration";

  const sidebar = (
    <>
      <div className="flex h-[76px] items-center gap-3 border-b border-[#F0F0F5] px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#29265B] font-heading text-lg font-bold text-white">K</div>
        <div>
          <p className="font-heading text-[15px] font-bold tracking-tight text-[#20213A]">Kavya Labs</p>
          <p className="text-[11px] text-[#9293A5]">Administration</p>
        </div>
      </div>
      <div className="px-4 pt-7">
        <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A0A1B1]">Workspace</p>
        <nav aria-label="Administration" className="space-y-1">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                  active ? "bg-[#F0EFFB] text-[#5147A5]" : "text-[#77798D] hover:bg-[#F7F7FB] hover:text-[#29265B]"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-2xl bg-[#29265B] p-4 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold"><Activity size={14} className="text-[#D9C58B]" /> Secure workspace</div>
          <p className="mt-2 text-[11px] leading-5 text-white/65">Admin access is checked server-side. Access to this area is limited to verified administrators.</p>
        </div>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#17182B]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[250px] flex-col border-r border-[#EAEBF2] bg-white lg:flex">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-[#17182B]/35" />
          <aside className="relative flex h-full w-[min(290px,85vw)] flex-col bg-white shadow-xl">
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="absolute right-3 top-5 rounded-lg p-2 text-[#77798D] hover:bg-[#F7F7FB]"><X size={19} /></button>
            {sidebar}
          </aside>
        </div>
      )}

      <main className="min-h-screen lg:ml-[250px]">
        <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-[#EAEBF2] bg-white/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="rounded-lg p-2 text-[#77798D] hover:bg-[#F7F7FB] lg:hidden">
              <Menu size={20} />
            </button>
            <div>
              <p className="text-[11px] text-[#9293A5]">Workspace <span className="px-1 text-[#D0D1DA]">/</span> Admin</p>
              <h2 className="mt-0.5 text-sm font-semibold text-[#25263B]">{currentPage}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden rounded-full border border-[#E7E4F6] bg-[#F7F6FD] px-2.5 py-1 text-[10px] font-semibold text-[#625C91] sm:inline-flex">ACCESS CONTROL</span>
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
                className="relative rounded-xl border border-[#EAEBF2] p-2.5 text-[#77798D] transition hover:bg-[#FAFAFC]"
              >
                <Bell size={17} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#D5A94B]" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-30 w-[min(300px,calc(100vw-2rem))] rounded-2xl border border-[#EAEBF2] bg-white p-4 shadow-xl">
                  <p className="text-sm font-semibold">Notifications</p>
                  <p className="mt-2 text-xs leading-5 text-[#85869A]">No open follow-ups. System health and user changes are within normal range.</p>
                  <p className="mt-3 border-t border-[#F0F0F5] pt-3 text-[11px] text-[#9293A5]">Last checked just now</p>
                </div>
              )}
            </div>
            <div className="relative border-l border-[#EAEBF2] pl-2 sm:pl-4">
              <button
                type="button"
                aria-expanded={profileOpen}
                onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
                className="flex items-center gap-2.5 rounded-xl p-1.5 text-left hover:bg-[#FAFAFC]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAE8FA] text-xs font-bold text-[#5147A5]">{(admin?.name || "A").slice(0, 2).toUpperCase()}</span>
                <span className="hidden sm:block">
                  <span className="block text-xs font-semibold text-[#25263B]">{admin?.name || "Administrator"}</span>
                  <span className="block text-[10px] text-[#9293A5]">{admin?.email || "admin"}</span>
                </span>
                <ChevronDown size={14} className="hidden text-[#9293A5] sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 z-30 w-52 rounded-xl border border-[#EAEBF2] bg-white p-1.5 shadow-xl">
                  <Link onClick={() => setProfileOpen(false)} href="/admin/settings" className="block rounded-lg px-3 py-2 text-xs text-[#57586C] hover:bg-[#F7F7FB]">Account settings</Link>
                  <div className="border-t border-[#F0F0F5] px-3 py-2">
                    <SignOutButton />
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-[1480px] p-4 sm:p-7 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
