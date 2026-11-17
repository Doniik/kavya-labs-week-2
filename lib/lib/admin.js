import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { demoActivity, demoUsers, registrationData } from "@/components/admin/demo-data";

const hasDatabaseConfig = Boolean(process.env.DATABASE_URL && process.env.DIRECT_URL);

function mapUserRecord(user) {
  const role = user.role === "ADMIN" ? "Admin" : "User";
  const status = user.status === "SUSPENDED" ? "Suspended" : "Active";

  return {
    id: user.id,
    name: user.name || user.email?.split("@")[0] || "New user",
    email: user.email,
    role,
    status,
    joined: user.createdAt ? user.createdAt.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    lastLogin: user.lastLoginAt ? user.lastLoginAt.toISOString().slice(0, 10) : "—",
  };
}

function mapActivityRecord(event) {
  return {
    id: event.id,
    type: event.type,
    title: event.type === "LOGIN" ? "User signed in" : event.type === "ROLE_UPDATE" ? "Role updated" : event.type === "REGISTRATION" ? "New user registered" : "Account activity",
    person: event.user?.name || event.user?.email || "System",
    description: event.metadata?.message || "Recorded activity",
    date: event.createdAt ? event.createdAt.toISOString() : new Date().toISOString(),
    category: event.type === "LOGIN" ? "Security" : event.type === "ROLE_UPDATE" ? "Permissions" : "Users",
  };
}

export async function getAdminSessionUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const normalizedEmail = session.user.email.toLowerCase();

  if (!hasDatabaseConfig) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    if (user?.role !== "ADMIN" || user.status !== "ACTIVE") {
      return null;
    }

    return {
      id: user.id,
      name: user.name || session.user.name || "Administrator",
      email: user.email,
      role: user.role,
      status: user.status,
    };
  } catch (error) {
    return null;
  }
}

export async function requireAdmin() {
  const sessionUser = await getAdminSessionUser();

  if (!sessionUser) {
    redirect("/dashboard");
  }

  return sessionUser;
}

export async function requireAdminSession() {
  const sessionUser = await getAdminSessionUser();

  if (!sessionUser) {
    throw new Error("Unauthorized");
  }

  return sessionUser;
}

export async function getDashboardData() {
  const fallback = {
    source: "demo",
    totals: {
      totalUsers: demoUsers.length,
      activeUsers: demoUsers.filter((user) => user.status === "Active").length,
      inactiveUsers: demoUsers.filter((user) => user.status === "Suspended").length,
      newUsers: demoUsers.filter((user) => user.joined >= "2026-11-12").length,
    },
    trend: registrationData,
    recentUsers: demoUsers.slice(0, 5),
    recentActivity: demoActivity.slice(0, 4),
  };

  if (!hasDatabaseConfig) {
    return fallback;
  }

  try {
    const [userCount, activeUsers, blockedUsers, recentUsers, recentActivity] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "SUSPENDED" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true },
      }),
      prisma.activityEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    return {
      source: "database",
      totals: {
        totalUsers: userCount,
        activeUsers,
        inactiveUsers: blockedUsers,
        newUsers: recentUsers.filter((user) => user.createdAt && new Date(user.createdAt).getTime() > Date.now() - 1000 * 60 * 60 * 24 * 30).length,
      },
      trend: registrationData,
      recentUsers: recentUsers.map(mapUserRecord),
      recentActivity: recentActivity.map(mapActivityRecord),
    };
  } catch (error) {
    return fallback;
  }
}

export async function getUsersData() {
  const fallback = { source: "demo", users: demoUsers };

  if (!hasDatabaseConfig) {
    return fallback;
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true },
    });

    return {
      source: "database",
      users: users.map(mapUserRecord),
    };
  } catch (error) {
    return fallback;
  }
}

export async function getActivityData() {
  const fallback = { source: "demo", events: demoActivity };

  if (!hasDatabaseConfig) {
    return fallback;
  }

  try {
    const events = await prisma.activityEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { user: { select: { name: true, email: true } } },
    });

    return {
      source: "database",
      events: events.map(mapActivityRecord),
    };
  } catch (error) {
    return fallback;
  }
}

export async function getAnalyticsData() {
  const fallback = {
    source: "demo",
    metrics: {
      totalUsers: demoUsers.length,
      activeUsers: demoUsers.filter((user) => user.status === "Active").length,
      inactiveUsers: demoUsers.filter((user) => user.status === "Suspended").length,
      growthRate: 12.8,
    },
    trend: registrationData,
    distribution: [
      { label: "Active", value: 68, color: "bg-[#6D9E7D]" },
      { label: "Pending", value: 21, color: "bg-[#D3B35F]" },
      { label: "Suspended", value: 11, color: "bg-[#C77979]" },
    ],
  };

  if (!hasDatabaseConfig) {
    return fallback;
  }

  try {
    const [totalUsers, activeUsers, inactiveUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "SUSPENDED" } }),
    ]);

    return {
      source: "database",
      metrics: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        growthRate: totalUsers > 0 ? Number(((activeUsers / totalUsers) * 100).toFixed(1)) : 0,
      },
      trend: registrationData,
      distribution: [
        { label: "Active", value: totalUsers ? (activeUsers / totalUsers) * 100 : 0, color: "bg-[#6D9E7D]" },
        { label: "Pending", value: 0, color: "bg-[#D3B35F]" },
        { label: "Suspended", value: totalUsers ? (inactiveUsers / totalUsers) * 100 : 0, color: "bg-[#C77979]" },
      ],
    };
  } catch (error) {
    return fallback;
  }
}
