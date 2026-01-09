import AdminHeader from "@/components/layout/admin/Header";
import AdminSidebar from "@/components/layout/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  );
}
