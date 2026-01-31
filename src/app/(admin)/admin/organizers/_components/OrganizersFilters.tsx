"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OrganizersFilters() {
  return (
    <Card className="p-4 bg-white border-zinc-200 shadow-sm">
      <div className="flex gap-4">
        <Input
          placeholder="Tìm kiếm theo tên, email hoặc công ty..."
          className="flex-1 bg-zinc-50 border-zinc-200 placeholder:text-zinc-500"
        />
        <Button variant="outline" className="border-zinc-200 text-zinc-700">Lọc</Button>
      </div>
    </Card>
  );
}
