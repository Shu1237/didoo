"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
    Building2,
    CreditCard,
    Smartphone,
    Info,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const withdrawSchema = z.object({
    amount: z.string().min(1, "Vui lòng nhập số tiền"),
    bankName: z.string().min(1, "Vui lòng chọn ngân hàng"),
    accountNumber: z.string().min(1, "Vui lòng nhập số tài khoản"),
    accountName: z.string().min(1, "Vui lòng nhập tên chủ tài khoản"),
    note: z.string().optional(),
});

type WithdrawForm = z.infer<typeof withdrawSchema>;

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    balance: string;
}

export default function WithdrawModal({ isOpen, onClose, balance }: WithdrawModalProps) {
    const [method, setMethod] = React.useState<"BANK" | "MOMO">("BANK");
    const [step, setStep] = React.useState<"FORM" | "SUCCESS">("FORM");
    const [loading, setLoading] = React.useState(false);

    const form = useForm<WithdrawForm>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            amount: "",
            bankName: "",
            accountNumber: "",
            accountName: "",
            note: "",
        },
    });

    const onSubmit = async (values: WithdrawForm) => {
        setLoading(true);
        // Mock API call
        setTimeout(() => {
            setLoading(false);
            setStep("SUCCESS");
            toast.success("Yêu cầu rút tiền đã được gửi!");
        }, 1500);
    };

    const resetAndClose = () => {
        onClose();
        setStep("FORM");
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={resetAndClose}>
            <DialogContent className="max-w-md rounded-[32px] border-none bg-white p-0 overflow-hidden shadow-2xl">
                {step === "FORM" ? (
                    <>
                        <DialogHeader className="p-8 border-b border-zinc-100 bg-slate-50/50">
                            <DialogTitle className="text-2xl font-black tracking-tighter text-zinc-900 uppercase">
                                Rút tiền về tài khoản
                            </DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-zinc-500 mt-1">
                                Số dư khả dụng: <b className="text-primary">{balance}</b>
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
                            {/* Method Selection */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMethod("BANK")}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                                        method === "BANK" ? "bg-primary/5 border-primary text-primary" : "bg-white border-zinc-100 text-zinc-400 grayscale"
                                    )}
                                >
                                    <Building2 className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Ngân hàng</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMethod("MOMO")}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
                                        method === "MOMO" ? "bg-primary/5 border-primary text-primary" : "bg-white border-zinc-100 text-zinc-400 grayscale"
                                    )}
                                >
                                    <Smartphone className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Ví MoMo</span>
                                </button>
                            </div>

                            {/* Amount */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-2">Số tiền muốn rút (VNĐ)</Label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <Input
                                        {...form.register("amount")}
                                        placeholder="VD: 5,000,000"
                                        className="pl-11 h-12 rounded-2xl border-zinc-200 font-black text-lg"
                                    />
                                </div>
                                {form.formState.errors.amount && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.amount.message}</p>}
                            </div>

                            {/* Bank Details */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        {...form.register("bankName")}
                                        placeholder={method === "BANK" ? "Tên ngân hàng (VD: Vietcombank)" : "Số điện thoại MoMo"}
                                        className="h-12 rounded-2xl border-zinc-200 font-bold"
                                    />
                                    {form.formState.errors.bankName && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.bankName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        {...form.register("accountNumber")}
                                        placeholder="Số tài khoản"
                                        className="h-12 rounded-2xl border-zinc-200 font-bold"
                                    />
                                    {form.formState.errors.accountNumber && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.accountNumber.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        {...form.register("accountName")}
                                        placeholder="Tên chủ tài khoản (Viết hoa không dấu)"
                                        className="h-12 rounded-2xl border-zinc-200 font-bold"
                                    />
                                    {form.formState.errors.accountName && <p className="text-[10px] text-red-500 font-bold ml-2">{form.formState.errors.accountName.message}</p>}
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
                                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                                    Yêu cầu rút tiền sẽ được xử lý trong vòng <b>24h - 48h làm việc</b>. Phí giao dịch được áp dụng tùy theo phương thức thanh toán.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="ghost" onClick={resetAndClose} type="button" className="flex-1 rounded-full h-14 font-black uppercase tracking-widest text-[10px] text-zinc-500">
                                    Hủy bỏ
                                </Button>
                                <Button disabled={loading} className="flex-2 rounded-full h-14 h-14 px-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gửi yêu cầu"}
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="p-12 flex flex-col items-center text-center animate-in zoom-in duration-500">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 border border-emerald-100">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter text-zinc-900 uppercase mb-2">Yêu cầu đã được gửi!</h3>
                        <p className="text-zinc-500 text-sm font-medium mb-8 max-w-[280px]">
                            Chúng tôi đang xử lý yêu cầu của bạn. Thông báo sẽ được gửi qua email sau khi hoàn tất.
                        </p>
                        <Button onClick={resetAndClose} className="rounded-full px-10 h-14 bg-zinc-900 hover:bg-zinc-800 text-white font-black uppercase tracking-widest text-[11px] shadow-2xl">
                            Quay lại ví
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
