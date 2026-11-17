import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/lib/admin";

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

export async function GET(_req, { params }) {
  try {
    await requireAdminSession();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: toUserRecord(user) });
  } catch (error) {
    return NextResponse.json({ error: "Unable to fetch user" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await requireAdminSession();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = {};

    if (body.role) {
      data.role = body.role === "Admin" ? "ADMIN" : "USER";
    }

    if (body.status) {
      data.status = body.status === "Suspended" ? "SUSPENDED" : "ACTIVE";
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid update provided" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data,
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true },
    });

    return NextResponse.json({ user: toUserRecord(updated) });
  } catch (error) {
    return NextResponse.json({ error: "Unable to update user" }, { status: 500 });
  }
}
