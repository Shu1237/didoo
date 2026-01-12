import Header from "@/components/layout/Header";

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Header />

      {/* Content offset xuống dưới header */}
      <div className="pt-[74px] h-full">
        {children}
      </div>
    </div>
  );
}
