import { Suspense } from "react";
import { SectionFallback } from "@/components/base/SectionFallback";
import { OrganizerOrdersContent } from "./_components/OrganizerOrdersContent";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrganizerOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">Đơn hàng</h1>
        <p className="mt-1 text-sm text-zinc-500">Quản lý đơn đặt vé</p>
      </div>

      <Suspense key={JSON.stringify(params)} fallback={<SectionFallback type="table" rows={10} />}>
        <OrganizerOrdersContent params={params} />
      </Suspense>
    </div>
  );
}
