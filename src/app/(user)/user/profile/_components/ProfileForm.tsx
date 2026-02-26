"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMe, useUser } from "@/hooks/useUser";
import { handleErrorApi } from "@/lib/errors";
import { Gender } from "@/utils/enum";
import { UserUpdateBody, userUpdateSchema } from "@/schemas/user";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";
import {
  CalendarDays,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const profileSchema = userUpdateSchema.pick({
  FullName: true,
  Phone: true,
  Gender: true,
  DateOfBirth: true,
});

type ProfileFormValues = z.input<typeof profileSchema>;

function getRoleCode(roleName?: string) {
  const normalized = (roleName || "").toLowerCase();
  if (normalized === "admin") return 1;
  if (normalized === "user") return 2;
  if (normalized === "organizer") return 3;
  return 4;
}

export default function ProfileForm() {
  const { data: userData, isLoading } = useGetMe();
  const { update } = useUser();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      FullName: "",
      Phone: "",
      Gender: Gender.MALE,
      DateOfBirth: undefined,
    },
  });

  useEffect(() => {
    if (!userData?.data) return;

    form.reset({
      FullName: userData.data.fullName || "",
      Phone: userData.data.phone || "",
      Gender: userData.data.gender ?? Gender.MALE,
      DateOfBirth: userData.data.dateOfBirth
        ? new Date(userData.data.dateOfBirth).toISOString().split("T")[0]
        : undefined,
    });
  }, [form, userData]);

  const user = userData?.data;

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) return;

    const body: UserUpdateBody = {
      FullName: values.FullName,
      Phone: values.Phone,
      Gender: values.Gender,
      DateOfBirth: values.DateOfBirth,
      Address: user.address || undefined,
      AvatarUrl: user.avatarUrl || undefined,
      Status: user.status,
      RoleName: getRoleCode(user.role?.name),
      OrganizerId: user.organizerId ?? undefined,
    };

    try {
      await update.mutateAsync({ id: user.id, body });
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
        <Loader2 className="h-7 w-7 animate-spin text-sky-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-200 p-6 md:p-7">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
            <UserRound className="h-5 w-5 text-sky-700" />
            Profile Information
          </CardTitle>
          <p className="text-sm text-slate-600">
            Cap nhat thong tin co ban de he thong hien thi dung du lieu cua ban.
          </p>
        </CardHeader>

        <CardContent className="p-6 md:p-7">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Email Address">
                <Input
                  value={user?.email || ""}
                  disabled
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-700"
                />
              </Field>

              <Field label="Role">
                <Input
                  value={user?.role?.name || "User"}
                  disabled
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-700"
                />
              </Field>

              <Field label="Full Name" error={form.formState.errors.FullName?.message}>
                <Input
                  {...form.register("FullName")}
                  placeholder="Nhap ho va ten"
                  className="h-11 rounded-xl border-slate-200 bg-white"
                />
              </Field>

              <Field label="Phone Number" error={form.formState.errors.Phone?.message}>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...form.register("Phone")}
                    placeholder="VD: 0912345678"
                    className="h-11 rounded-xl border-slate-200 bg-white pl-10"
                  />
                </div>
              </Field>

              <Field label="Gender" error={form.formState.errors.Gender?.message as string | undefined}>
                <select
                  {...form.register("Gender", { valueAsNumber: true })}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                >
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                  <option value={Gender.OTHER}>Other</option>
                </select>
              </Field>

              <Field label="Date of Birth" error={form.formState.errors.DateOfBirth?.message as string | undefined}>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    {...form.register("DateOfBirth")}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-700 outline-none transition [color-scheme:light] focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </Field>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={update.isPending}
                className="h-11 rounded-full px-7 font-semibold"
              >
                {update.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Dang luu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">Security Settings</h3>
        <p className="mt-1 text-sm text-slate-600">
          Doi mat khau va cap nhat email de bao ve tai khoan tot hon.
        </p>

        <div className="mt-5 space-y-3">
          <ActionRow
            icon={KeyRound}
            title="Password"
            description="Cap nhat mat khau dang nhap cua ban."
            triggerLabel="Change"
          >
            <DialogTitle className="text-2xl font-bold text-slate-900">Update Password</DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              Dung mat khau manh hon de tang bao mat.
            </DialogDescription>
            <div className="mt-5">
              <ChangePasswordForm />
            </div>
          </ActionRow>

          <ActionRow
            icon={Mail}
            title="Email Address"
            description={user?.email || "Cap nhat email tai khoan cua ban."}
            triggerLabel="Change"
          >
            <DialogTitle className="text-2xl font-bold text-slate-900">Update Email</DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              He thong se gui OTP de xac nhan email moi.
            </DialogDescription>
            <div className="mt-5">
              <ChangeEmailForm />
            </div>
          </ActionRow>
        </div>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</label>
      {children}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

function ActionRow({
  icon: Icon,
  title,
  description,
  triggerLabel,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  triggerLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-white p-2 text-sky-700 shadow-sm">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-600">{description}</p>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="h-10 rounded-full border-slate-300 bg-white px-5 text-slate-700 hover:bg-slate-100"
          >
            <ShieldCheck className="h-4 w-4" />
            {triggerLabel}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 md:p-7">
          {children}
        </DialogContent>
      </Dialog>
    </div>
  );
}
