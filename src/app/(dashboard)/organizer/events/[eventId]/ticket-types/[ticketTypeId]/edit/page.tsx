import { EditTicketTypeForm } from "./_components/EditTicketTypeForm";

type PageProps = {
  params: Promise<{ eventId: string; ticketTypeId: string }>;
};

export default async function EditTicketTypePage({ params }: PageProps) {
  const { eventId, ticketTypeId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">
          Chỉnh sửa loại vé
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Cập nhật thông tin loại vé
        </p>
      </div>

      <EditTicketTypeForm eventId={eventId} ticketTypeId={ticketTypeId} />
    </div>
  );
}
