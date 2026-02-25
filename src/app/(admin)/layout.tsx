import AdminHeader from "@/components/layout/admin/Header";
import AdminSidebar from "@/components/layout/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-black overflow-hidden flex p-3 gap-3">
      {/* Ambient Glow Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[50%] bg-blue-500/20 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar */}
      <div className="relative z-10 shrink-0">
        <AdminSidebar />
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex-1 bg-[#F8F9FB] rounded-[32px] flex flex-col overflow-hidden shadow-2xl">
        <AdminHeader />

        {/* QUAN TRỌNG: Không cho phép main cuộn dọc, lề p-6 để card không sát đáy */}
        <main className="flex-1 overflow-hidden p-6 min-h-0 flex flex-col relative w-full">
          {children}
        </main>
      </div>
    </div>
  );
}