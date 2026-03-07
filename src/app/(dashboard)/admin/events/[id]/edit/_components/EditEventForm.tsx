"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventUpdateSchema, type EventUpdateBody } from "@/schemas/event";
import { useEvent } from "@/hooks/useEvent";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetCategories } from "@/hooks/useCategory";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleErrorApi } from "@/lib/errors";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { EventStatus } from "@/utils/enum";

export function EditEventForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { update } = useEvent();
  const { data: eventRes, isLoading } = useGetEvent(eventId);
  const { data: categoriesRes } = useGetCategories({});
  const event = eventRes?.data;
  const categories = categoriesRes?.data?.items ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventUpdateBody>({
    resolver: zodResolver(eventUpdateSchema),
    defaultValues: {
      Name: "",
      Slug: "",
      Subtitle: "",
      Description: "",
      Status: EventStatus.DRAFT,
    },
  });

  useEffect(() => {
    if (event) {
      reset({
        Name: event.name,
        Slug: event.slug,
        Subtitle: event.subtitle ?? "",
        Description: event.description,
        Status: event.status as EventStatus,
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: EventUpdateBody) => {
    try {
      await update.mutateAsync({ id: eventId, body: data });
      router.push("/admin/events");
    } catch (err) {
      handleErrorApi({ error: err });
    }
  };

  if (isLoading || !event) {
    return (
      <Card className="border-zinc-200">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-200">
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-900">Thông tin sự kiện</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="Name">Tên</Label>
              <Input
                id="Name"
                {...register("Name")}
                className={errors.Name ? "border-destructive" : ""}
              />
              {errors.Name && (
                <p className="text-sm text-destructive">{errors.Name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Slug">Slug</Label>
              <Input
                id="Slug"
                {...register("Slug")}
                className={errors.Slug ? "border-destructive" : ""}
              />
              {errors.Slug && (
                <p className="text-sm text-destructive">{errors.Slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="Subtitle">Phụ đề</Label>
            <Input id="Subtitle" {...register("Subtitle")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="Description">Mô tả</Label>
            <Textarea
              id="Description"
              {...register("Description")}
              rows={4}
              className={errors.Description ? "border-destructive" : ""}
            />
            {errors.Description && (
              <p className="text-sm text-destructive">{errors.Description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select
              value={String(watch("Status"))}
              onValueChange={(v) => setValue("Status", Number(v) as EventStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(EventStatus.DRAFT)}>Nháp</SelectItem>
                <SelectItem value={String(EventStatus.PUBLISHED)}>Đã xuất bản</SelectItem>
                <SelectItem value={String(EventStatus.CANCELLED)}>Đã hủy</SelectItem>
                <SelectItem value={String(EventStatus.OPENED)}>Đang mở</SelectItem>
                <SelectItem value={String(EventStatus.CLOSED)}>Đã đóng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/events">Hủy</Link>
            </Button>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
