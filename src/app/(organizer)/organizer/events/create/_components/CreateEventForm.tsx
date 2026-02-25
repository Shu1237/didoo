"use client";

import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
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
import { handleErrorApi } from "@/lib/errors";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const formatDateForInput = (date: Date) => {
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export default function CreateEventForm() {
  const router = useRouter();
  const { create } = useEvent();
  const { uploadImage } = useMedia();
  const { data: categoriesRes } = useGetCategories({ pageSize: 100 });
  const { data: userData, isLoading: isUserLoading } = useGetMe();
  const currentUser = userData?.data;
  const categories = categoriesRes?.data?.items || [];

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

  const onSubmit = async (values: EventCreateBody) => {
    try {
      const payload = {
        ...values,
        OrganizerId: values.OrganizerId || currentUser?.organizerId || "",
      };
      await create.mutateAsync(payload);
      toast.success("Tạo sự kiện thành công!");
      router.push("/organizer/events");
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  const onError = () => {
    toast.error("Vui lòng kiểm tra lại các trường thông tin bắt buộc!");
  };

  const thumbnailUrl = form.watch("ThumbnailUrl");
  const bannerUrl = form.watch("BannerUrl");

  if (isUserLoading) {
    return (
      <Card className="p-8 flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (!currentUser?.organizerId) {
    return (
      <Card className="p-8 border-amber-200 bg-amber-50/50">
        <p className="text-amber-800 font-medium">
          Bạn cần tạo hồ sơ tổ chức trước khi tạo sự kiện. Vui lòng hoàn thành tại{" "}
          <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/organizer/profile")}>
            Hồ sơ tổ chức
          </Button>
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
        <input type="hidden" {...form.register("OrganizerId")} />
        <input type="hidden" {...form.register("AgeRestriction")} />

        {/* Media */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Thumbnail (1:1/4:3) *</Label>
            <div
              onClick={() => thumbnailInputRef.current?.click()}
              className="aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-zinc-200 hover:border-primary/50 transition-all bg-zinc-50 flex items-center justify-center cursor-pointer group relative"
            >
              {thumbnailUrl ? (
                <img src={thumbnailUrl} className="w-full h-full object-cover" alt="Thumbnail" />
              ) : (
                <div className="text-zinc-300 flex flex-col items-center gap-2">
                  {uploadImage.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-8 h-8" />}
                  <span className="text-xs">Chọn ảnh</span>
                </div>
              )}
              <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "ThumbnailUrl")} />
            </div>
            {form.formState.errors.ThumbnailUrl && <p className="text-xs text-red-500">{form.formState.errors.ThumbnailUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Banner (16:9)</Label>
            <div
              onClick={() => bannerInputRef.current?.click()}
              className="aspect-[16/9] rounded-2xl overflow-hidden border-2 border-dashed border-zinc-200 hover:border-primary/50 transition-all bg-zinc-50 flex items-center justify-center cursor-pointer group relative"
            >
              {bannerUrl ? (
                <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
              ) : (
                <div className="text-zinc-300 flex flex-col items-center gap-2">
                  {uploadImage.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-8 h-8" />}
                  <span className="text-xs">Chọn banner</span>
                </div>
              )}
              <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "BannerUrl")} />
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="Name">Tên sự kiện *</Label>
            <Input id="Name" {...form.register("Name")} placeholder="Nhập tên sự kiện" className="rounded-xl" />
            {form.formState.errors.Name && <p className="text-xs text-red-500">{form.formState.errors.Name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="Slug">Slug *</Label>
            <Input id="Slug" {...form.register("Slug")} placeholder="slug-su-kien" className="rounded-xl" />
            {form.formState.errors.Slug && <p className="text-xs text-red-500">{form.formState.errors.Slug.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Danh mục *</Label>
            <Select onValueChange={(val) => form.setValue("CategoryId", val)} value={form.watch("CategoryId")}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.CategoryId && <p className="text-xs text-red-500">{form.formState.errors.CategoryId.message}</p>}
          </div>
        </div>

        {/* Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="StartTime">Ngày bắt đầu *</Label>
            <Input id="StartTime" type="datetime-local" {...form.register("StartTime")} className="rounded-xl" />
            {form.formState.errors.StartTime && <p className="text-xs text-red-500">{form.formState.errors.StartTime.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="EndTime">Ngày kết thúc *</Label>
            <Input id="EndTime" type="datetime-local" {...form.register("EndTime")} className="rounded-xl" />
            {form.formState.errors.EndTime && <p className="text-xs text-red-500">{form.formState.errors.EndTime.message}</p>}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Địa điểm tổ chức *
          </Label>
          <Input
            placeholder="Tên địa điểm (VD: Nhà thi đấu Phú Thọ)"
            className="rounded-xl"
            {...form.register("Locations.0.Name")}
          />
          <Input
            placeholder="Địa chỉ cụ thể (Số nhà, Tên đường...)"
            className="rounded-xl"
            {...form.register("Locations.0.Address")}
          />
          {form.formState.errors.Locations?.[0]?.Name && <p className="text-xs text-red-500">{form.formState.errors.Locations[0].Name.message}</p>}
          {form.formState.errors.Locations?.[0]?.Address && <p className="text-xs text-red-500">{form.formState.errors.Locations[0].Address.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="Description">Mô tả sự kiện *</Label>
          <Textarea
            id="Description"
            {...form.register("Description")}
            placeholder="Nội dung sự kiện, lịch trình chi tiết..."
            className="min-h-[120px] rounded-xl resize-none"
          />
          {form.formState.errors.Description && <p className="text-xs text-red-500">{form.formState.errors.Description.message}</p>}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-xl">
            Hủy
          </Button>
          <Button type="submit" disabled={create.isPending} className="rounded-xl">
            {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tạo sự kiện"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
