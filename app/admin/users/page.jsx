"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  UserX,
} from "lucide-react";
import { DemoNotice, MetricCard, Modal, PageHeading, Panel, StatusBadge, inputClass, primaryButtonClass, secondaryButtonClass } from "../../../components/admin/admin-ui";
import { demoUsers } from "../../../components/admin/demo-data";

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState(demoUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sortOrder, setSortOrder] = useState("newest");
  const [menuId, setMenuId] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users
      .filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query))
      .filter((user) => roleFilter === "All roles" || user.role === roleFilter)
      .filter((user) => statusFilter === "All statuses" || user.status === statusFilter)
      .sort((a, b) => sortOrder === "newest" ? b.joined.localeCompare(a.joined) : a.joined.localeCompare(b.joined));
  }, [users, search, roleFilter, statusFilter, sortOrder]);

  const activeCount = users.filter((user) => user.status === "Active").length;
  const suspendedCount = users.filter((user) => user.status === "Suspended").length;
  const adminCount = users.filter((user) => user.role === "Admin").length;
  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All roles");
    setStatusFilter("All statuses");
    setSortOrder("newest");
  };

  const confirmAction = () => {
    if (!dialog?.user) return;
    setUsers((current) => current.map((user) => {
      if (user.id !== dialog.user.id) return user;
      if (dialog.action === "role") return { ...user, role: user.role === "Admin" ? "User" : "Admin" };
      return { ...user, status: user.status === "Active" ? "Suspended" : "Active" };
    }));
    setDialog(null);
  };

  const addUser = (event) => {
    event.preventDefault();
    const user = {
      id: `u-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: "User",
      status: "Active",
      joined: new Date().toISOString().slice(0, 10),
      lastLogin: "—",
    };
    setUsers((current) => [user, ...current]);
    setNewName("");
    setNewEmail("");
    setDialog(null);
  };

  return (
    <>
      <DemoNotice />
      <PageHeading
        title="User management"
        description="Review sample accounts, roles and account status."
        meta={`${users.length} sample accounts`}
        action={<button type="button" onClick={() => setDialog({ action: "add" })} className={primaryButtonClass}><Plus size={16} /> Add user</button>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total users" value={users.length.toLocaleString()} icon={Users} />
        <MetricCard label="Active users" value={activeCount.toLocaleString()} icon={Check} tone="green" />
        <MetricCard label="Suspended" value={suspendedCount.toLocaleString()} icon={UserX} tone="gold" />
        <MetricCard label="Administrators" value={adminCount.toLocaleString()} icon={ShieldCheck} />
      </div>

      <Panel title="All users" description="Search, filter or update local preview records." className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[#F0F0F5] p-4 sm:flex-row sm:items-center sm:px-5">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search users by name or email</span>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A1B1]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email..." className={`${inputClass} pl-9`} />
          </label>
          <div className="grid grid-cols-2 gap-2 sm:flex">
            <label className="relative">
              <span className="sr-only">Filter by role</span>
              <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-[#E5E6EE] bg-white py-2.5 pl-3 pr-8 text-xs text-[#57586C] outline-none focus:border-[#7770C3] sm:w-32">
                <option>All roles</option><option>User</option><option>Admin</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-3 text-[#9293A5]" />
            </label>
            <label className="relative">
              <span className="sr-only">Filter by status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full appearance-none rounded-xl border border-[#E5E6EE] bg-white py-2.5 pl-3 pr-8 text-xs text-[#57586C] outline-none focus:border-[#7770C3] sm:w-36">
                <option>All statuses</option><option>Active</option><option>Suspended</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-3 text-[#9293A5]" />
            </label>
            <label className="relative col-span-2 sm:col-span-1">
              <span className="sr-only">Sort by registration date</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="w-full appearance-none rounded-xl border border-[#E5E6EE] bg-white py-2.5 pl-3 pr-8 text-xs text-[#57586C] outline-none focus:border-[#7770C3] sm:w-36">
                <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-3 text-[#9293A5]" />
            </label>
            <button type="button" onClick={clearFilters} className={`${secondaryButtonClass} col-span-2 px-3 text-xs sm:col-span-1`}>Clear filters</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead className="bg-[#FAFAFC] text-[10px] uppercase tracking-[0.08em] text-[#9293A5]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">User</th>
                <th className="px-4 py-3.5 font-semibold">Role</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold">Date joined</th>
                <th className="px-4 py-3.5 font-semibold">Last login</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-[#F3F3F7] hover:bg-[#FCFCFE]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0EFFB] text-[10px] font-semibold text-[#5147A5]">{user.name.split(" ").map((part) => part[0]).join("")}</span>
                      <span className="min-w-0"><span className="block truncate font-medium text-[#303146]">{user.name}</span><span className="mt-0.5 block truncate text-[11px] text-[#9293A5]">{user.email}</span></span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge>{user.role}</StatusBadge></td>
                  <td className="px-4 py-3.5"><StatusBadge>{user.status}</StatusBadge></td>
                  <td className="px-4 py-3.5 text-[#77798D]">{formatDate(user.joined)}</td>
                  <td className="px-4 py-3.5 text-[#77798D]">{user.lastLogin === "—" ? "—" : formatDate(user.lastLogin)}</td>
                  <td className="relative px-5 py-3.5 text-right">
                    <button type="button" onClick={() => setMenuId(menuId === user.id ? null : user.id)} aria-label={`Actions for ${user.name}`} aria-expanded={menuId === user.id} className="rounded-lg p-2 text-[#9293A5] hover:bg-[#F1F0FA] hover:text-[#5147A5]"><MoreHorizontal size={17} /></button>
                    {menuId === user.id && (
                      <div className="absolute right-8 top-10 z-20 w-44 rounded-xl border border-[#EAEBF2] bg-white p-1.5 text-left shadow-xl">
                        <button type="button" onClick={() => { setDialog({ action: "profile", user }); setMenuId(null); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#57586C] hover:bg-[#F7F7FB]"><UserRound size={14} /> View profile</button>
                        <button type="button" onClick={() => { setDialog({ action: "role", user }); setMenuId(null); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#57586C] hover:bg-[#F7F7FB]"><ShieldCheck size={14} /> Change role</button>
                        <button type="button" onClick={() => { setDialog({ action: "status", user }); setMenuId(null); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-[#57586C] hover:bg-[#F7F7FB]"><UserX size={14} /> {user.status === "Active" ? "Suspend account" : "Reactivate account"}</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && <tr><td colSpan="6" className="px-5 py-12 text-center text-sm text-[#9293A5]">No sample users match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#F0F0F5] px-5 py-3 text-[11px] text-[#9293A5]">
          <span>Showing {filteredUsers.length} of {users.length} sample accounts</span>
          <span>Preview only</span>
        </div>
      </Panel>

      {dialog?.action === "add" && (
        <Modal title="Add sample user" description="Add a local preview record. This won’t create a platform account." onClose={() => setDialog(null)}>
          <form onSubmit={addUser} className="space-y-4">
            <label className="block text-xs font-medium text-[#57586C]">Full name<input required value={newName} onChange={(event) => setNewName(event.target.value)} className={`${inputClass} mt-1.5`} placeholder="e.g. Taylor Rivera" /></label>
            <label className="block text-xs font-medium text-[#57586C]">Email address<input required type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} className={`${inputClass} mt-1.5`} placeholder="name@example.test" /></label>
            <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>Cancel</button><button type="submit" className={primaryButtonClass}>Add to preview</button></div>
          </form>
        </Modal>
      )}

      {dialog?.action === "profile" && (
        <Modal title={dialog.user.name} description="Sample account profile" onClose={() => setDialog(null)}>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F0EFFB] font-semibold text-[#5147A5]">{dialog.user.name.split(" ").map((part) => part[0]).join("")}</span><div><p className="font-medium text-[#303146]">{dialog.user.email}</p><p className="mt-1 text-xs text-[#9293A5]">Account details are illustrative.</p></div></div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#FAFAFC] p-4 text-xs"><div><p className="text-[#9293A5]">Role</p><div className="mt-1"><StatusBadge>{dialog.user.role}</StatusBadge></div></div><div><p className="text-[#9293A5]">Status</p><div className="mt-1"><StatusBadge>{dialog.user.status}</StatusBadge></div></div><div><p className="text-[#9293A5]">Date joined</p><p className="mt-1 font-medium text-[#57586C]">{formatDate(dialog.user.joined)}</p></div><div><p className="text-[#9293A5]">Last login</p><p className="mt-1 font-medium text-[#57586C]">{dialog.user.lastLogin === "—" ? "—" : formatDate(dialog.user.lastLogin)}</p></div></div>
            <div className="flex justify-end"><button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>Close</button></div>
          </div>
        </Modal>
      )}

      {(dialog?.action === "role" || dialog?.action === "status") && (
        <Modal
          title={dialog.action === "role" ? "Confirm role change" : `${dialog.user.status === "Active" ? "Suspend" : "Reactivate"} account`}
          description="This change applies only to the local preview data."
          onClose={() => setDialog(null)}
        >
          <p className="text-sm leading-6 text-[#57586C]">
            {dialog.action === "role"
              ? `Change ${dialog.user.name}’s role from ${dialog.user.role} to ${dialog.user.role === "Admin" ? "User" : "Admin"}?`
              : `${dialog.user.status === "Active" ? "Suspend" : "Reactivate"} ${dialog.user.name}’s sample account?`}
          </p>
          <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>Cancel</button><button type="button" onClick={confirmAction} className={primaryButtonClass}>{dialog.action === "role" ? "Confirm role change" : "Confirm update"}</button></div>
        </Modal>
      )}
    </>
  );
}
