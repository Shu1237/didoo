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
import { useEvent, useGetEvent } from "@/hooks/useEvent";
import { useMedia } from "@/hooks/useMedia";
import { useGetCategories } from "@/hooks/useCategory";
import { useGetMe } from "@/hooks/useUser";
import { useTicketType } from "@/hooks/useTicketType";
import { handleErrorApi } from "@/lib/errors";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  Loader2,
  Plus,
  Image as ImageIcon,
  Calendar,
  Tag,
  FileText,
  Ticket,
  ChevronRight,
  ChevronLeft,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

const formatDateForInput = (date: Date) => {
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

type ZoneInput = { name: string; price: number; quantity: number };

export default function CreateEventForm() {
  const router = useRouter();
  const { create } = useEvent();
  const { create: createTicketType } = useTicketType();
  const { uploadImage } = useMedia();
  const { data: categoriesRes } = useGetCategories({ pageNumber: 1, pageSize: 100 });
  const { data: userData, isLoading: isUserLoading } = useGetMe();
  const currentUser = userData?.data;
  const categories = categoriesRes?.data?.items || [];

  const [step, setStep] = useState(1);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [zones, setZones] = useState<ZoneInput[]>([{ name: "", price: 0, quantity: 0 }]);

  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EventCreateBody>({
    resolver: zodResolver(eventCreateSchema) as any,
    mode: "onTouched",
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
  }, [currentUser?.organizerId, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "ThumbnailUrl" | "BannerUrl") => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadImage.mutateAsync(file);
      form.setValue(field, result.secure_url);
    }
  };

  const onEventSubmit = async (values: EventCreateBody) => {
    try {
      const payload = { ...values, OrganizerId: values.OrganizerId || currentUser?.organizerId || "" };
      const event = await create.mutateAsync(payload);
      setCreatedEventId(event.id);
      setStep(2);
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  const addZone = () => setZones((prev) => [...prev, { name: "", price: 0, quantity: 0 }]);
  const removeZone = (i: number) => setZones((prev) => prev.filter((_, idx) => idx !== i));
  const updateZone = (i: number, field: keyof ZoneInput, value: string | number) => {
    setZones((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const onTicketTypesSubmit = async () => {
    if (!createdEventId) return;
    const valid = zones.filter((z) => z.name.trim() && z.quantity > 0);
    if (valid.length === 0) {
      toast.error("Thêm ít nhất một khu vực với tên và số lượng vé.");
      return;
    }
    try {
      for (const z of valid) {
        await createTicketType.mutateAsync({
          eventId: createdEventId,
          name: z.name.trim(),
          price: Number(z.price) || 0,
          totalQuantity: Number(z.quantity) || 0,
          availableQuantity: Number(z.quantity) || 0,
        });
      }
      toast.success("Tạo loại vé thành công!");
      router.push("/organizer/events");
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const thumbnailUrl = form.watch("ThumbnailUrl");
  const bannerUrl = form.watch("BannerUrl");

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!currentUser?.organizerId) {
    return (
      <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-8 text-center">
        <p className="text-amber-800 font-medium mb-4">Bạn cần tạo hồ sơ tổ chức trước khi tạo sự kiện.</p>
        <Button variant="outline" className="rounded-full border-amber-300 text-amber-700 hover:bg-amber-100" onClick={() => router.push("/user/profile")}>
          Đến hồ sơ tổ chức
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
      {/* Step indicator */}
      <div className="flex border-b border-slate-100">
        <button
          type="button"
          onClick={() => step === 2 && setStep(1)}
          className={`flex-1 px-6 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            step === 1 ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
          Thông tin sự kiện
        </button>
        <button
          type="button"
          onClick={() => step === 1 && createdEventId && setStep(2)}
          className={`flex-1 px-6 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
            step === 2 ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
        >
          <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
          Loại vé & Khu vực
        </button>
      </div>

      {step === 1 && (
        <form onSubmit={form.handleSubmit(onEventSubmit)} className="flex flex-col md:flex-row min-h-0 max-h-[calc(100vh-14rem)]">
          <input type="hidden" {...form.register("OrganizerId")} />
          <input type="hidden" {...form.register("AgeRestriction")} />

          {/* Ảnh bên trái - cố định */}
          <aside className="md:w-[280px] p-6 border-b md:border-b-0 md:border-r border-slate-100 shrink-0 bg-slate-50/50">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Hình ảnh sự kiện
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-600">Thumbnail (1:1) *</Label>
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="aspect-square w-full max-w-[200px] rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-primary/50 transition-all bg-slate-50 flex items-center justify-center cursor-pointer"
                >
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} className="w-full h-full object-cover" alt="Thumbnail" />
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center gap-2">
                      {uploadImage.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-8 h-8" />}
                      <span className="text-xs font-medium">Chọn ảnh</span>
                    </div>
                  )}
                  <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "ThumbnailUrl")} />
                </div>
                {form.formState.errors.ThumbnailUrl && <p className="text-[11px] text-red-500">{form.formState.errors.ThumbnailUrl.message}</p>}
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-600">Banner (16:9)</Label>
                <div
                  onClick={() => bannerInputRef.current?.click()}
                  className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-primary/50 transition-all bg-slate-50 flex items-center justify-center cursor-pointer"
                >
                  {bannerUrl ? (
                    <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center gap-2">
                      {uploadImage.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-8 h-8" />}
                      <span className="text-xs font-medium">Chọn banner</span>
                    </div>
                  )}
                  <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "BannerUrl")} />
                </div>
              </div>
            </div>
          </aside>

          {/* Nội dung input bên phải - có scroll */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="space-y-10">
                {/* Basic info */}
                <section>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Thông tin cơ bản
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[13px] font-bold text-slate-600">Tên sự kiện *</Label>
                      <Input {...form.register("Name")} placeholder="VD: Tech Talk 2025" className="rounded-xl h-11 border-slate-200" />
                      {form.formState.errors.Name && <p className="text-[11px] text-red-500">{form.formState.errors.Name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-slate-600">Slug *</Label>
                      <Input {...form.register("Slug")} placeholder="tech-talk-2025" className="rounded-xl h-11 border-slate-200" />
                      {form.formState.errors.Slug && <p className="text-[11px] text-red-500">{form.formState.errors.Slug.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-slate-600">Danh mục *</Label>
                      <Select onValueChange={(val) => form.setValue("CategoryId", val)} value={form.watch("CategoryId")}>
                        <SelectTrigger className="rounded-xl h-11 border-slate-200">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.CategoryId && <p className="text-[11px] text-red-500">{form.formState.errors.CategoryId.message}</p>}
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-[13px] font-bold text-slate-600">Phụ đề (tùy chọn)</Label>
                      <Input {...form.register("Subtitle")} placeholder="Mô tả ngắn gọn" className="rounded-xl h-11 border-slate-200" />
                    </div>
                  </div>
                </section>

                {/* Date */}
                <section>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Thời gian diễn ra
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-slate-600">Ngày giờ bắt đầu *</Label>
                      <Input type="datetime-local" {...form.register("StartTime")} className="rounded-xl h-11 border-slate-200 [color-scheme:light]" />
                      {form.formState.errors.StartTime && <p className="text-[11px] text-red-500">{form.formState.errors.StartTime.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-slate-600">Ngày giờ kết thúc *</Label>
                      <Input type="datetime-local" {...form.register("EndTime")} className="rounded-xl h-11 border-slate-200 [color-scheme:light]" />
                      {form.formState.errors.EndTime && <p className="text-[11px] text-red-500">{form.formState.errors.EndTime.message}</p>}
                    </div>
                  </div>
                </section>

                {/* Location */}
                <section>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Địa điểm tổ chức
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-slate-600">Tên địa điểm *</Label>
                      <Input {...form.register("Locations.0.Name")} placeholder="VD: Nhà thi đấu Phú Thọ" className="rounded-xl h-11 border-slate-200" />
                      {form.formState.errors.Locations?.[0]?.Name && <p className="text-[11px] text-red-500">{form.formState.errors.Locations[0].Name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[13px] font-bold text-slate-600">Địa chỉ cụ thể *</Label>
                      <Input {...form.register("Locations.0.Address")} placeholder="Số nhà, tên đường, quận/huyện..." className="rounded-xl h-11 border-slate-200" />
                      {form.formState.errors.Locations?.[0]?.Address && <p className="text-[11px] text-red-500">{form.formState.errors.Locations[0].Address.message}</p>}
                    </div>
                  </div>
                </section>

                {/* Description */}
                <section>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Mô tả sự kiện
                  </h3>
                  <div className="space-y-2">
                    <Textarea {...form.register("Description")} placeholder="Nội dung chi tiết, lịch trình, quy định tham gia..." className="min-h-[120px] rounded-xl resize-none border-slate-200" />
                    {form.formState.errors.Description && <p className="text-[11px] text-red-500">{form.formState.errors.Description.message}</p>}
                  </div>
                </section>
              </div>
            </div>

            <div className="flex justify-end pt-6 pb-6 px-6 md:px-8 border-t border-slate-100 shrink-0 bg-white">
              <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-full px-6 h-11 border-slate-200">
                Hủy
              </Button>
              <Button type="submit" disabled={create.isPending} className="rounded-full px-8 h-11 bg-slate-900 hover:bg-slate-800 font-bold ml-3">
                {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tiếp tục → Loại vé"}
              </Button>
            </div>
          </div>
        </form>
      )}

      {step === 2 && (
        <div className="p-8">
          <section>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Ticket className="w-4 h-4" /> Loại vé & số lượng theo khu vực
            </h3>
            <p className="text-slate-500 text-sm mb-6">Thêm các khu vực (VD: VIP, Standard, Với) với giá và số lượng vé.</p>

            <div className="space-y-4">
              {zones.map((z, i) => (
                <div key={i} className="flex flex-wrap items-end gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex-1 min-w-[140px] space-y-2">
                    <Label className="text-sm font-medium">Tên khu</Label>
                    <Input placeholder="VD: Khu VIP" value={z.name} onChange={(e) => updateZone(i, "name", e.target.value)} className="rounded-xl h-11" />
                  </div>
                  <div className="w-28 space-y-2">
                    <Label className="text-sm font-medium">Giá (VNĐ)</Label>
                    <Input type="number" min={0} placeholder="0" value={z.price || ""} onChange={(e) => updateZone(i, "price", e.target.value || 0)} className="rounded-xl h-11" />
                  </div>
                  <div className="w-28 space-y-2">
                    <Label className="text-sm font-medium">Số lượng vé</Label>
                    <Input type="number" min={0} placeholder="0" value={z.quantity || ""} onChange={(e) => updateZone(i, "quantity", e.target.value || 0)} className="rounded-xl h-11" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeZone(i)} disabled={zones.length === 1} className="h-11 w-11 rounded-xl text-red-500 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button type="button" variant="outline" onClick={addZone} className="mt-4 rounded-full border-dashed border-slate-300 text-slate-600 hover:bg-slate-50">
              <Plus className="w-4 h-4 mr-2" /> Thêm khu vực
            </Button>
          </section>

          <div className="flex justify-between pt-8 mt-8 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setStep(1)} className="rounded-full px-6 h-11 border-slate-200">
              <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
            </Button>
            <Button
              type="button"
              onClick={onTicketTypesSubmit}
              disabled={createTicketType.isPending}
              className="rounded-full px-8 h-11 bg-slate-900 hover:bg-slate-800 font-bold"
            >
              {createTicketType.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Hoàn tất"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
