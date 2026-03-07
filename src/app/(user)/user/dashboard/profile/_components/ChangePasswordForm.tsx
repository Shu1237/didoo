"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type UseFormRegister } from "react-hook-form";
import { Eye, EyeOff, Loader2, LockKeyhole, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { ChangePasswordInput, changePasswordSchema } from "@/schemas/auth";
import { handleErrorApi } from "@/lib/errors";
import { useSessionStore } from "@/stores/sesionStore";

export default function ChangePasswordForm() {
  const { changePassword } = useAuth();
  const userId = useSessionStore((state) => state.user?.UserId ?? "");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      userId,
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = useWatch({ control: form.control, name: "password" }) || "";
  const hasMinLength = passwordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(passwordValue);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await changePassword.mutateAsync(data);
      form.reset({
        userId,
        oldPassword: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...form.register("userId")} />

      <PasswordField
        fieldName="oldPassword"
        label="Current Password"
        placeholder="Nhap mat khau hien tai"
        typeVisible={showOldPassword}
        onToggleVisible={() => setShowOldPassword((value) => !value)}
        register={form.register}
        error={form.formState.errors.oldPassword?.message}
      />

      <PasswordField
        fieldName="password"
        label="New Password"
        placeholder="Nhap mat khau moi"
        typeVisible={showPassword}
        onToggleVisible={() => setShowPassword((value) => !value)}
        register={form.register}
        error={form.formState.errors.password?.message}
      />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Password rules
        </p>
        <ul className="mt-2 space-y-1.5 text-xs font-medium">
          <RuleItem ok={hasMinLength} label="At least 8 characters" />
          <RuleItem ok={hasUppercase} label="At least 1 uppercase letter" />
          <RuleItem ok={hasSpecial} label="At least 1 special character" />
        </ul>
      </div>

      <PasswordField
        fieldName="confirmPassword"
        label="Confirm Password"
        placeholder="Nhap lai mat khau moi"
        typeVisible={showConfirmPassword}
        onToggleVisible={() => setShowConfirmPassword((value) => !value)}
        register={form.register}
        error={form.formState.errors.confirmPassword?.message}
      />

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={changePassword.isPending} className="h-10 rounded-full px-6 font-semibold">
          {changePassword.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Dang cap nhat...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Update Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function PasswordField({
  fieldName,
  label,
  placeholder,
  typeVisible,
  onToggleVisible,
  register,
  error,
}: {
  fieldName: "oldPassword" | "password" | "confirmPassword";
  label: string;
  placeholder: string;
  typeVisible: boolean;
  onToggleVisible: () => void;
  register: UseFormRegister<ChangePasswordInput>;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</label>
      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type={typeVisible ? "text" : "password"}
          placeholder={placeholder}
          {...register(fieldName)}
          className={`h-11 rounded-xl border-slate-200 bg-white pl-10 pr-10 ${
            error ? "border-rose-300 ring-1 ring-rose-200" : ""
          }`}
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {typeVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

function RuleItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-2 ${ok ? "text-emerald-700" : "text-slate-500"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-emerald-500" : "bg-slate-300"}`} />
      {label}
    </li>
  );
}
