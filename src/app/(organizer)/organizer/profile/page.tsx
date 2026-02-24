"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizerUpdateSchema, OrganizerUpdateBody } from "@/schemas/organizer";
import { useGetMe } from "@/hooks/useUser";
import { useOrganizer, useGetOrganizer } from "@/hooks/useOrganizer";
import { useMedia } from "@/hooks/useMedia";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Globe, Facebook, Instagram, Save, Loader2, Mail, Phone, Info } from "lucide-react";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/errors";

export default function OrganizerProfilePage() {
    const { data: userData, isLoading: isUserLoading } = useGetMe();
    const { data: organizerRes, isLoading: isOrgLoading } = useGetOrganizer(userData?.data?.organizerId || "");
    const { update } = useOrganizer();
    const { uploadImage } = useMedia();

    const form = useForm<OrganizerUpdateBody>({
        resolver: zodResolver(organizerUpdateSchema),
        values: organizerRes?.data ? {
            id: organizerRes.data.id,
            Name: organizerRes.data.name || "",
            Description: organizerRes.data.description || "",
            Email: organizerRes.data.email || "",
            Phone: organizerRes.data.phone || "",
            WebsiteUrl: organizerRes.data.websiteUrl || "",
            FacebookUrl: organizerRes.data.facebookUrl || "",
            InstagramUrl: organizerRes.data.instagramUrl || "",
            TiktokUrl: organizerRes.data.tiktokUrl || "",
            LogoUrl: organizerRes.data.logoUrl || "",
            BannerUrl: organizerRes.data.bannerUrl || "",
        } : {} as any,
    });

    if (isUserLoading || isOrgLoading) return <Loading />;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "LogoUrl" | "BannerUrl") => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const result = await uploadImage.mutateAsync(file);
            form.setValue(field, result.secure_url);
            toast.success("Tải ảnh lên thành công!");
        } catch (err) {
            handleErrorApi({ error: err });
        }
    };

    const onSubmit = (values: OrganizerUpdateBody) => {
        const id = userData?.data?.organizerId;
        if (!id) {
            toast.error("Không tìm thấy ID nhà tổ chức");
            return;
        }
        update.mutate({ id, body: values });
    };

    return (
        <div className="flex flex-col h-full max-w-[1600px] mx-auto p-4 lg:p-8">
            {/* Header: Đưa Save button lên đây để tiết kiệm diện tích */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">Hồ sơ Nhà tổ chức</h1>
                    <p className="text-zinc-500 font-medium">Quản lý nhận diện thương hiệu và thông tin liên lạc</p>
                </div>
                <Button
                    form="org-form"
                    type="submit"
                    disabled={update.isPending}
                    className="h-12 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 gap-2 transition-all active:scale-95"
                >
                    {update.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    LƯU THAY ĐỔI
                </Button>
            </div>

            <form id="org-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 gap-8">

                {/* CỘT TRÁI: BRANDING (4/12) */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <div className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Camera className="w-5 h-5 text-indigo-600" />
                            <span className="font-black text-sm uppercase tracking-wider text-zinc-700">Hình ảnh thương hiệu</span>
                        </div>

                        {/* Banner: Tỉ lệ 21:9 chuẩn */}
                        <div className="space-y-3">
                            <Label className="text-[11px] font-black uppercase text-zinc-400 ml-1">Banner trang chủ (21:9)</Label>
                            <div
                                onClick={() => document.getElementById('banner-input')?.click()}
                                className="relative aspect-[21/9] rounded-[24px] bg-zinc-50 border-2 border-dashed border-zinc-200 overflow-hidden group cursor-pointer hover:border-indigo-400 transition-all shadow-inner"
                            >
                                {form.watch("BannerUrl") ? (
                                    <img src={form.watch("BannerUrl")} className="w-full h-full object-cover" alt="Banner" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-zinc-300 gap-2">
                                        <Camera className="w-8 h-8" />
                                        <span className="text-xs font-bold uppercase italic">Chọn ảnh banner</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center" />
                            </div>
                        </div>

                        {/* Logo: To và rõ ràng */}
                        <div className="flex items-start gap-6 pt-2">
                            <div
                                onClick={() => document.getElementById('logo-input')?.click()}
                                className="relative w-32 h-32 rounded-[24px] bg-zinc-50 border-2 border-dashed border-zinc-200 overflow-hidden group cursor-pointer hover:border-indigo-400 transition-all shrink-0"
                            >
                                {form.watch("LogoUrl") ? (
                                    <img src={form.watch("LogoUrl")} className="w-full h-full object-cover" alt="Logo" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-zinc-300"><Camera className="w-8 h-8" /></div>
                                )}
                            </div>
                            <div className="space-y-2 py-2">
                                <Label className="text-[11px] font-black uppercase text-zinc-400">Logo đơn vị (1:1)</Label>
                                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                                    Khuyên dùng ảnh vuông (.png hoặc .svg) có nền trong suốt để hiển thị chuyên nghiệp nhất trên các nền khác nhau.
                                </p>
                            </div>
                        </div>

                        <input id="banner-input" type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "BannerUrl")} />
                        <input id="logo-input" type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "LogoUrl")} />
                    </div>
                </div>

                {/* CỘT PHẢI: INFORMATION (7/12) */}
                <div className="col-span-12 lg:col-span-7 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-5 h-5 text-indigo-600" />
                            <span className="font-black text-sm uppercase tracking-wider text-zinc-700">Thông tin chi tiết</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-2">
                                <Label className="text-[11px] font-black uppercase text-zinc-400 ml-1">Tên nhà tổ chức *</Label>
                                <Input {...form.register("Name")} placeholder="VD: Didoo Entertainment" className="h-12 rounded-xl bg-zinc-50/50 border-zinc-200 focus:bg-white font-bold text-lg" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase text-zinc-400 ml-1">Email liên hệ</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input {...form.register("Email")} className="pl-12 h-12 rounded-xl bg-zinc-50/50 border-zinc-200 font-bold" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase text-zinc-400 ml-1">Số điện thoại</Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input {...form.register("Phone")} className="pl-12 h-12 rounded-xl bg-zinc-50/50 border-zinc-200 font-bold" />
                                </div>
                            </div>

                            <div className="col-span-2 space-y-2">
                                <Label className="text-[11px] font-black uppercase text-zinc-400 ml-1">Mô tả giới thiệu</Label>
                                <Textarea {...form.register("Description")} className="min-h-[120px] rounded-2xl bg-zinc-50/50 border-zinc-200 p-4 font-medium resize-none" placeholder="Chia sẻ tầm nhìn và sứ mệnh của bạn..." />
                            </div>

                            <div className="col-span-2 grid grid-cols-3 gap-4 pt-2">
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input {...form.register("WebsiteUrl")} placeholder="Website" className="pl-12 h-12 rounded-xl bg-zinc-50/50 border-zinc-200 text-sm font-bold" />
                                </div>
                                <div className="relative">
                                    <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input {...form.register("FacebookUrl")} placeholder="Facebook" className="pl-12 h-12 rounded-xl bg-zinc-50/50 border-zinc-200 text-sm font-bold" />
                                </div>
                                <div className="relative">
                                    <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input {...form.register("InstagramUrl")} placeholder="Instagram" className="pl-12 h-12 rounded-xl bg-zinc-50/50 border-zinc-200 text-sm font-bold" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}