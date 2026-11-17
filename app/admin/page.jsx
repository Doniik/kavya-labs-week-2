import AdminOverviewClient from "@/components/admin/AdminOverviewClient";
import { getDashboardData } from "@/lib/lib/admin";

export default async function AdminOverviewPage() {
  const data = await getDashboardData();
  return <AdminOverviewClient data={data} />;
}
