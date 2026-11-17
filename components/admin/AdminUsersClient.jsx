"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Plus, Search, ShieldCheck, UserRound, Users, UserX } from "lucide-react";
import { DemoNotice, MetricCard, Modal, PageHeading, Panel, StatusBadge, inputClass, primaryButtonClass, secondaryButtonClass } from "@/components/admin/admin-ui";

function formatDate(dateString) {
  if (!dateString || dateString === "—") return "—";
  const date = dateString.includes("T") ? new Date(dateString) : new Date(`${dateString}T12:00:00`);
  return Number.isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminUsersClient({ initialUsers, source: initialSource = "demo" }) {
  const [users, setUsers] = useState(initialUsers || []);
  const [source, setSource] = useState(initialSource);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sortOrder, setSortOrder] = useState("newest");
  const [menuId, setMenuId] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (roleFilter !== "All roles") params.set("role", roleFilter);
        if (statusFilter !== "All statuses") params.set("status", statusFilter);

        const response = await fetch(`/api/admin/users?${params.toString()}`, { cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        if (isMounted && payload?.users) {
          setUsers(payload.users);
          setSource(payload.source || "demo");
        }
      } catch (error) {
        // preserve the initial view if the backend is unavailable
      }
    }

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [search, roleFilter, statusFilter]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return [...users]
      .filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query))
      .filter((user) => roleFilter === "All roles" || user.role === roleFilter)
      .filter((user) => statusFilter === "All statuses" || user.status === statusFilter)
      .sort((a, b) => (sortOrder === "newest" ? b.joined.localeCompare(a.joined) : a.joined.localeCompare(b.joined)));
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

  const confirmAction = async () => {
    if (!dialog?.user) return;

    const nextRole = dialog.action === "role" ? (dialog.user.role === "Admin" ? "User" : "Admin") : undefined;
    const nextStatus = dialog.action === "status" ? (dialog.user.status === "Active" ? "Suspended" : "Active") : undefined;

    try {
      const response = await fetch(`/api/admin/users/${dialog.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(nextRole ? { role: nextRole } : {}),
          ...(nextStatus ? { status: nextStatus } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error("Admin update failed");
      }

      const payload = await response.json();
      const updatedUser = payload.user;

      setUsers((current) =>
        current.map((user) => (user.id === dialog.user.id ? updatedUser : user)),
      );
    } catch (error) {
      // keep the current state unchanged if the backend rejects the update
    }

    setDialog(null);
  };

  const addUser = async (event) => {
    event.preventDefault();
    const trimmedName = newName.trim();
    const trimmedEmail = newEmail.trim();

    if (!trimmedName || !trimmedEmail) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      });

      if (!response.ok) {
        throw new Error("Create user failed");
      }

      const payload = await response.json();
      setUsers((current) => [payload.user, ...current]);
      setNewName("");
      setNewEmail("");
    } catch (error) {
      // keep the modal open if the user could not be created
    }

    setDialog(null);
  };

  return (
    <>
      <DemoNotice />
      <PageHeading
        title="User management"
        description={source === "demo" ? "Demo list showing the admin controls and table interactions." : "Review accounts, roles and account status across your platform."}
        meta={`${users.length} ${source === "demo" ? "demo accounts" : "registered accounts"}`}
        action={<button type="button" onClick={() => setDialog({ action: "add" })} className={primaryButtonClass}><Plus size={16} /> Add user</button>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total users" value={users.length.toLocaleString()} icon={Users} />
        <MetricCard label="Active users" value={activeCount.toLocaleString()} icon={Check} tone="green" />
        <MetricCard label="Suspended" value={suspendedCount.toLocaleString()} icon={UserX} tone="gold" />
        <MetricCard label="Administrators" value={adminCount.toLocaleString()} icon={ShieldCheck} />
      </div>

      <Panel title="All users" description={source === "demo" ? "Preview data for admin workflows" : "Search, filter or update user records."} className="overflow-hidden">
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
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0EFFB] text-[10px] font-semibold text-[#5147A5]">
                        {user.name.split(" ").map((part) => part[0]).join("")}
                      </span>
                      <span className="min-w-0"><span className="block truncate font-medium text-[#303146]">{user.name}</span><span className="mt-0.5 block truncate text-[11px] text-[#9293A5]">{user.email}</span></span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge>{user.role}</StatusBadge></td>
                  <td className="px-4 py-3.5"><StatusBadge>{user.status}</StatusBadge></td>
                  <td className="px-4 py-3.5 text-[#77798D]">{formatDate(user.joined)}</td>
                  <td className="px-4 py-3.5 text-[#77798D]">{user.lastLogin === "—" ? "—" : formatDate(user.lastLogin)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="relative inline-block">
                      <button type="button" aria-label={`Open actions for ${user.name}`} onClick={() => setMenuId((current) => current === user.id ? null : user.id)} className="rounded-lg p-2 text-[#9293A5] hover:bg-[#F1F0FA] hover:text-[#5147A5]">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>
                      </button>
                      {menuId === user.id && (
                        <div className="absolute right-0 top-10 z-20 w-40 rounded-xl border border-[#EAEBF2] bg-white p-1.5 shadow-lg">
                          <button type="button" onClick={() => { setDialog({ action: "role", user }); setMenuId(null); }} className="block w-full rounded-lg px-2.5 py-2 text-left text-xs text-[#57586C] hover:bg-[#F7F7FB]">Toggle role</button>
                          <button type="button" onClick={() => { setDialog({ action: "status", user }); setMenuId(null); }} className="block w-full rounded-lg px-2.5 py-2 text-left text-xs text-[#57586C] hover:bg-[#F7F7FB]">Toggle status</button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-xs text-[#9293A5]">No users match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {dialog && (
        <Modal
          title={dialog.action === "add" ? "Create a user" : dialog.action === "role" ? `Change ${dialog.user.name}'s role` : `Update ${dialog.user.name}'s status`}
          description={dialog.action === "add" ? "Add a new account to the workspace." : dialog.action === "role" ? "This action updates administrative permissions." : "This action updates whether the account can sign in."}
          onClose={() => setDialog(null)}
        >
          {dialog.action === "add" ? (
            <form onSubmit={addUser} className="space-y-4">
              <label className="block text-xs font-medium text-[#57586C]">Full name<input value={newName} onChange={(event) => setNewName(event.target.value)} className={`${inputClass} mt-1.5`} placeholder="Jane Doe" /></label>
              <label className="block text-xs font-medium text-[#57586C]">Email address<input type="email" value={newEmail} onChange={(event) => setNewEmail(event.target.value)} className={`${inputClass} mt-1.5`} placeholder="jane@example.com" /></label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>Cancel</button>
                <button type="submit" className={primaryButtonClass}>Add user</button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="rounded-xl bg-[#F7F6FD] p-3 text-xs text-[#625C91]">
                {dialog.action === "role"
                  ? `${dialog.user.name} is currently ${dialog.user.role}. Switching this account changes its admin access.`
                  : `${dialog.user.name} is currently ${dialog.user.status}. This will change whether their account can sign in.`}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setDialog(null)} className={secondaryButtonClass}>Cancel</button>
                <button type="button" onClick={confirmAction} className={primaryButtonClass}>Confirm</button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
