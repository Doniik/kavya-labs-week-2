import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/lib/admin";

export const metadata = {
  title: "Admin | Kavya Labs",
  description: "Kavya Labs administration workspace.",
};

export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
