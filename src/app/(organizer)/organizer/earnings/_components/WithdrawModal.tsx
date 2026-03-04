"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Building2, Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";

type WithdrawMethod = "BANK" | "MOMO";

const buildWithdrawSchema = (maxAmount: number) =>
  z.object({
    amount: z.coerce
      .number({ message: "Vui lòng nhập số tiền hợp lệ" })
      .min(50000, "Số tiền tối thiểu là 50.000 VNĐ")
      .max(maxAmount, "Số tiền vượt quá số dư khả dụng"),
    method: z.enum(["BANK", "MOMO"]),
    bankName: z.string().trim().min(1, "Vui lòng nhập tên ngân hàng hoặc ví"),
    accountNumber: z.string().trim().min(6, "Số tài khoản không hợp lệ"),
    accountName: z.string().trim().min(2, "Vui lòng nhập tên chủ tài khoản"),
    note: z.string().trim().max(120, "Ghi chú tối đa 120 ký tự").optional(),
  });

type WithdrawPayload = {
  amount: number;
  method: WithdrawMethod;
  bankName: string;
  accountNumber: string;
  accountName: string;
  note?: string;
};

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSubmitRequest?: (payload: WithdrawPayload) => Promise<void> | void;
}

const formatCurrency = (value: number) => `${new Intl.NumberFormat("vi-VN").format(Math.max(0, value))} VNĐ`;

export default function WithdrawModal({ isOpen, onClose, balance, onSubmitRequest }: WithdrawModalProps) {
  const [loading, setLoading] = useState(false);
  const safeBalance = Math.max(0, Number.isFinite(balance) ? balance : 0);

  const schema = useMemo(() => buildWithdrawSchema(safeBalance), [safeBalance]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      method: "BANK",
      bankName: "",
      accountNumber: "",
      accountName: "",
      note: "",
    },
  });

  const method = form.watch("method");

  const resetAndClose = () => {
    form.reset({
      amount: 0,
      method: "BANK",
      bankName: "",
      accountNumber: "",
      accountName: "",
      note: "",
    });
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const payload = {
      amount: values.amount,
      method: values.method,
      bankName: values.bankName,
      accountNumber: values.accountNumber,
      accountName: values.accountName,
      note: values.note,
    };

    try {
      setLoading(true);

      if (onSubmitRequest) {
        await onSubmitRequest(payload);
        toast.success("Đã gửi yêu cầu rút tiền.");
      } else {
        toast.info("Yêu cầu đã được ghi nhận. Hệ thống sẽ tích hợp API xử lý trong bước tiếp theo.");
      }

      resetAndClose();
    } catch {
      toast.error("Không thể gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? resetAndClose() : undefined)}>
      <DialogContent className="max-w-lg rounded-3xl border border-zinc-200 bg-white p-0">
        <DialogHeader className="border-b border-zinc-100 px-5 py-4 lg:px-6">
          <DialogTitle className="text-lg font-semibold text-zinc-900">Yêu cầu rút tiền</DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Số dư khả dụng: <span className="font-semibold text-zinc-900">{formatCurrency(safeBalance)}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-5 py-4 lg:px-6 lg:py-5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => form.setValue("method", "BANK", { shouldValidate: true })}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
                method === "BANK" ? "border-primary bg-primary/5 text-primary" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              )}
            >
              <Building2 className="h-4 w-4" />
              Ngân hàng
            </button>

            <button
              type="button"
              onClick={() => form.setValue("method", "MOMO", { shouldValidate: true })}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition",
                method === "MOMO" ? "border-primary bg-primary/5 text-primary" : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
              )}
            >
              <Smartphone className="h-4 w-4" />
              Ví MoMo
            </button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-600">Số tiền rút</Label>
            <Input type="number" inputMode="numeric" {...form.register("amount")} placeholder="Nhập số tiền" className="h-10 rounded-xl" />
            {form.formState.errors.amount && (
              <p className="text-xs text-rose-600">{form.formState.errors.amount.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-zinc-600">{method === "BANK" ? "Ngân hàng" : "Ví nhận"}</Label>
              <Input
                {...form.register("bankName")}
                placeholder={method === "BANK" ? "VD: Vietcombank" : "VD: MoMo - 09xxxxxxxx"}
                className="h-10 rounded-xl"
              />
              {form.formState.errors.bankName && (
                <p className="text-xs text-rose-600">{form.formState.errors.bankName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-600">Số tài khoản</Label>
              <Input {...form.register("accountNumber")} placeholder="Nhập số tài khoản" className="h-10 rounded-xl" />
              {form.formState.errors.accountNumber && (
                <p className="text-xs text-rose-600">{form.formState.errors.accountNumber.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-600">Tên chủ tài khoản</Label>
              <Input {...form.register("accountName")} placeholder="Nhập tên chủ tài khoản" className="h-10 rounded-xl" />
              {form.formState.errors.accountName && (
                <p className="text-xs text-rose-600">{form.formState.errors.accountName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-600">Ghi chú (tuỳ chọn)</Label>
            <Input {...form.register("note")} placeholder="Ghi chú cho yêu cầu rút tiền" className="h-10 rounded-xl" />
            {form.formState.errors.note && <p className="text-xs text-rose-600">{form.formState.errors.note.message}</p>}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Yêu cầu rút tiền thường được xử lý trong 24-48 giờ làm việc.
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="h-10 flex-1 rounded-xl" onClick={resetAndClose}>
              Hủy
            </Button>

            <Button type="submit" className="h-10 flex-1 rounded-xl" disabled={loading || safeBalance <= 0}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gửi yêu cầu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
