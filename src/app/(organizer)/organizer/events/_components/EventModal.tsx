"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, MapPin, Ticket, Clock, Info, AlignLeft, Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { EventCreateBody, eventCreateSchema, eventUpdateSchema } from "@/schemas/event";
import { useEvent } from "@/hooks/useEvent";
import { useMedia } from "@/hooks/useMedia";
import { useGetCategories } from "@/hooks/useCategory";
import { useGetTicketTypes } from "@/hooks/useTicketType";
import { Event } from "@/types/event";
import { EventStatus } from "@/utils/enum";
import { handleErrorApi } from "@/lib/errors";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useGetMe } from "@/hooks/useUser";

const formatDateForInput = (date: string | Date | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export type EventModalMode = "CREATE" | "EDIT" | "DETAIL";

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: EventModalMode;
    event?: Event;
    organizerId?: string;
}

export default function EventModal({ isOpen, onClose, mode, event, organizerId }: EventModalProps) {
    const isDetail = mode === "DETAIL";
    const title = mode === "CREATE" ? "Tạo sự kiện mới" : mode === "EDIT" ? "Chỉnh sửa sự kiện" : "Chi tiết sự kiện";

    const { create, update, updateStatus } = useEvent();
    const { uploadImage } = useMedia();
    const { data: categoriesRes } = useGetCategories({ pageNumber: 1, pageSize: 100 });
    const { data: ticketTypesRes } = useGetTicketTypes(
        { eventId: event?.id, pageNumber: 1, pageSize: 100 },
        { enabled: !!event?.id }
    );
    const { data: userData } = useGetMe();
    const currentUser = userData?.data;
    const categories = categoriesRes?.data?.items || [];
    const ticketTypes = ticketTypesRes?.data?.items || [];

    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<EventCreateBody>({
        resolver: zodResolver(mode === "EDIT" ? eventUpdateSchema : eventCreateSchema) as any,
        mode: "onTouched",
        defaultValues: {
            Name: "",
            Slug: "",
            Subtitle: "",
            Description: "",
            StartTime: formatDateForInput(new Date()) as any,
            EndTime: formatDateForInput(new Date()) as any,
            CategoryId: "",
            OrganizerId: organizerId || event?.organizer?.id || currentUser?.organizerId || "",
            Locations: [{ Name: "", Address: "" }],
            ThumbnailUrl: "",
            BannerUrl: "",
            AgeRestriction: 0,
        },
    });

    useEffect(() => {
        if (isOpen) {
            console.log("Modal Open - Mode:", mode, "Event:", event, "CurrentUser:", currentUser);
            if (mode === "EDIT" && event) {
                const resetData = {
                    Name: event.name,
                    Slug: event.slug,
                    Subtitle: event.subtitle || "",
                    Description: event.description,
                    StartTime: formatDateForInput(event.startTime) as any,
                    EndTime: formatDateForInput(event.endTime) as any,
                    CategoryId: event.category?.id || "",
                    OrganizerId: organizerId || event.organizer?.id || currentUser?.organizerId || "",
                    Locations: event.locations?.map(l => ({ Name: l.name, Address: l.address })) || [{ Name: "", Address: "" }],
                    ThumbnailUrl: event.thumbnailUrl || "",
                    BannerUrl: event.bannerUrl || "",
                    AgeRestriction: event.ageRestriction || 0,
                };
                console.log("Resetting form (EDIT) with:", resetData);
                form.reset(resetData);
            } else if (mode === "CREATE") {
                const resetData = {
                    Name: "",
                    Slug: "",
                    Subtitle: "",
                    Description: "",
                    StartTime: formatDateForInput(new Date()) as any,
                    EndTime: formatDateForInput(new Date()) as any,
                    CategoryId: "",
                    OrganizerId: organizerId || currentUser?.organizerId || "",
                    Locations: [{ Name: "", Address: "" }],
                    ThumbnailUrl: "",
                    BannerUrl: "",
                    AgeRestriction: 0,
                };
                console.log("Resetting form (CREATE) with:", resetData);
                form.reset(resetData);
            }
        }
    }, [isOpen, mode, event, form, currentUser, organizerId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: "ThumbnailUrl" | "BannerUrl") => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const result = await uploadImage.mutateAsync(file);
                form.setValue(field, result.secure_url);
            } catch (err) { }
        }
    };

    const onSubmit = async (values: EventCreateBody) => {
        try {
            if (mode === "CREATE") {
                await create.mutateAsync(values);
            } else if (mode === "EDIT" && event) {
                await update.mutateAsync({ id: event.id, body: values });
            }
            onClose();
        } catch (error) {
            console.error("Submission error:", error);
            handleErrorApi({ error, setError: form.setError });
        }
    };

    const onError = (errors: any) => {
        console.error("Validation errors:", errors);
        toast.error("Vui lòng kiểm tra lại các trường thông tin bắt buộc!");
    };

    const thumbnailUrl = form.watch("ThumbnailUrl");
    const bannerUrl = form.watch("BannerUrl");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl rounded-[32px] border-none bg-white p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="p-8 border-b border-zinc-100 bg-slate-50/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tighter text-zinc-900 uppercase">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-zinc-500 mt-1">
                                {isDetail ? "Thông tin chi tiết về sự kiện của bạn" : "Vui lòng điền đầy đủ thông tin bên dưới"}
                            </DialogDescription>
                        </div>
                        {isDetail && (
                            <div className="flex items-center gap-2">
                                <Badge className={`border-none font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full ${event?.status === EventStatus.PUBLISHED ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                                    {event?.status === EventStatus.PUBLISHED ? "Đã xuất bản" : "Bản nháp"}
                                </Badge>
                                {event?.status === EventStatus.DRAFT && (
                                    <Button
                                        size="sm"
                                        disabled={updateStatus.isPending}
                                        onClick={() => event?.id && updateStatus.mutate({ id: event.id, status: EventStatus.PUBLISHED })}
                                        className="rounded-full bg-primary hover:bg-primary/90 text-black font-bold text-[10px] uppercase"
                                    >
                                        {updateStatus.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Xuất bản"}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="p-8 max-h-[75vh] overflow-auto scrollbar-thin">
                    {isDetail ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="aspect-video rounded-[32px] overflow-hidden border border-zinc-100 shadow-sm relative group">
                                    <img src={event?.thumbnailUrl || "/placeholder-event.jpg"} className="w-full h-full object-cover" alt={event?.name} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black tracking-tighter text-zinc-900 leading-none">{event?.name}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="rounded-full border-zinc-200 text-zinc-600 font-bold px-3 py-1">
                                            {event?.category?.name}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-zinc-500 gap-2 text-sm font-bold bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{event?.locations?.[0]?.address || "Chưa cập nhật địa điểm"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 rounded-3xl border border-zinc-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-2 mb-3 text-zinc-400">
                                            <CalendarIcon className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Ngày bắt đầu</span>
                                        </div>
                                        <p className="text-sm font-black text-zinc-900">
                                            {event?.startTime ? new Date(event.startTime).toLocaleDateString("vi-VN") : "N/A"}
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-3xl border border-zinc-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-2 mb-3 text-zinc-400">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Thời gian</span>
                                        </div>
                                        <p className="text-sm font-black text-zinc-900">
                                            {event?.startTime ? new Date(event.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 rounded-[32px] border border-zinc-100 bg-primary/5">
                                    <div className="flex justify-between items-end mb-4">
                                        <div className="flex items-center gap-2">
                                            <Ticket className="w-5 h-5 text-primary" />
                                            <span className="text-sm font-black text-zinc-900 uppercase tracking-tight">Tình trạng vé</span>
                                        </div>
                                        <span className="text-sm font-black text-zinc-600">
                                            <b className="text-primary">{event?.sold || 0}</b> / {event?.total || 0}
                                        </span>
                                    </div>
                                    <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner p-0.5">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-sm"
                                            style={{ width: `${((event?.sold || 0) / (event?.total || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {ticketTypes.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-zinc-900 font-black text-sm uppercase tracking-widest">
                                            <Ticket className="w-4 h-4 text-primary" />
                                            Các loại vé
                                        </div>
                                        <div className="space-y-2">
                                            {ticketTypes.map((tt) => (
                                                <div key={tt.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm">
                                                    <div>
                                                        <p className="font-bold text-zinc-900">{tt.name}</p>
                                                        {tt.description && <p className="text-xs text-zinc-500 mt-0.5">{tt.description}</p>}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-primary">{Number(tt.price).toLocaleString("vi-VN")}đ</p>
                                                        <p className="text-[11px] text-zinc-500 font-bold">
                                                            Đã bán: <span className="text-zinc-700">{(tt.totalQuantity || 0) - (tt.availableQuantity || 0)}</span>
                                                            {" / "}
                                                            <span className="text-zinc-700">{tt.totalQuantity || 0}</span> vé
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-zinc-900 font-black text-sm uppercase tracking-widest">
                                        <AlignLeft className="w-4 h-4 text-primary" />
                                        Mô tả sự kiện
                                    </div>
                                    <div className="text-sm text-zinc-600 leading-relaxed p-6 rounded-[28px] bg-zinc-50/50 border border-zinc-100 font-medium">
                                        {event?.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form id="event-form" onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                {/* Media Pillar */}
                                <div className="md:col-span-4 space-y-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Thumbnail (1:1/4:3)</Label>
                                        <div
                                            onClick={() => thumbnailInputRef.current?.click()}
                                            className="aspect-square rounded-[32px] overflow-hidden border-2 border-dashed border-zinc-200 hover:border-primary/50 transition-all bg-zinc-50 flex items-center justify-center cursor-pointer group relative"
                                        >
                                            {thumbnailUrl ? (
                                                <img src={thumbnailUrl} className="w-full h-full object-cover" alt="Thumbnail" />
                                            ) : (
                                                <div className="text-zinc-300 flex flex-col items-center gap-2">
                                                    {uploadImage.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-8 h-8" />}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ImageIcon className="text-white w-6 h-6" />
                                            </div>
                                            <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "ThumbnailUrl")} />
                                        </div>
                                        {form.formState.errors.ThumbnailUrl && <p className="text-[10px] text-red-500 font-bold">{form.formState.errors.ThumbnailUrl.message}</p>}
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Banner (16:9)</Label>
                                        <div
                                            onClick={() => bannerInputRef.current?.click()}
                                            className="aspect-[16/9] rounded-3xl overflow-hidden border-2 border-dashed border-zinc-200 hover:border-primary/50 transition-all bg-zinc-50 flex items-center justify-center cursor-pointer group relative"
                                        >
                                            {bannerUrl ? (
                                                <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
                                            ) : (
                                                <div className="text-zinc-300 flex flex-col items-center gap-2">
                                                    {uploadImage.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <ImageIcon className="w-8 h-8" />}
                                                </div>
                                            )}
                                            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "BannerUrl")} />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Pillar */}
                                <div className="md:col-span-8 space-y-6">
                                    <input type="hidden" {...form.register("OrganizerId")} />
                                    <input type="hidden" {...form.register("AgeRestriction")} />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2">
                                            <Input {...form.register("Name")} placeholder="Tên sự kiện *" className="h-12 rounded-2xl border-zinc-200 focus:ring-primary/10 transition-all font-bold" />
                                            {form.formState.errors.Name && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.Name.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Input {...form.register("Slug")} placeholder="slug-su-kien *" className="h-12 rounded-2xl border-zinc-200 font-bold" />
                                            {form.formState.errors.Slug && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.Slug.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Select
                                                onValueChange={(val) => form.setValue("CategoryId", val)}
                                                value={form.watch("CategoryId")}
                                            >
                                                <SelectTrigger className="h-12 rounded-2xl border-zinc-200 font-bold text-zinc-500">
                                                    <SelectValue placeholder="Chọn danh mục *" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-zinc-100 shadow-xl">
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id} className="font-bold py-3">
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {form.formState.errors.CategoryId && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.CategoryId.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Ngày bắt đầu *</Label>
                                            <Input
                                                {...form.register("StartTime")}
                                                type="datetime-local"
                                                className="h-12 rounded-2xl border-zinc-200 font-bold"
                                            />
                                            {form.formState.errors.StartTime && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.StartTime.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Ngày kết thúc *</Label>
                                            <Input
                                                {...form.register("EndTime")}
                                                type="datetime-local"
                                                className="h-12 rounded-2xl border-zinc-200 font-bold"
                                            />
                                            {form.formState.errors.EndTime && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.EndTime.message}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Địa điểm tổ chức *</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                            <Input
                                                placeholder="Tên địa điểm (VD: Nhà thi đấu Phú Thọ) *"
                                                className="pl-11 h-12 rounded-2xl border-zinc-200 font-bold mb-2"
                                                {...form.register(`Locations.0.Name`)}
                                            />
                                        </div>
                                        <Input
                                            placeholder="Địa chỉ cụ thể (Số nhà, Tên đường...) *"
                                            className="h-12 rounded-2xl border-zinc-200 font-bold"
                                            {...form.register(`Locations.0.Address`)}
                                        />
                                        {form.formState.errors.Locations?.[0]?.Name && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.Locations[0].Name.message}</p>}
                                        {form.formState.errors.Locations?.[0]?.Address && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.Locations[0].Address.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Mô tả sự kiện *</Label>
                                        <Textarea
                                            {...form.register("Description")}
                                            placeholder="Nội dung sự kiện, lịch trình chi tiết..."
                                            className="min-h-[120px] rounded-[24px] border-zinc-200 focus:ring-primary/10 transition-all font-medium p-4 resize-none"
                                        />
                                        {form.formState.errors.Description && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.Description.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div className="p-8 border-t border-zinc-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <p className="text-[10px] text-zinc-400 font-bold italic">(*) Vui lòng kiểm tra kỹ thông tin trước khi lưu</p>
                    <div className="flex gap-4">
                        <Button variant="ghost" onClick={onClose} className="rounded-full px-8 font-black uppercase tracking-widest text-[10px] text-zinc-500 hover:bg-zinc-200 h-12 transition-all">
                            {isDetail ? "Đóng" : "Hủy bỏ"}
                        </Button>
                        {!isDetail && (
                            <Button
                                form="event-form"
                                type="submit"
                                disabled={create.isPending || update.isPending}
                                className="rounded-full px-10 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 h-12 transition-all active:scale-95 flex items-center gap-2"
                            >
                                {(create.isPending || update.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                {mode === "CREATE" ? "Tạo sự kiện ngay" : "Lưu thay đổi"}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Thêm icons còn thiếu
function Send({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
    )
}