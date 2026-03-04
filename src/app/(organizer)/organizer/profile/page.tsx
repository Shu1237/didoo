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
import {
    Camera,
    Globe,
    Facebook,
    Instagram,
    Save,
    Loader2,
    Mail,
    Phone,
    Info,
} from "lucide-react";
import { toast } from "sonner";

export default function OrganizerProfilePage() {
    const { data: userData, isLoading: isUserLoading } = useGetMe();
    const { data: organizerRes, isLoading: isOrgLoading } =
        useGetOrganizer(userData?.data?.organizerId || "");
    const { update } = useOrganizer();
    const { uploadImage } = useMedia();

    const form = useForm<OrganizerUpdateBody>({
        resolver: zodResolver(organizerUpdateSchema),
        values: organizerRes?.data
            ? {
                id: organizerRes.data.id,
                Name: organizerRes.data.name || "",
                Slug: organizerRes.data.slug || "",
                Description: organizerRes.data.description || "",
                Email: organizerRes.data.email || "",
                Phone: organizerRes.data.phone || "",
                WebsiteUrl: organizerRes.data.websiteUrl || "",
                FacebookUrl: organizerRes.data.facebookUrl || "",
                InstagramUrl: organizerRes.data.instagramUrl || "",
                TiktokUrl: organizerRes.data.tiktokUrl || "",
                LogoUrl: organizerRes.data.logoUrl || "",
                BannerUrl: organizerRes.data.bannerUrl || "",
            }
            : ({} as any),
    });

    if (isUserLoading || isOrgLoading) return <Loading />;

    const handleUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        field: "LogoUrl" | "BannerUrl"
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const result = await uploadImage.mutateAsync(file);
        form.setValue(field, result.secure_url);
    };

    const onSubmit = (values: OrganizerUpdateBody) => {
        const id = userData?.data?.organizerId;
        if (!id) {
            toast.error("Không tìm thấy ID nhà tổ chức");
            return;
        }
        update.mutate(
            { id, body: values },
            { onSuccess: () => toast.success("Đã lưu thay đổi") }
        );
    };

    return (
        <div className="max-w-[1400px] mx-auto p-6 space-y-8">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Hồ sơ Nhà tổ chức
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Quản lý thông tin và nhận diện thương hiệu
                    </p>
                </div>

                <Button
                    form="org-form"
                    type="submit"
                    disabled={update.isPending}
                    className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                >
                    {update.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Lưu
                </Button>
            </div>

            <form
                id="org-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-12 gap-6"
            >

                {/* LEFT - BRANDING */}
                <div className="col-span-12 lg:col-span-4 space-y-6">

                    <div className="bg-white rounded-2xl border p-5 space-y-5">

                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                            <Camera className="w-4 h-4 text-indigo-600" />
                            Hình ảnh
                        </div>

                        {/* Banner */}
                        <div>
                            <Label className="text-xs text-zinc-400">
                                Banner (21:9)
                            </Label>

                            <div
                                onClick={() =>
                                    document.getElementById("banner-input")?.click()
                                }
                                className="mt-2 aspect-[21/9] rounded-xl border border-dashed bg-zinc-50 overflow-hidden cursor-pointer"
                            >
                                {form.watch("BannerUrl") ? (
                                    <img
                                        src={form.watch("BannerUrl")}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-zinc-300">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Logo */}
                        <div>
                            <Label className="text-xs text-zinc-400">
                                Logo (1:1)
                            </Label>

                            <div
                                onClick={() =>
                                    document.getElementById("logo-input")?.click()
                                }
                                className="mt-2 w-24 h-24 rounded-xl border border-dashed bg-zinc-50 overflow-hidden cursor-pointer"
                            >
                                {form.watch("LogoUrl") ? (
                                    <img
                                        src={form.watch("LogoUrl")}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-zinc-300">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <input
                            id="banner-input"
                            type="file"
                            hidden
                            onChange={(e) => handleUpload(e, "BannerUrl")}
                        />
                        <input
                            id="logo-input"
                            type="file"
                            hidden
                            onChange={(e) => handleUpload(e, "LogoUrl")}
                        />
                    </div>
                </div>

                {/* RIGHT - INFO */}
                <div className="col-span-12 lg:col-span-8">

                    <div className="bg-white rounded-2xl border p-6 space-y-6">

                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
                            <Info className="w-4 h-4 text-indigo-600" />
                            Thông tin chi tiết
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div className="col-span-2">
                                <Label className="text-xs text-zinc-400">
                                    Tên nhà tổ chức
                                </Label>
                                <Input
                                    {...form.register("Name")}
                                    className="h-10 mt-1"
                                />
                            </div>

                            <div className="col-span-2">
                                <Label className="text-xs text-zinc-400">
                                    Slug
                                </Label>
                                <Input
                                    {...form.register("Slug")}
                                    className="h-10 mt-1 font-mono text-sm"
                                />
                            </div>

                            <div>
                                <Label className="text-xs text-zinc-400">
                                    Email
                                </Label>
                                <Input
                                    {...form.register("Email")}
                                    className="h-10 mt-1"
                                />
                            </div>

                            <div>
                                <Label className="text-xs text-zinc-400">
                                    Số điện thoại
                                </Label>
                                <Input
                                    {...form.register("Phone")}
                                    className="h-10 mt-1"
                                />
                            </div>

                            <div className="col-span-2">
                                <Label className="text-xs text-zinc-400">
                                    Mô tả
                                </Label>
                                <Textarea
                                    {...form.register("Description")}
                                    className="min-h-[100px] mt-1"
                                />
                            </div>

                            <div className="col-span-2 grid grid-cols-3 gap-3">
                                <Input
                                    {...form.register("WebsiteUrl")}
                                    placeholder="Website"
                                    className="h-10"
                                />
                                <Input
                                    {...form.register("FacebookUrl")}
                                    placeholder="Facebook"
                                    className="h-10"
                                />
                                <Input
                                    {...form.register("InstagramUrl")}
                                    placeholder="Instagram"
                                    className="h-10"
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
}