import Header from "@/components/layout/Header";

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden bg-background">
      <Header />

      {/* Content offset xuống dưới header */}
      <div className="h-full">
        {children}
      </div>
    </div>
  );
}
