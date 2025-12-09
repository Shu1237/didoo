import LayoutAuth from "@/components/layout/auth/layout";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutAuth>
      {children}
    </LayoutAuth>
  );
}
