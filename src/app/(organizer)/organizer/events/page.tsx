"use client";

import { useState } from "react";
import EventsList from "./_components/EventsList";
import CreateEventButton from "./_components/CreateEventButton";
import EventModal, { EventModalMode } from "./_components/EventModal";
import { mockOrganizerEvents } from "@/utils/mockOrganizer";

export default function OrganizerEventsPage() {
  const events = mockOrganizerEvents;
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

  return (
    <div className="h-full flex flex-col space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-8 shrink-0">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Quản lý sự kiện</h1>
          <p className="text-zinc-500 mt-2 font-semibold">
            Chỉnh sửa và tối ưu hóa các sự kiện của bạn
          </p>
        </div>
        <CreateEventButton onClick={() => openModal("CREATE")} />
      </div>

      <div className="flex-1 min-h-0 overflow-auto scrollbar-thin rounded-3xl">
        <EventsList
          events={events}
          onViewDetail={(event) => openModal("DETAIL", event)}
          onEdit={(event) => openModal("EDIT", event)}
        />
      </div>

      <EventModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        event={modalState.event}
      />
    </div>
  );
}
