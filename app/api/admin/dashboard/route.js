import { NextResponse } from "next/server";
import { getDashboardData, requireAdminSession } from "@/lib/lib/admin";

export async function GET() {
  try {
    await requireAdminSession();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getDashboardData();
  return NextResponse.json(data);
}
