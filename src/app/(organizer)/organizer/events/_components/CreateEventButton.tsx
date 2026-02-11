"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateEventButtonProps {
  onClick: () => void;
}

export default function CreateEventButton({ onClick }: CreateEventButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="h-14 px-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all border border-zinc-800 active:scale-95 shrink-0"
    >
      <Plus className="w-5 h-5 mr-3" />
      Tạo sự kiện mới
    </Button>
  );
}
