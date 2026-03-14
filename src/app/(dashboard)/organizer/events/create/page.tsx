import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Suspense } from "react";
import { SectionFallback } from "@/components/base/SectionFallback";
import { CreateEventForm } from "./_components/CreateEventForm";

export default function OrganizerCreateEventPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/organizer/events">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">
            Tạo sự kiện
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Thêm sự kiện mới</p>
        </div>
      </div>

      <Suspense fallback={<SectionFallback type="cards" cards={3} />}>
        <CreateEventForm />
      </Suspense>
    </div>
  );
}
