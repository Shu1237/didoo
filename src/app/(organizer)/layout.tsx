import OrganizerHeader from "@/components/layout/organizer/Header";
import OrganizerSidebar from "@/components/layout/organizer/Sidebar";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <OrganizerHeader />
      <div className="flex flex-1">
        <OrganizerSidebar />
        <main className="flex-1 p-6 md:p-8 bg-gradient-to-br from-background to-muted/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
