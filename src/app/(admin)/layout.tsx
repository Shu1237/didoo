import AdminHeader from "@/components/layout/admin/Header";
import AdminSidebar from "@/components/layout/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen gap-3 overflow-hidden bg-zinc-100 p-3">
      <div className="shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <AdminHeader />

        <main className="min-h-0 flex-1 overflow-hidden bg-zinc-50/70 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
