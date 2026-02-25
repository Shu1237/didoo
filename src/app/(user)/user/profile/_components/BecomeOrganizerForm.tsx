"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizerCreateBody, organizerCreateSchema } from "@/schemas/organizer";
import { useOrganizer } from "@/hooks/useOrganizer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";
import { Loader2, Send, Plus, Image as ImageIcon, Globe, Facebook, Instagram, Music2 } from "lucide-react";
import { handleErrorApi } from "@/lib/errors";
import { useMedia } from "@/hooks/useMedia";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function BecomeOrganizerForm({ onSuccess }: { onSuccess?: () => void }) {
    const { create } = useOrganizer();
    const { uploadImage } = useMedia();
    const logoInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<OrganizerCreateBody>({
        resolver: zodResolver(organizerCreateSchema),
        mode: "onTouched",
        defaultValues: {
            Name: "",
            Slug: "",
            Description: "",
            Email: "",
            Phone: "",
            Address: "",
            WebsiteUrl: "",
            FacebookUrl: "",
            InstagramUrl: "",
            TiktokUrl: "",
            LogoUrl: "",
            BannerUrl: "",
        },
    });

    const logoUrl = form.watch("LogoUrl");
    const bannerUrl = form.watch("BannerUrl");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "LogoUrl" | "BannerUrl") => {
        const file = e.target.files?.[0];
        if (file) {
            const result = await uploadImage.mutateAsync(file);
            form.setValue(field, result.secure_url);
        }
    };

    const onSubmit = async (values: OrganizerCreateBody) => {
        try {
            await create.mutateAsync(values);
            if (onSuccess) onSuccess();
        } catch (error) {
            handleErrorApi({ error, setError: form.setError });
        }
    };

    return (
        <div className="bg-white overflow-hidden rounded-[32px] w-full max-w-4xl mx-auto border border-slate-200 shadow-2xl">
            <div className="bg-slate-50/80 border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        Đăng ký Organizer
                    </h2>
                    <p className="text-[10px] text-slate-500 font-medium">Bắt đầu hành trình tổ chức sự kiện chuyên nghiệp</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> */}
                    {/* <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Trạng thái: Sẵn sàng</span> */}
                </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Column: Media & Core Info */}
                    <div className="md:col-span-4 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                            {/* Logo */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logo tổ chức</label>
                                <div
                                    onClick={() => logoInputRef.current?.click()}
                                    className="relative group cursor-pointer aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-primary/50 transition-all bg-slate-50 flex items-center justify-center"
                                >
                                    <Avatar className="w-full h-full rounded-none">
                                        <AvatarImage src={logoUrl || ""} className="object-cover" />
                                        <AvatarFallback className="bg-transparent text-slate-300">
                                            {uploadImage.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <ImageIcon className="text-white w-5 h-5" />
                                    </div>
                                    <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "LogoUrl")} />
                                </div>
                            </div>
                            {/* Banner snippet */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ảnh bìa (Banner)</label>
                                <div
                                    onClick={() => bannerInputRef.current?.click()}
                                    className="relative group cursor-pointer aspect-[16/9] md:aspect-[3/1] rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-primary/50 transition-all bg-slate-50 flex items-center justify-center"
                                >
                                    {bannerUrl ? (
                                        <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
                                    ) : (
                                        <div className="text-slate-300 flex flex-col items-center">
                                            {uploadImage.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                                        </div>
                                    )}
                                    <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "BannerUrl")} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <Input {...form.register("Name")} placeholder="Tên tổ chức *" className="rounded-xl h-10 text-sm border-slate-200 focus:ring-slate-100" />
                                {form.formState.errors.Name && <p className="text-[10px] text-red-500 mt-1 pl-1">{form.formState.errors.Name.message}</p>}
                            </div>
                            <div>
                                <Input {...form.register("Slug")} placeholder="slug-to-chuc *" className="rounded-xl h-10 text-sm border-slate-200" />
                                {form.formState.errors.Slug && <p className="text-[10px] text-red-500 mt-1 pl-1">{form.formState.errors.Slug.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info & Social */}
                    <div className="md:col-span-8 flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <Input {...form.register("Email")} placeholder="Email liên hệ *" className="rounded-xl h-10 text-sm border-slate-200" />
                                {form.formState.errors.Email && <p className="text-[10px] text-red-500 mt-1 pl-1">{form.formState.errors.Email.message}</p>}
                            </div>
                            <div>
                                <Input {...form.register("Phone")} placeholder="Số điện thoại *" className="rounded-xl h-10 text-sm border-slate-200" />
                                {form.formState.errors.Phone && <p className="text-[10px] text-red-500 mt-1 pl-1">{form.formState.errors.Phone.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <Input {...form.register("WebsiteUrl")} placeholder="Trang web" className="rounded-xl pl-9 h-10 text-sm bg-slate-50/30 border-slate-200" />
                                </div>
                                {form.formState.errors.WebsiteUrl && <p className="text-[10px] text-red-500 mt-1 pl-1">{form.formState.errors.WebsiteUrl.message}</p>}
                            </div>
                            <div>
                                <div className="relative">
                                    <Facebook className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <Input {...form.register("FacebookUrl")} placeholder="Facebook" className="rounded-xl pl-9 h-10 text-sm bg-slate-50/30 border-slate-200" />
                                </div>
                                {form.formState.errors.FacebookUrl && <p className="text-[10px] text-red-500 mt-1 pl-1">{form.formState.errors.FacebookUrl.message}</p>}
                            </div>
                            <div>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <Input {...form.register("InstagramUrl")} placeholder="Instagram" className="rounded-xl pl-9 h-10 text-sm bg-slate-50/30 border-slate-200" />
                                </div>
                                {form.formState.errors.InstagramUrl && <p className="text-[10px] text-red-500 mt-1 pl-1">{form.formState.errors.InstagramUrl.message}</p>}
                            </div>
                            <div>
                                <div className="relative">
                                    <Music2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                    <Input {...form.register("TiktokUrl")} placeholder="TikTok" className="rounded-xl pl-9 h-10 text-sm bg-slate-50/30 border-slate-200" />
                                </div>
                                {form.formState.errors.TiktokUrl && <p className="text-[10px] text-red-500 mt-1 pl-1">{form.formState.errors.TiktokUrl.message}</p>}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col min-h-[80px]">
                            <Textarea {...form.register("Description")} placeholder="Mô tả ngắn gọn về tổ chức của bạn..." className="rounded-xl min-h-[80px] text-sm bg-slate-50/30 border-slate-200 flex-1" />
                            {form.formState.errors.Description && <p className="text-[10px] text-red-500 mt-1 pl-1">{form.formState.errors.Description.message}</p>}
                        </div>

                        <div>
                            <Input {...form.register("Address")} placeholder="Địa chỉ trụ sở chính" className="rounded-xl h-10 text-sm bg-slate-50/30 border-slate-200" />
                            {form.formState.errors.Address && <p className="text-[10px] text-red-500 mt-1 pl-1">{form.formState.errors.Address.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400">(*) Các thông tin bắt buộc phải điền đầy đủ</p>
                    <Button
                        type="submit"
                        disabled={create.isPending}
                        className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 font-bold h-10 flex items-center gap-2 transition-all active:scale-95"
                    >
                        {create.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3 h-3" />}
                        Gửi hồ sơ ngay
                    </Button>
                </div>
            </form>
        </div>
    );
}
