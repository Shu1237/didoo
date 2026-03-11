"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventUpdateSchema, locationSchema, type EventUpdateBody } from "@/schemas/event";
import { useEvent, useGetEvent, useGetCategories } from "@/hooks/useEvent";
import { useMedia } from "@/hooks/useMedia";
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
import { AddressAutocompleteInput } from "@/components/AddressAutocompleteInput";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EventStatus } from "@/utils/enum";
import { z } from "zod";

const eventUpdateFormSchema = eventUpdateSchema.extend({
  Locations: z.array(locationSchema).min(1),
});
type EventUpdateFormValues = z.input<typeof eventUpdateFormSchema>;
type EventLocationForm = EventUpdateFormValues["Locations"][number];

function formatDateTimeLocal(s: string | undefined) {
  if (!s) return "";
  try {
    const d = new Date(s);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

function formatTime(s: string | undefined) {
  if (!s) return "";
  return s.length >= 5 ? s.slice(0, 5) : s;
}

export function EditEventForm({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { update } = useEvent();
  const { uploadImage } = useMedia();
  const { data: eventRes, isLoading } = useGetEvent(eventId);
  const { data: categoriesRes } = useGetCategories({});
  const event = eventRes?.data;
  const categories = categoriesRes?.data?.items ?? [];

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const ticketMapInputRef = useRef<HTMLInputElement>(null);

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [ticketMapPreview, setTicketMapPreview] = useState<string | null>(null);
  const [uploadingType, setUploadingType] = useState<"banner" | "thumbnail" | "ticketMap" | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    control,
    formState: { errors },
  } = useForm<EventUpdateFormValues>({
    resolver: zodResolver(eventUpdateFormSchema),
    defaultValues: {
      Name: "",
      Slug: "",
      Subtitle: "",
      Description: "",
      Status: EventStatus.DRAFT,
      CategoryId: "",
      AgeRestriction: 0,
      StartTime: undefined as unknown as Date,
      EndTime: undefined as unknown as Date,
      OpenTime: "",
      ClosedTime: "",
      ThumbnailUrl: "",
      BannerUrl: "",
      TicketMapUrl: "",
      Locations: [
        {
          Address: "",
          Province: "",
          District: "",
          Ward: "",
          Zipcode: "",
          Latitude: 0,
          Longitude: 0,
          ContactEmail: "",
          ContactPhone: "",
        },
      ],
    },
  });

  const { fields, remove } = useFieldArray({ control, name: "Locations" });

  useEffect(() => {
    if (event) {
      const locations: EventLocationForm[] = event.locations?.length
        ? event.locations.map((loc) => ({
            Address: loc.address ?? "",
            Province: loc.province ?? "",
            District: loc.district ?? "",
            Ward: loc.ward ?? "",
            Zipcode: loc.zipcode ?? "",
            Latitude: loc.latitude ?? 0,
            Longitude: loc.longitude ?? 0,
            ContactEmail: loc.contactEmail ?? "",
            ContactPhone: loc.contactPhone ?? "",
          }))
        : [
            {
              Address: "",
              Province: "",
              District: "",
              Ward: "",
              Zipcode: "",
              Latitude: 0,
              Longitude: 0,
              ContactEmail: "",
              ContactPhone: "",
            },
          ];
      reset({
        Name: event.name,
        Slug: event.slug,
        Subtitle: event.subtitle ?? "",
        Description: event.description,
        Status: Number(event.status) as EventStatus,
        CategoryId: event.category?.id ?? (event as { categoryId?: string }).categoryId ?? "",
        AgeRestriction: event.ageRestriction ?? 0,
        StartTime: event.startTime ? formatDateTimeLocal(event.startTime) : undefined,
        EndTime: event.endTime ? formatDateTimeLocal(event.endTime) : undefined,
        OpenTime: formatTime(event.openTime),
        ClosedTime: formatTime(event.closedTime),
        ThumbnailUrl: event.thumbnailUrl ?? "",
        BannerUrl: event.bannerUrl ?? "",
        TicketMapUrl: event.ticketMapUrl ?? "",
        Locations: locations,
      });
      if (event.bannerUrl) setBannerPreview(event.bannerUrl);
      if (event.thumbnailUrl) setThumbnailPreview(event.thumbnailUrl);
      if (event.ticketMapUrl) setTicketMapPreview(event.ticketMapUrl);
    }
  }, [event, reset]);

  const handleFileUpload = async (
    file: File,
    type: "banner" | "thumbnail" | "ticketMap"
  ) => {
    if (!file.type.startsWith("image/")) return;
    if (uploadingType || uploadImage.isPending) return;
    setUploadingType(type);
    try {
      const result = await uploadImage.mutateAsync(file);
      const url = (result as { secure_url: string }).secure_url;
      if (type === "banner") {
        setValue("BannerUrl", url);
        setBannerPreview(URL.createObjectURL(file));
      } else if (type === "thumbnail") {
        setValue("ThumbnailUrl", url);
        setThumbnailPreview(URL.createObjectURL(file));
      } else {
        setValue("TicketMapUrl", url);
        setTicketMapPreview(URL.createObjectURL(file));
      }
    } catch {
      // handleErrorApi in useMedia
    } finally {
      setUploadingType(null);
    }
  };

  const isUploading = !!uploadingType;

  const onSubmit = async (data: EventUpdateFormValues) => {
    const formatTime = (time?: string) => {
      if (!time) return undefined;
      return time.length === 5 ? `${time}:00` : time;
    };
    try {
      // Get OrganizerId from event
      const organizerId = event?.organizer?.id;
      const payload = {
        Name: data.Name,
        Slug: data.Slug,
        Subtitle: data.Subtitle,
        Description: data.Description,
        StartTime: data.StartTime instanceof Date ? data.StartTime : data.StartTime ? new Date(data.StartTime as string) : undefined,
        EndTime: data.EndTime instanceof Date ? data.EndTime : data.EndTime ? new Date(data.EndTime as string) : undefined,
        OpenTime: formatTime(data.OpenTime),
        ClosedTime: formatTime(data.ClosedTime),
        ThumbnailUrl: data.ThumbnailUrl,
        BannerUrl: data.BannerUrl,
        TicketMapUrl: data.TicketMapUrl,
        AgeRestriction: data.AgeRestriction,
        CategoryId: data.CategoryId,
        OrganizerId: organizerId,
        Locations: data.Locations,
      };
      await update.mutateAsync({ id: eventId, body: payload });
      router.push("/admin/events");
    } catch (err) {
      handleErrorApi({ error: err, setError });
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Top row: Banner (3), Thumbnail (7) - giống Create */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[3fr_7fr]">
        <div className="space-y-2">
          <Label>Banner</Label>
          <div
            onClick={() => !isUploading && bannerInputRef.current?.click()}
            className={`relative flex h-[200px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors ${
              isUploading ? "cursor-not-allowed opacity-70" : "hover:border-zinc-300 hover:bg-zinc-100"
            }`}
          >
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f, "banner");
                e.target.value = "";
              }}
            />
            {uploadingType === "banner" && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                <Loader2 className="h-10 w-10 animate-spin text-zinc-600" />
              </div>
            )}
            {bannerPreview ? (
              <img src={bannerPreview} alt="Banner" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-500">
                <ImagePlus className="h-10 w-10" />
                <span className="text-sm">Tải lên banner</span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Thumbnail</Label>
          <div
            onClick={() => !isUploading && thumbnailInputRef.current?.click()}
            className={`relative flex h-[200px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors ${
              isUploading ? "cursor-not-allowed opacity-70" : "hover:border-zinc-300 hover:bg-zinc-100"
            }`}
          >
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload(f, "thumbnail");
                e.target.value = "";
              }}
            />
            {uploadingType === "thumbnail" && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                <Loader2 className="h-10 w-10 animate-spin text-zinc-600" />
              </div>
            )}
            {thumbnailPreview ? (
              <img src={thumbnailPreview} alt="Thumbnail" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-zinc-500">
                <ImagePlus className="h-10 w-10" />
                <span className="text-sm">Tải lên thumbnail</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thông tin cơ bản */}
      <Card className="border-zinc-200">
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-900">Thông tin cơ bản</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="Name">Tên sự kiện *</Label>
              <Input
                id="Name"
                placeholder="Ví dụ: AI Conference 2026"
                {...register("Name")}
                className={errors.Name ? "border-destructive" : ""}
              />
              {errors.Name && <p className="text-sm text-destructive">{String(errors.Name.message ?? "")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Slug">Slug *</Label>
              <Input
                id="Slug"
                placeholder="ai-conference-2026"
                {...register("Slug")}
                className={errors.Slug ? "border-destructive" : ""}
              />
              {errors.Slug && <p className="text-sm text-destructive">{String(errors.Slug.message ?? "")}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="Subtitle">Phụ đề</Label>
            <Input
              id="Subtitle"
              placeholder="Mô tả ngắn hiển thị bên dưới tên"
              {...register("Subtitle")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Organizer *</Label>
              <Input
                value={event.organizer?.name ?? ""}
                readOnly
                disabled
                className="bg-zinc-50 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label>Danh mục *</Label>
              <Select value={watch("CategoryId") || undefined} onValueChange={(v) => setValue("CategoryId", v)}>
                <SelectTrigger className={errors.CategoryId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.CategoryId && (
                <p className="text-sm text-destructive">{String(errors.CategoryId.message ?? "")}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Trạng thái</Label>
              <Select
                value={watch("Status") != null ? String(watch("Status")) : undefined}
                onValueChange={(v) => setValue("Status", Number(v) as EventStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(EventStatus.DRAFT)}>Nháp</SelectItem>
                  <SelectItem value={String(EventStatus.PUBLISHED)}>Đã duyệt</SelectItem>
                  <SelectItem value={String(EventStatus.CANCELLED)}>Đã hủy</SelectItem>
                  <SelectItem value={String(EventStatus.OPENED)}>Đang mở</SelectItem>
                  <SelectItem value={String(EventStatus.CLOSED)}>Đã đóng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="AgeRestriction">Độ tuổi tối thiểu</Label>
              <Input
                id="AgeRestriction"
                type="number"
                min={0}
                {...register("AgeRestriction", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="StartTime">Thời gian bắt đầu *</Label>
              <Input
                id="StartTime"
                type="datetime-local"
                {...register("StartTime")}
                className={errors.StartTime ? "border-destructive" : ""}
              />
              {errors.StartTime && (
                <p className="text-sm text-destructive">{String(errors.StartTime.message ?? "")}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="EndTime">Thời gian kết thúc *</Label>
              <Input
                id="EndTime"
                type="datetime-local"
                {...register("EndTime")}
                className={errors.EndTime ? "border-destructive" : ""}
              />
              {errors.EndTime && (
                <p className="text-sm text-destructive">{String(errors.EndTime.message ?? "")}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="OpenTime">Giờ mở cửa </Label>
              <Input
                id="OpenTime"
                type="time"
                placeholder="HH:mm"
                {...register("OpenTime")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ClosedTime">Giờ đóng cửa </Label>
              <Input
                id="ClosedTime"
                type="time"
                placeholder="HH:mm"
                {...register("ClosedTime")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mô tả & Sơ đồ ghế */}
      <Card className="border-zinc-200">
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-900">Mô tả & Sơ đồ ghế</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="Description">Mô tả *</Label>
            <Textarea
              id="Description"
              placeholder="Mô tả chi tiết về sự kiện"
              rows={6}
              {...register("Description")}
              className={errors.Description ? "border-destructive" : ""}
            />
            {errors.Description && (
              <p className="text-sm text-destructive">{String(errors.Description.message ?? "")}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Ảnh sơ đồ ghế </Label>
            <div
              onClick={() => !isUploading && ticketMapInputRef.current?.click()}
              className={`relative flex aspect-video w-full max-w-lg cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors ${
                isUploading ? "cursor-not-allowed opacity-70" : "hover:border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              <input
                ref={ticketMapInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f, "ticketMap");
                  e.target.value = "";
                }}
              />
              {uploadingType === "ticketMap" && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                  <Loader2 className="h-10 w-10 animate-spin text-zinc-600" />
                </div>
              )}
              {ticketMapPreview ? (
                <img
                  src={ticketMapPreview}
                  alt="Sơ đồ ghế"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-500">
                  <Upload className="h-10 w-10" />
                  <span className="text-sm">Tải lên ảnh sơ đồ ghế</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Địa điểm */}
      <Card className="border-zinc-200">
        <CardHeader>
          <h2 className="text-lg font-semibold text-zinc-900">Địa điểm *</h2>
          <p className="text-sm text-zinc-500">Ít nhất một địa điểm</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, i) => (
            <div key={field.id} className="space-y-4 rounded-xl border border-zinc-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600">Địa điểm {i + 1}</span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => remove(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label>Địa chỉ *</Label>
                <AddressAutocompleteInput
                  value={watch(`Locations.${i}.Address`)}
                  onChange={(result) => {
                    setValue(`Locations.${i}.Address`, result.address);
                    setValue(`Locations.${i}.Latitude`, result.latitude);
                    setValue(`Locations.${i}.Longitude`, result.longitude);
                    // Populate province/district/ward from Mapbox
                    if (result.province) setValue(`Locations.${i}.Province`, result.province);
                    if (result.district) setValue(`Locations.${i}.District`, result.district);
                    if (result.ward) setValue(`Locations.${i}.Ward`, result.ward);
                  }}
                  placeholder="Tìm địa chỉ (gõ để gợi ý)"
                  error={!!errors.Locations?.[i]?.Address}
                />
                {errors.Locations?.[i]?.Address && (
                  <p className="text-sm text-destructive">{String(errors.Locations[i]?.Address?.message ?? "")}</p>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tỉnh/Thành phố *</Label>
                  <Input placeholder="Ví dụ: Hồ Chí Minh" {...register(`Locations.${i}.Province`)} />
                </div>
                <div className="space-y-2">
                  <Label>Quận/Huyện *</Label>
                  <Input placeholder="Ví dụ: Quận 1" {...register(`Locations.${i}.District`)} />
                </div>
                <div className="space-y-2">
                  <Label>Phường/Xã *</Label>
                  <Input placeholder="Ví dụ: Bến Nghé" {...register(`Locations.${i}.Ward`)} />
                </div>
                <div className="space-y-2">
                  <Label>Mã bưu điện </Label>
                  <Input placeholder="Ví dụ: 700000" {...register(`Locations.${i}.Zipcode`)} />
                </div>
                <div className="space-y-2">
                  <Label>Email liên hệ</Label>
                  <Input placeholder="contact@example.com" {...register(`Locations.${i}.ContactEmail`)} />
                </div>
                <div className="space-y-2">
                  <Label>SĐT liên hệ</Label>
                  <Input placeholder="0912345678" {...register(`Locations.${i}.ContactPhone`)} />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" asChild>
          <Link href="/admin/events">Hủy</Link>
        </Button>
        <Button type="submit" disabled={update.isPending}>
          {update.isPending ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </div>
    </form>
  );
}
