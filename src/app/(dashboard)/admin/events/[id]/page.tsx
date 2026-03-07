import { Suspense } from "react";
import { SectionFallback } from "@/components/base/SectionFallback";
import { AdminEventDetailContent } from "./_components/AdminEventDetailContent";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEventDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/events">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">
            Chi tiết sự kiện
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Thông tin sự kiện</p>
        </div>
      </div>

      <Suspense fallback={<SectionFallback type="cards" cards={2} />}>
        <AdminEventDetailContent eventId={id} />
      </Suspense>
    </div>
  );
}
