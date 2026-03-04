"use client";

import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { EventCreateBody, eventCreateSchema } from "@/schemas/event";
import { useEvent } from "@/hooks/useEvent";
import { useMedia } from "@/hooks/useMedia";
import { useGetCategories } from "@/hooks/useCategory";
import { useGetMe } from "@/hooks/useUser";
import { useTicketType } from "@/hooks/useTicketType";
import { handleErrorApi } from "@/lib/errors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

const formatDateForInput = (date: Date) => {
  const d = new Date(date);
  return new Date(
    d.getTime() - d.getTimezoneOffset() * 60000
  ).toISOString().slice(0, 16);
};

type ZoneInput = {
  name: string;
  price: number;
  quantity: number;
};

export default function CreateEventForm() {
  const router = useRouter();
  const { create } = useEvent();
  const { create: createTicketType } = useTicketType();
  const { uploadImage } = useMedia();
  const { data: categoriesRes } = useGetCategories({
    pageNumber: 1,
    pageSize: 100,
  });
  const { data: userData, isLoading: isUserLoading } = useGetMe();

  const currentUser = userData?.data;
  const categories = categoriesRes?.data?.items || [];

  const [step, setStep] = useState(1);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [zones, setZones] = useState<ZoneInput[]>([
    { name: "", price: 0, quantity: 0 },
  ]);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EventCreateBody>({
    resolver: zodResolver(eventCreateSchema) as any,
    defaultValues: {
      Name: "",
      Slug: "",
      Subtitle: "",
      Description: "",
      StartTime: formatDateForInput(new Date()) as any,
      EndTime: formatDateForInput(new Date()) as any,
      CategoryId: "",
      OrganizerId: "",
      Locations: [{ Name: "", Address: "" }],
      ThumbnailUrl: "",
      BannerUrl: "",
      AgeRestriction: 0,
    },
  });

  useEffect(() => {
    if (currentUser?.organizerId) {
      form.setValue("OrganizerId", currentUser.organizerId);
    }
  }, [currentUser?.organizerId]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "ThumbnailUrl" | "BannerUrl"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadImage.mutateAsync(file);
    form.setValue(field, result.secure_url);
  };

  const onEventSubmit = async (values: EventCreateBody) => {
    try {
      const event = await create.mutateAsync({
        ...values,
        OrganizerId:
          values.OrganizerId || currentUser?.organizerId || "",
      });
      setCreatedEventId(event.id);
      setStep(2);
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  const addZone = () =>
    setZones((prev) => [...prev, { name: "", price: 0, quantity: 0 }]);

  const removeZone = (i: number) =>
    setZones((prev) => prev.filter((_, idx) => idx !== i));

  const updateZone = (
    i: number,
    field: keyof ZoneInput,
    value: string | number
  ) => {
    setZones((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const onTicketTypesSubmit = async () => {
    if (!createdEventId) return;

    const valid = zones.filter((z) => z.name.trim() && z.quantity > 0);
    if (!valid.length) {
      toast.error("Thêm ít nhất một khu vực hợp lệ.");
      return;
    }

    try {
      for (const z of valid) {
        await createTicketType.mutateAsync({
          eventId: createdEventId,
          name: z.name.trim(),
          price: Number(z.price) || 0,
          totalQuantity: Number(z.quantity),
          availableQuantity: Number(z.quantity),
        });
      }

      toast.success("Tạo sự kiện thành công!");
      router.push("/organizer/events");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!currentUser?.organizerId) {
    return (
      <div className="p-6 border rounded-xl text-center">
        Bạn cần tạo hồ sơ tổ chức trước.
        <div className="mt-4">
          <Button size="sm" onClick={() => router.push("/user/profile")}>
            Đến hồ sơ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl shadow p-6 space-y-6">

      {/* STEP INDICATOR */}
      <div className="flex text-sm font-semibold">
        <div className={`flex-1 text-center py-2 rounded-l-xl ${step === 1 ? "bg-black text-white" : "bg-slate-100"}`}>
          1. Thông tin
        </div>
        <div className={`flex-1 text-center py-2 rounded-r-xl ${step === 2 ? "bg-black text-white" : "bg-slate-100"}`}>
          2. Vé
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <form onSubmit={form.handleSubmit(onEventSubmit)} className="grid grid-cols-12 gap-6">

          {/* IMAGE AREA */}
          <div className="col-span-3 space-y-4">

            {/* THUMBNAIL */}
            <div>
              <Label className="text-xs font-semibold">Thumbnail *</Label>
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className="relative group aspect-square rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden transition-all"
              >
                <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-primary rounded-xl transition-all" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />

                {form.watch("ThumbnailUrl") ? (
                  <img
                    src={form.watch("ThumbnailUrl")}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-white transition-all z-10">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-xs">Chọn ảnh</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                hidden
                ref={thumbnailInputRef}
                onChange={(e) => handleFileChange(e, "ThumbnailUrl")}
              />
            </div>

            {/* BANNER */}
            <div>
              <Label className="text-xs font-semibold">Banner</Label>
              <div
                onClick={() => bannerInputRef.current?.click()}
                className="relative group aspect-video rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer overflow-hidden transition-all"
              >
                <div className="absolute inset-0 border-2 border-dashed border-transparent group-hover:border-primary rounded-xl transition-all" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />

                {form.watch("BannerUrl") ? (
                  <img
                    src={form.watch("BannerUrl")}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 group-hover:text-white transition-all z-10">
                    <Upload className="w-6 h-6 mb-1" />
                    <span className="text-xs">Chọn banner</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                hidden
                ref={bannerInputRef}
                onChange={(e) => handleFileChange(e, "BannerUrl")}
              />
            </div>
          </div>

          {/* FORM FIELDS */}
          <div className="col-span-9 space-y-4">

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <Label className="text-xs">Tên sự kiện *</Label>
                <Input {...form.register("Name")} className="h-9" />
              </div>

              <Input {...form.register("Slug")} placeholder="Slug" className="h-9" />

              <Select onValueChange={(v) => form.setValue("CategoryId", v)}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input {...form.register("Subtitle")} placeholder="Phụ đề" className="h-9" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input type="datetime-local" {...form.register("StartTime")} className="h-9" />
              <Input type="datetime-local" {...form.register("EndTime")} className="h-9" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input {...form.register("Locations.0.Name")} placeholder="Tên địa điểm" className="h-9" />
              <Input {...form.register("Locations.0.Address")} placeholder="Địa chỉ" className="h-9" />
            </div>

            <Textarea {...form.register("Description")} className="h-20 resize-none" placeholder="Mô tả" />

            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                Hủy
              </Button>
              <Button type="submit" size="sm">
                Tiếp tục
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Danh sách loại vé</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addZone}
                className="h-8 text-xs font-semibold border-black hover:bg-black hover:text-white transition-all"
              >
                + Thêm loại vé
              </Button>
            </div>

            <div className="space-y-3">
              {zones.map((z, i) => (
                <div key={i} className="group relative grid grid-cols-12 gap-4 items-end p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all">
                  <div className="col-span-12 md:col-span-5 space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Tên loại vé (Vd: VIP, Standard...)</Label>
                    <Input
                      placeholder="Nhập tên loại vé"
                      value={z.name}
                      onChange={(e) => updateZone(i, "name", e.target.value)}
                      className="h-9 bg-white"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3 space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Giá vé (VNĐ)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={z.price}
                      onChange={(e) => updateZone(i, "price", e.target.value)}
                      className="h-9 bg-white"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3 space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-slate-400 ml-1">Số lượng vé</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={z.quantity}
                      onChange={(e) => updateZone(i, "quantity", e.target.value)}
                      className="h-9 bg-white"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeZone(i)}
                      disabled={zones.length === 1}
                      className="h-9 w-9 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <span className="sr-only">Xóa</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button size="sm" variant="outline" onClick={() => setStep(1)} className="px-6">
              Quay lại
            </Button>
            <Button size="sm" onClick={onTicketTypesSubmit} className="px-8 bg-black hover:bg-black/90">
              Hoàn tất & Lưu sự kiện
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}