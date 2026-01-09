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
        <main className="flex-1 p-6 bg-muted/50">
          {children}
        </main>
      </div>
    </div>
  );
}
