"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useSessionStore } from "@/stores/sesionStore";
import {
  ChangeEmailInput,
  VerifyChangeEmailInput,
  changeEmailSchema,
  verifyChangeEmailSchema,
} from "@/schemas/auth";
import { handleErrorApi } from "@/lib/errors";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";

export default function ChangeEmailForm() {
  const { changeEmail, verifyChangeEmail } = useAuth();
  const userId = useSessionStore((state) => state.user?.UserId ?? "");
  const currentEmail = useSessionStore((state) => state.user?.Email ?? "");

  const [step, setStep] = useState<1 | 2>(1);
  const [pendingEmail, setPendingEmail] = useState("");

  const changeForm = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      userId,
      newEmail: "",
    },
    mode: "onChange",
  });

  const verifyForm = useForm<VerifyChangeEmailInput>({
    resolver: zodResolver(verifyChangeEmailSchema),
    defaultValues: {
      userId,
      otp: "",
    },
    mode: "onChange",
  });

  const otpValue = useWatch({ control: verifyForm.control, name: "otp" }) || "";

  const onSendCode = async (data: ChangeEmailInput) => {
    try {
      await changeEmail.mutateAsync(data);
      setPendingEmail(data.newEmail);
      setStep(2);
    } catch (error) {
      handleErrorApi({ error, setError: changeForm.setError });
    }
  };

  const onVerify = async (data: VerifyChangeEmailInput) => {
    try {
      await verifyChangeEmail.mutateAsync(data);
      verifyForm.reset({ userId, otp: "" });
    } catch (error) {
      handleErrorApi({ error, setError: verifyForm.setError });
    }
  };

  if (step === 1) {
    return (
      <form onSubmit={changeForm.handleSubmit(onSendCode)} className="space-y-4">
        <input type="hidden" {...changeForm.register("userId")} />

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Current email</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{currentEmail || "Not available"}</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">New email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="email"
              placeholder="new-email@example.com"
              {...changeForm.register("newEmail")}
              className={`h-11 rounded-xl border-slate-200 bg-white pl-10 ${
                changeForm.formState.errors.newEmail ? "border-rose-300 ring-1 ring-rose-200" : ""
              }`}
            />
          </div>
          {changeForm.formState.errors.newEmail && (
            <p className="text-xs font-medium text-rose-600">
              {changeForm.formState.errors.newEmail.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={changeEmail.isPending} className="h-10 rounded-full px-6 font-semibold">
            {changeEmail.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-5">
      <input type="hidden" {...verifyForm.register("userId")} />

      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          OTP da duoc gui
        </p>
        <p className="mt-1 text-xs text-emerald-700">
          Vui long kiem tra hop thu cua <span className="font-semibold">{pendingEmail}</span>.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Verification code
        </label>
        <InputOTP
          maxLength={6}
          value={otpValue}
          onChange={(value) => verifyForm.setValue("otp", value, { shouldValidate: true })}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="h-11 w-10 rounded-xl border-slate-200" />
            <InputOTPSlot index={1} className="h-11 w-10 rounded-xl border-slate-200" />
            <InputOTPSlot index={2} className="h-11 w-10 rounded-xl border-slate-200" />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} className="h-11 w-10 rounded-xl border-slate-200" />
            <InputOTPSlot index={4} className="h-11 w-10 rounded-xl border-slate-200" />
            <InputOTPSlot index={5} className="h-11 w-10 rounded-xl border-slate-200" />
          </InputOTPGroup>
        </InputOTP>
        {verifyForm.formState.errors.otp && (
          <p className="text-xs font-medium text-rose-600">{verifyForm.formState.errors.otp.message}</p>
        )}
      </div>

      <div className="flex flex-wrap justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700"
        >
          Use another email
        </button>

        <Button
          type="submit"
          disabled={verifyChangeEmail.isPending || otpValue.length !== 6}
          className="h-10 rounded-full px-6 font-semibold"
        >
          {verifyChangeEmail.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
      </div>
    </form>
  );
}
