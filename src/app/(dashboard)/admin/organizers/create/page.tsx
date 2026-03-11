import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CreateOrganizerForm } from "./_components/CreateOrganizerForm";

export default function AdminCreateOrganizerPage() {
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
            Tạo organizer
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Thêm tổ chức sự kiện mới</p>
        </div>
      </div>

      <CreateOrganizerForm />
    </div>
  );
}
