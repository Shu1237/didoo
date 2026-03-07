"use client";

import { useState } from "react";
import { OrganizersTable } from "./OrganizersTable";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useOrganizer } from "@/hooks/useOrganizer";
import type { Organizer } from "@/types/organizer";

export function OrganizersSection({
  params,
}: {
  params: Record<string, string | string[] | undefined>;
}) {
  const [organizerToDelete, setOrganizerToDelete] = useState<Organizer | null>(null);
  const { deleteOrganizer } = useOrganizer();

  const handleDelete = async () => {
    if (!organizerToDelete) return;
    await deleteOrganizer.mutateAsync(organizerToDelete.id);
    setOrganizerToDelete(null);
  };

  return (
    <>
      <OrganizersTable
        params={params}
        onDelete={(o) => setOrganizerToDelete(o)}
      />

      <ConfirmModal
        open={!!organizerToDelete}
        onOpenChange={(o) => !o && setOrganizerToDelete(null)}
        title="Xóa organizer"
        description={`Bạn có chắc muốn xóa "${organizerToDelete?.name}"?`}
        confirmLabel="Xóa"
        onConfirm={handleDelete}
        isLoading={deleteOrganizer.isPending}
        variant="danger"
      />
    </>
  );
}
