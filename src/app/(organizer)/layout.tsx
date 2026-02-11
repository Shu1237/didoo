import OrganizerHeader from "@/components/layout/organizer/Header";
import OrganizerSidebar from "@/components/layout/organizer/Sidebar";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-[#F9FAFB] overflow-hidden flex p-4 gap-4">
      {/* Subtle Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-purple-50/50 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar - Remains consistent as requested */}
      <div className="relative z-10 shrink-0">
        <OrganizerSidebar />
      </div>

      {/* Main Content Wrapper - Transitioned to Bright Aesthetic */}
      <div className="relative z-10 flex-1 bg-white border border-zinc-200 shadow-sm rounded-[32px] flex flex-col overflow-hidden">
        <OrganizerHeader />

        {/* Main content - Fixed height, no global scroll */}
        <main className="flex-1 overflow-hidden p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
