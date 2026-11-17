import { NextResponse } from "next/server";
import { getAnalyticsData, requireAdminSession } from "@/lib/lib/admin";

export async function GET() {
  try {
    await requireAdminSession();
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getAnalyticsData();
  return NextResponse.json(data);
}
