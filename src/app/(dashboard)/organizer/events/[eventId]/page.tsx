import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { EventDetailContent } from "./_components/EventDetailContent";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function OrganizerEventDetailPage({ params }: PageProps) {
  const { eventId } = await params;

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
            Chi tiết sự kiện
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Xem thông tin và quản lý loại vé</p>
        </div>
      </div>

      <EventDetailContent eventId={eventId} />
    </div>
  );
}
