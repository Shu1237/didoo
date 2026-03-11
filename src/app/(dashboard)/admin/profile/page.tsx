import { Suspense } from "react";
import { SectionFallback } from "@/components/base/SectionFallback";
import { AdminProfileContent } from "./_components/AdminProfileContent";

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">Hồ sơ</h1>
        <p className="mt-1 text-sm text-zinc-500">Thông tin tài khoản admin</p>
      </div>

      <Suspense fallback={<SectionFallback type="cards" cards={2} />}>
        <AdminProfileContent />
      </Suspense>
    </div>
  );
}
