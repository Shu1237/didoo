"use client";

import { useState } from "react";
import EventsList from "./_components/EventsList";
import CreateEventButton from "./_components/CreateEventButton";
import EventModal, { EventModalMode } from "./_components/EventModal";
import { useGetEvents } from "@/hooks/useEvent";
import { useGetMe } from "@/hooks/useUser";
import Loading from "@/components/loading";
import { useSearchParams } from "next/navigation";
import { BasePagination } from "@/components/base/BasePagination";

export default function OrganizerEventsPage() {
  const { data: userData, isLoading: isUserLoading } = useGetMe();
  const searchParams = useSearchParams();
  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const user = userData?.data;
  const organizerId = user?.organizerId;

  const { data: eventsRes, isLoading: isEventsLoading } = useGetEvents({
    organizerId: organizerId || undefined,
    pageNumber,
    pageSize,
  });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: EventModalMode;
    event?: any;
  }>({
    isOpen: false,
    mode: "CREATE",
  });

  const openModal = (mode: EventModalMode, event?: any) => {
    setModalState({ isOpen: true, mode, event });
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  if (isUserLoading || isEventsLoading) return <Loading />;

  const events = eventsRes?.data?.items || [];
  const totalPages = eventsRes?.data?.totalPage || 1;
  const totalItems = eventsRes?.data?.totalCount || 0;
  const isActiveOrganizer = user?.role?.name === "ORGANIZER" && user?.status === "Active";

  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-8 shrink-0">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Quản lý sự kiện</h1>
          <p className="text-zinc-500 mt-2 font-semibold">
            Chỉnh sửa và tối ưu hóa các sự kiện của bạn
          </p>
        </div>
        {isActiveOrganizer && <CreateEventButton onClick={() => openModal("CREATE")} />}
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollbar-thin rounded-3xl">
        <EventsList
          events={events}
          onViewDetail={(event) => openModal("DETAIL", event)}
          onEdit={(event) => openModal("EDIT", event)}
        />
      </div>

      {totalPages > 1 && (
        <div className="mt-8 border-t border-zinc-100 pt-6">
          <BasePagination
            currentPage={pageNumber}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={() => { }} // Managed by searchParams indirectly via URL
          />
        </div>
      )}

      <EventModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        event={modalState.event}
      />
    </div>
  );
}
