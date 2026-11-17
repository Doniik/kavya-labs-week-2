import AdminActivityClient from "@/components/admin/AdminActivityClient";
import { getActivityData } from "@/lib/lib/admin";

export default async function AdminActivityPage() {
  const data = await getActivityData();
  return <AdminActivityClient events={data.events} source={data.source} />;
}
