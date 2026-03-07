"use client";

import { useState } from "react";
import { EventsTable } from "./EventsTable";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useEvent } from "@/hooks/useEvent";
import type { Event } from "@/types/event";

export function EventsSection({
  params,
}: {
  params: Record<string, string | string[] | undefined>;
}) {
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const { deleteEvent } = useEvent();

  const handleDelete = async () => {
    if (!eventToDelete) return;
    await deleteEvent.mutateAsync(eventToDelete.id);
    setEventToDelete(null);
  };

  return (
    <>
      <EventsTable
        params={params}
        onDelete={(e) => setEventToDelete(e)}
      />

      <ConfirmModal
        open={!!eventToDelete}
        onOpenChange={(o) => !o && setEventToDelete(null)}
        title="Xóa sự kiện"
        description={`Bạn có chắc muốn xóa "${eventToDelete?.name}"?`}
        confirmLabel="Xóa"
        onConfirm={handleDelete}
        isLoading={deleteEvent.isPending}
        variant="danger"
      />
    </>
  );
}
