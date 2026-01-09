"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

// TODO: Implement full form with all fields and Google Maps integration
export default function CreateEventForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement API call to create event
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    router.push("/organizer/events");
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Tên sự kiện *
          </label>
          <Input id="title" required placeholder="Nhập tên sự kiện" />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Mô tả *
          </label>
          <textarea
            id="description"
            required
            className="w-full min-h-[120px] px-3 py-2 border rounded-md"
            placeholder="Nhập mô tả sự kiện"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Ngày bắt đầu *
            </label>
            <Input id="startDate" type="datetime-local" required />
          </div>
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              Ngày kết thúc *
            </label>
            <Input id="endDate" type="datetime-local" required />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            Địa điểm *
          </label>
          <Input id="location" required placeholder="Chọn địa điểm trên bản đồ" />
          <p className="text-xs text-muted-foreground">
            Tích hợp Google Maps sẽ được thêm vào đây
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo sự kiện"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
