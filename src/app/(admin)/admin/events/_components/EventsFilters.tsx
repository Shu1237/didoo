"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EventsFilters() {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <Input placeholder="Tìm kiếm sự kiện..." className="flex-1" />
        <Button variant="outline">Lọc</Button>
      </div>
    </Card>
  );
}
