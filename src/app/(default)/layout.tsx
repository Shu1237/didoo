import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="p-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
