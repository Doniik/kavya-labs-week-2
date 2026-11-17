import AdminAnalyticsClient from "@/components/admin/AdminAnalyticsClient";
import { getAnalyticsData } from "@/lib/lib/admin";

export default async function AdminAnalyticsPage() {
  const data = await getAnalyticsData();
  return <AdminAnalyticsClient data={data} />;
}
