"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CreateEventButton() {
  return (
    <Link href="/organizer/events/create">
      <Button>
        <Plus className="w-4 h-4 mr-2" />
        Tạo sự kiện mới
      </Button>
    </Link>
  );
}
