import AdminShell from "../../components/admin/AdminShell";

export const metadata = {
  title: "Admin | Kavya Labs",
  description: "Kavya Labs administration workspace preview.",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
