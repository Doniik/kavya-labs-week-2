import AdminUsersClient from "@/components/admin/AdminUsersClient";
import { getUsersData } from "@/lib/lib/admin";

export default async function AdminUsersPage() {
  const data = await getUsersData();
  return <AdminUsersClient initialUsers={data.users} source={data.source} />;
}
