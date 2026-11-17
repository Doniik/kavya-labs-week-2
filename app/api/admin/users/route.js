import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUsersData, requireAdminSession } from "@/lib/lib/admin";

function toUserRecord(user) {
  return {
    id: user.id,
    name: user.name || user.email?.split("@")[0] || "New user",
    email: user.email,
    role: user.role === "ADMIN" ? "Admin" : "User",
    status: user.status === "SUSPENDED" ? "Suspended" : "Active",
    joined: user.createdAt ? user.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    lastLogin: user.lastLoginAt ? user.lastLoginAt.toISOString().slice(0, 10) : "—",
  };
}

export async function GET(req) {
  try {
    await requireAdminSession();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.trim().toLowerCase() || "";
  const role = searchParams.get("role");
  const status = searchParams.get("status");

  try {
    const data = await getUsersData();

    if (data.source === "demo") {
      const filtered = data.users.filter((user) => {
        const matchesSearch = !search || `${user.name} ${user.email}`.toLowerCase().includes(search);
        const matchesRole = !role || role === "All roles" || user.role === role;
        const matchesStatus = !status || status === "All statuses" || user.status === status;
        return matchesSearch && matchesRole && matchesStatus;
      });

      return NextResponse.json({ source: "demo", users: filtered });
    }

    const users = await prisma.user.findMany({
      where: {
        ...(search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } : {}),
        ...(role && role !== "All roles" ? { role: role === "Admin" ? "ADMIN" : "USER" } : {}),
        ...(status && status !== "All statuses" ? { status: status === "Suspended" ? "SUSPENDED" : "ACTIVE" } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true },
    });

    return NextResponse.json({ source: "database", users: users.map(toUserRecord) });
  } catch (error) {
    return NextResponse.json({ error: "Unable to load users" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await requireAdminSession();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();

    if (!email || !name) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        role: "USER",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ user: toUserRecord(user) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create user" }, { status: 500 });
  }
}
