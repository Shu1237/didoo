import { Suspense } from "react";
import { SectionFallback } from "@/components/base/SectionFallback";
import { OrganizerEarningsContent } from "./_components/OrganizerEarningsContent";

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrganizerEarningsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">Ví & Doanh thu</h1>
        <p className="mt-1 text-sm text-zinc-500">Thống kê doanh thu từ sự kiện</p>
      </div>

      <Suspense key={JSON.stringify(params)} fallback={<SectionFallback type="cards" cards={4} />}>
        <OrganizerEarningsContent params={params} />
      </Suspense>
    </div>
  );
}
