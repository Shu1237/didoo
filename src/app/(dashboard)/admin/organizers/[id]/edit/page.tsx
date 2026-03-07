import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EditOrganizerForm } from "./_components/EditOrganizerForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditOrganizerPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/organizers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">
            Chỉnh sửa organizer
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Cập nhật thông tin tổ chức</p>
        </div>
      </div>

      <EditOrganizerForm id={id} />
    </div>
  );
}
