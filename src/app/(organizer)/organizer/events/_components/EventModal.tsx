"use client";

import { useEffect, useRef, useState } from "react";
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
import { Calendar as CalendarIcon, MapPin, Ticket, Clock, Info, AlignLeft, Loader2, Plus, Image as ImageIcon, Trash2 } from "lucide-react";
import { EventCreateBody, eventCreateSchema, eventUpdateSchema } from "@/schemas/event";
import { useEvent } from "@/hooks/useEvent";
import { useMedia } from "@/hooks/useMedia";
import { useGetCategories } from "@/hooks/useCategory";
import { useGetTicketTypes, useTicketType } from "@/hooks/useTicketType";
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
    const { create: createTicketType, update: updateTicketType, deleteTicketType } = useTicketType();
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

    const [zones, setZones] = useState<{ id?: string, name: string, price: number, quantity: number }[]>([]);

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

                if (ticketTypes.length > 0) {
                    setZones(ticketTypes.map(tt => ({
                        id: tt.id,
                        name: tt.name,
                        price: Number(tt.price),
                        quantity: Number(tt.totalQuantity)
                    })));
                } else {
                    setZones([{ name: "", price: 0, quantity: 0 }]);
                }
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
                setZones([{ name: "", price: 0, quantity: 0 }]);
            }
        }
    }, [isOpen, mode, event, form, currentUser, organizerId, ticketTypes.length]);

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
            let eventId = event?.id;
            if (mode === "CREATE") {
                const result = await create.mutateAsync(values);
                eventId = result.id;
            } else if (mode === "EDIT" && event) {
                await update.mutateAsync({ id: event.id, body: values });
            }

            if (eventId) {
                const validZones = zones.filter((z: { name: string; quantity: number }) => z.name.trim() && z.quantity > 0);
                for (const z of validZones) {
                    if (z.id) {
                        await updateTicketType.mutateAsync({
                            id: z.id,
                            body: {
                                name: z.name.trim(),
                                price: Number(z.price),
                                totalQuantity: Number(z.quantity),
                                availableQuantity: Number(z.quantity),
                            }
                        });
                    } else {
                        await createTicketType.mutateAsync({
                            eventId: eventId,
                            name: z.name.trim(),
                            price: Number(z.price),
                            totalQuantity: Number(z.quantity),
                            availableQuantity: Number(z.quantity),
                        });
                    }
                }
            }

            toast.success(mode === "CREATE" ? "Tạo sự kiện thành công!" : "Cập nhật sự kiện thành công!");
            onClose();
        } catch (error) {
            console.error("Submission error:", error);
            handleErrorApi({ error, setError: form.setError });
        }
    };

    const addZone = () => setZones((prev: any[]) => [...prev, { name: "", price: 0, quantity: 0 }]);
    const removeZone = async (i: number) => {
        const zoneToRemove = zones[i];
        if (zoneToRemove.id) {
            if (window.confirm("Bạn có chắc muốn xóa loại vé này?")) {
                await deleteTicketType.mutateAsync(zoneToRemove.id);
            } else {
                return;
            }
        }
        setZones((prev: any[]) => prev.filter((_, idx) => idx !== i));
    };
    const updateZone = (i: number, field: string, value: string | number) => {
        setZones((prev: any[]) => {
            const next = [...prev];
            next[i] = { ...next[i], [field]: value };
            return next;
        });
    };

    const onError = (errors: any) => {
        console.error("Validation errors:", errors);
        toast.error("Vui lòng kiểm tra lại các trường thông tin bắt buộc!");
    };

    const thumbnailUrl = form.watch("ThumbnailUrl");
    const bannerUrl = form.watch("BannerUrl");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl rounded-2xl border-none bg-white p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="p-6 border-b border-zinc-100 bg-slate-50/50">
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
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className={`border-none font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-full ${event?.status === EventStatus.PUBLISHED ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                                    {event?.status === EventStatus.PUBLISHED ? "Đã xuất bản" : "Bản nháp"}
                                </Badge>
                                {event?.status === EventStatus.DRAFT && (
                                    <Button
                                        size="sm"
                                        disabled={updateStatus.isPending}
                                        onClick={() => event?.id && updateStatus.mutate({ id: event.id, status: EventStatus.PUBLISHED })}
                                        className="rounded-full bg-zinc-900 hover:bg-black text-white font-black text-[9px] uppercase tracking-wider h-8 px-5 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                    >
                                        {updateStatus.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                        {updateStatus.isPending ? "" : "Xuất bản"}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="p-6 max-h-[75vh] overflow-auto scrollbar-thin">
                    {isDetail ? (
                        <div className="grid grid-cols-12 gap-8">
                            {/* Media Pillar */}
                            <div className="col-span-3 space-y-4">
                                <div className="aspect-square rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
                                    <img src={event?.thumbnailUrl || "/placeholder-event.jpg"} className="w-full h-full object-cover" alt={event?.name} />
                                </div>
                                {event?.bannerUrl && (
                                    <div className="aspect-video rounded-2xl overflow-hidden border border-zinc-100 shadow-sm">
                                        <img src={event.bannerUrl} className="w-full h-full object-cover" alt="Banner" />
                                    </div>
                                )}
                            </div>

                            {/* Content Pillar */}
                            <div className="col-span-9 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="text-3xl font-black tracking-tighter text-zinc-900 leading-tight">{event?.name}</h3>
                                        <Badge variant="outline" className="rounded-full border-zinc-200 text-zinc-600 font-bold px-3 py-1 shrink-0">
                                            {event?.category?.name}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center text-zinc-500 gap-2 text-sm font-semibold bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{event?.locations?.[0]?.address || "Chưa cập nhật địa điểm"}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl border border-zinc-100 bg-white shadow-sm">
                                        <div className="flex items-center gap-2 mb-2 text-zinc-400">
                                            <CalendarIcon className="w-3.5 h-3.5" />
                                            <span className="text-[9px] font-black uppercase tracking-widest font-mono">Ngày bắt đầu</span>
                                        </div>
                                        <p className="text-sm font-bold text-zinc-900">
                                            {event?.startTime ? new Date(event.startTime).toLocaleDateString("vi-VN") : "N/A"}
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl border border-zinc-100 bg-white shadow-sm">
                                        <div className="flex items-center gap-2 mb-2 text-zinc-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[9px] font-black uppercase tracking-widest font-mono">Thời gian</span>
                                        </div>
                                        <p className="text-sm font-bold text-zinc-900">
                                            {event?.startTime ? new Date(event.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl border border-zinc-100 bg-primary/5">
                                    <div className="flex justify-between items-end mb-3">
                                        <div className="flex items-center gap-2">
                                            <Ticket className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">Tình trạng vé</span>
                                        </div>
                                        <span className="text-xs font-black text-zinc-600">
                                            <b className="text-primary">{event?.sold || 0}</b> / {event?.total || 0}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-200/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${((event?.sold || 0) / (event?.total || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {ticketTypes.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest ml-1">
                                            <Ticket className="w-3.5 h-3.5" />
                                            Các loại vé
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {ticketTypes.map((tt) => (
                                                <div key={tt.id} className="group flex items-center justify-between p-3 rounded-xl bg-white border border-zinc-100 hover:border-primary/20 transition-all">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-sm text-zinc-900">{tt.name}</p>
                                                            <Badge variant="secondary" className="text-[8px] font-black uppercase px-2 py-0 bg-emerald-100 text-emerald-700">
                                                                {tt.availableQuantity > 0 ? "Còn vé" : "Hết vé"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-base text-zinc-900 tracking-tight">
                                                            {Number(tt.price).toLocaleString("vi-VN")}<span className="text-[9px] ml-0.5">Đ</span>
                                                        </p>
                                                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">
                                                            <span className="text-primary">{(tt.totalQuantity || 0) - (tt.availableQuantity || 0)}</span>
                                                            <span className="mx-1">/</span>
                                                            <span>{tt.totalQuantity || 0}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-zinc-400 font-bold text-[10px] uppercase tracking-widest ml-1">
                                        <AlignLeft className="w-3.5 h-3.5" />
                                        Mô tả sự kiện
                                    </div>
                                    <div className="text-sm text-zinc-600 leading-relaxed p-5 rounded-2xl bg-zinc-50 border border-zinc-100 font-medium">
                                        {event?.description}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form id="event-form" onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                                {/* Media Pillar */}
                                <div className="md:col-span-3 space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Thumbnail *</Label>
                                        <div
                                            onClick={() => thumbnailInputRef.current?.click()}
                                            className="aspect-square rounded-2xl overflow-hidden border border-zinc-200 hover:border-primary/50 transition-all bg-zinc-50 flex items-center justify-center cursor-pointer group relative shadow-sm"
                                        >
                                            {thumbnailUrl ? (
                                                <img src={thumbnailUrl} className="w-full h-full object-cover" alt="Thumbnail" />
                                            ) : (
                                                <div className="text-zinc-300 flex flex-col items-center gap-2">
                                                    {uploadImage.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-6 h-6" />}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ImageIcon className="text-white w-5 h-5" />
                                            </div>
                                            <input type="file" ref={thumbnailInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "ThumbnailUrl")} />
                                        </div>
                                        {form.formState.errors.ThumbnailUrl && <p className="text-[9px] text-red-500 font-bold">{form.formState.errors.ThumbnailUrl.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Banner</Label>
                                        <div
                                            onClick={() => bannerInputRef.current?.click()}
                                            className="aspect-video rounded-2xl overflow-hidden border border-zinc-200 hover:border-primary/50 transition-all bg-zinc-50 flex items-center justify-center cursor-pointer group relative shadow-sm"
                                        >
                                            {bannerUrl ? (
                                                <img src={bannerUrl} className="w-full h-full object-cover" alt="Banner" />
                                            ) : (
                                                <div className="text-zinc-300 flex flex-col items-center gap-2">
                                                    {uploadImage.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-6 h-6" />}
                                                </div>
                                            )}
                                            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "BannerUrl")} />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Pillar */}
                                <div className="md:col-span-9 space-y-5">
                                    <input type="hidden" {...form.register("OrganizerId")} />
                                    <input type="hidden" {...form.register("AgeRestriction")} />

                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-12 space-y-1.5">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tên sự kiện *</Label>
                                            <Input {...form.register("Name")} placeholder="Tên sự kiện" className="h-9 rounded-xl border-zinc-200 focus:ring-primary/10 transition-all font-bold" />
                                            {form.formState.errors.Name && <p className="text-[9px] text-red-500 font-bold ml-1">{form.formState.errors.Name.message}</p>}
                                        </div>

                                        <div className="col-span-12 md:col-span-4 space-y-1.5">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Slug *</Label>
                                            <Input {...form.register("Slug")} placeholder="slug-su-kien" className="h-9 rounded-xl border-zinc-200 font-bold" />
                                            {form.formState.errors.Slug && <p className="text-[9px] text-red-500 font-bold ml-1">{form.formState.errors.Slug.message}</p>}
                                        </div>

                                        <div className="col-span-12 md:col-span-4 space-y-1.5">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Danh mục *</Label>
                                            <Select
                                                onValueChange={(val) => form.setValue("CategoryId", val)}
                                                value={form.watch("CategoryId")}
                                            >
                                                <SelectTrigger className="h-9 rounded-xl border-zinc-200 font-bold text-zinc-500">
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id} className="font-bold py-2">
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {form.formState.errors.CategoryId && <p className="text-[9px] text-red-500 font-bold ml-1">{form.formState.errors.CategoryId.message}</p>}
                                        </div>

                                        <div className="col-span-12 md:col-span-4 space-y-1.5">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Phụ đề</Label>
                                            <Input {...form.register("Subtitle")} placeholder="Phụ đề sự kiện" className="h-9 rounded-xl border-zinc-200 font-bold" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Ngày bắt đầu *</Label>
                                            <Input
                                                {...form.register("StartTime")}
                                                type="datetime-local"
                                                className="h-9 rounded-xl border-zinc-200 font-bold"
                                            />
                                            {form.formState.errors.StartTime && <p className="text-[9px] text-red-500 font-bold ml-1">{form.formState.errors.StartTime.message}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Ngày kết thúc *</Label>
                                            <Input
                                                {...form.register("EndTime")}
                                                type="datetime-local"
                                                className="h-9 rounded-xl border-zinc-200 font-bold"
                                            />
                                            {form.formState.errors.EndTime && <p className="text-[9px] text-red-500 font-bold ml-1">{form.formState.errors.EndTime.message}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Tên địa điểm *</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                                                <Input
                                                    placeholder="VD: Nhà thi đấu Phú Thọ"
                                                    className="pl-9 h-9 rounded-xl border-zinc-200 font-bold"
                                                    {...form.register(`Locations.0.Name`)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Địa chỉ *</Label>
                                            <Input
                                                placeholder="VD: 1 Lữ Gia, P.15, Q.11"
                                                className="h-9 rounded-xl border-zinc-200 font-bold"
                                                {...form.register(`Locations.0.Address`)}
                                            />
                                        </div>
                                    </div>
                                    {form.formState.errors.Locations?.[0]?.Name && <p className="text-[9px] text-red-500 font-bold ml-1">{form.formState.errors.Locations[0].Name.message}</p>}
                                    {form.formState.errors.Locations?.[0]?.Address && <p className="text-[9px] text-red-500 font-bold ml-1">{form.formState.errors.Locations[0].Address.message}</p>}

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Mô tả sự kiện *</Label>
                                        <Textarea
                                            {...form.register("Description")}
                                            placeholder="Nội dung sự kiện, lịch trình chi tiết..."
                                            className="min-h-[80px] rounded-xl border-zinc-200 focus:ring-primary/10 transition-all font-medium p-3 resize-none text-sm"
                                        />
                                        {form.formState.errors.Description && <p className="text-[9px] text-red-500 font-bold ml-1">{form.formState.errors.Description.message}</p>}
                                    </div>

                                    {/* TICKET TYPES MANAGEMENT */}
                                    <div className="space-y-4 pt-4 border-t border-zinc-100">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Danh sách loại vé</Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addZone}
                                                className="h-7 text-[9px] font-black uppercase tracking-widest rounded-full border-zinc-200 hover:bg-black hover:text-white transition-all px-4"
                                            // className="h-8 text-[9px] font-black uppercase tracking-widest rounded-full border-black hover:bg-black hover:text-white transition-all px-4"
                                            >
                                                + Thêm loại vé
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            {zones.map((z: any, i: number) => (
                                                <div key={i} className="group relative grid grid-cols-12 gap-3 items-end p-3 bg-zinc-50 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-all">
                                                    <div className="col-span-12 md:col-span-5 space-y-1">
                                                        <Label className="text-[9px] uppercase font-black text-zinc-400 ml-1">Tên loại vé</Label>
                                                        <Input
                                                            placeholder="VD: VIP, Standard..."
                                                            value={z.name}
                                                            onChange={(e) => updateZone(i, "name", e.target.value)}
                                                            className="h-9 bg-white rounded-lg border-zinc-200 font-bold text-xs"
                                                        />
                                                    </div>
                                                    <div className="col-span-6 md:col-span-3 space-y-1">
                                                        <Label className="text-[9px] uppercase font-black text-zinc-400 ml-1">Giá (VNĐ)</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            value={z.price}
                                                            onChange={(e) => updateZone(i, "price", e.target.value)}
                                                            className="h-9 bg-white rounded-lg border-zinc-200 font-bold text-xs"
                                                        />
                                                    </div>
                                                    <div className="col-span-6 md:col-span-3 space-y-1">
                                                        <Label className="text-[9px] uppercase font-black text-zinc-400 ml-1">Số lượng</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            value={z.quantity}
                                                            onChange={(e) => updateZone(i, "quantity", e.target.value)}
                                                            className="h-9 bg-white rounded-lg border-zinc-200 font-bold text-xs"
                                                        />
                                                    </div>
                                                    <div className="col-span-12 md:col-span-1 flex justify-end">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeZone(i)}
                                                            disabled={zones.length === 1}
                                                            className="h-9 w-9 p-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div className="p-6 border-t border-zinc-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                    <p className="text-[9px] text-zinc-400 font-bold italic">(*) Vui lòng kiểm tra kỹ thông tin trước khi lưu</p>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="rounded-full px-6 font-black uppercase tracking-widest text-[9px] text-zinc-500 hover:bg-zinc-200 h-10 transition-all">
                            {isDetail ? "Đóng" : "Hủy bỏ"}
                        </Button>
                        {!isDetail && (
                            <Button
                                form="event-form"
                                type="submit"
                                disabled={create.isPending || update.isPending}
                                className="rounded-full px-8 bg-zinc-900 hover:bg-black text-white font-black uppercase tracking-widest text-[9px] shadow-lg h-10 transition-all active:scale-95 flex items-center gap-2"
                            >
                                {(create.isPending || update.isPending) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3 h-3" />}
                                {mode === "CREATE" ? "Tạo sự kiện" : "Lưu thay đổi"}
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function Send({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
    )
}