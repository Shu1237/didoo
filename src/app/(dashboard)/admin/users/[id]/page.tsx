import { Suspense } from "react";
import { SectionFallback } from "@/components/base/SectionFallback";
import { UserDetailContent } from "./_components/UserDetailContent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">Chi tiết người dùng</h1>
          <p className="mt-1 text-sm text-zinc-500">Thông tin tài khoản</p>
        </div>
      </div>

      <Suspense fallback={<SectionFallback type="cards" cards={2} />}>
        <UserDetailContent id={id} />
      </Suspense>
    </div>
  );
}
