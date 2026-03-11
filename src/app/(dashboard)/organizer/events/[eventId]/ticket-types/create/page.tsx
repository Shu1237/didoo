import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CreateTicketTypesForm } from "./_components/CreateTicketTypesForm";

type PageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function CreateTicketTypesPage({ params }: PageProps) {
  const { eventId } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/organizer/events/${eventId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">
            Tạo loại vé
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Thêm các loại vé cho sự kiện của bạn
          </p>
        </div>
      </div>

      <CreateTicketTypesForm eventId={eventId} />
    </div>
  );
}
