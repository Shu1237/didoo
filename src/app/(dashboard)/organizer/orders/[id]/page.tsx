import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { SectionFallback } from "@/components/base/SectionFallback";
import { OrganizerOrderDetailContent } from "./_components/OrganizerOrderDetailContent";

export default async function OrganizerOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/organizer/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">
            Chi tiết đơn hàng
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Mã đơn: {id}</p>
        </div>
      </div>

      <Suspense fallback={<SectionFallback type="table" rows={8} />}>
        <OrganizerOrderDetailContent id={id} />
      </Suspense>
    </div>
  );
}

