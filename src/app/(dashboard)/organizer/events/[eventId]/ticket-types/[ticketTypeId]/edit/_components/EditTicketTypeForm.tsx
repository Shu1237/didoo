"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ticketTypeUpdateSchema, type TicketTypeUpdateBody } from "@/schemas/ticketType";
import { useTicketType } from "@/hooks/useTicketType";
import { useGetEvent } from "@/hooks/useEvent";
import { useGetTicketType } from "@/hooks/useTicketType";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { handleErrorApi } from "@/lib/errors";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export function EditTicketTypeForm({
  eventId,
  ticketTypeId,
}: {
  eventId: string;
  ticketTypeId: string;
}) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { update, deleteTicketType } = useTicketType();
  const { data: eventRes } = useGetEvent(eventId);
  const { data: ticketTypeRes, isLoading } = useGetTicketType(ticketTypeId);

  const event = eventRes?.data;
  const ticketType = ticketTypeRes?.data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketTypeUpdateBody>({
    resolver: zodResolver(ticketTypeUpdateSchema),
    defaultValues: {
      name: "",
      price: 0,
      totalQuantity: 0,
      availableQuantity: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (ticketType) {
      reset({
        name: ticketType.name,
        price: ticketType.price,
        totalQuantity: ticketType.totalQuantity,
        availableQuantity: ticketType.availableQuantity,
        description: ticketType.description ?? "",
      });
    }
  }, [ticketType, reset]);

  const onSubmit = async (data: TicketTypeUpdateBody) => {
    try {
      await update.mutateAsync({ id: ticketTypeId, body: data });
      router.push(`/organizer/events/${eventId}`);
    } catch (err) {
      handleErrorApi({ error: err });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTicketType.mutateAsync(ticketTypeId);
      router.push(`/organizer/events/${eventId}`);
    } catch (err) {
      handleErrorApi({ error: err });
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (isLoading || !ticketType) {
    return (
      <Card className="border-zinc-200">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card className="border-zinc-200">
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-900">Thông tin loại vé</h2>
        <p className="text-sm text-zinc-500">
          Sự kiện: {event?.name ?? "—"}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tên loại vé *</Label>
              <Input
                id="name"
                placeholder="Ví dụ: Vé thường, VIP"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ) *</Label>
              <Input
                id="price"
                type="number"
                min={0}
                placeholder="0"
                {...register("price", { valueAsNumber: true })}
                className={errors.price ? "border-destructive" : ""}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="totalQuantity">Tổng số lượng *</Label>
              <Input
                id="totalQuantity"
                type="number"
                min={0}
                placeholder="0"
                {...register("totalQuantity", { valueAsNumber: true })}
                className={errors.totalQuantity ? "border-destructive" : ""}
              />
              {errors.totalQuantity && (
                <p className="text-sm text-destructive">{errors.totalQuantity.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableQuantity">Số lượng còn lại *</Label>
              <Input
                id="availableQuantity"
                type="number"
                min={0}
                placeholder="0"
                {...register("availableQuantity", { valueAsNumber: true })}
                className={errors.availableQuantity ? "border-destructive" : ""}
              />
              {errors.availableQuantity && (
                <p className="text-sm text-destructive">{errors.availableQuantity.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả (optional)</Label>
            <Input
              id="description"
              placeholder="Mô tả ngắn về loại vé"
              {...register("description")}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/organizer/events/${eventId}`}>
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại
                </Link>
              </Button>
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Cập nhật
              </Button>
            </div>
            <Button
              variant="outline"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa loại vé
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <ConfirmModal
      open={showDeleteModal}
      onOpenChange={setShowDeleteModal}
      title="Xóa loại vé"
      description={`Bạn có chắc muốn xóa "${ticketType?.name}"?`}
      confirmLabel="Xóa"
      onConfirm={handleDelete}
      isLoading={deleteTicketType.isPending}
      variant="danger"
    />
  </>
  );
}
