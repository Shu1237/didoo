"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
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

type ProfileFormValues = z.infer<typeof profileSchema>;

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
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "general";

  const form = useForm<any>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      FullName: "",
      Phone: "",
      Gender: Gender.MALE,
      DateOfBirth: "",
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
        : "",
    });
  }, [form, userData]);

  const user = userData?.data;

  const onSubmit = async (values: any) => {
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
    <>
      {tab === 'general' && (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 md:p-10 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Profile Information
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-0.5">
                  Update your basic information and manage account details.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-white flex-1">
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

                <Field label="Full Name" error={form.formState.errors.FullName?.message as string | undefined}>
                  <Input
                    {...form.register("FullName")}
                    placeholder="Nhap ho va ten"
                    className="h-11 rounded-xl border-slate-200 bg-white"
                  />
                </Field>

                <Field label="Phone Number" error={form.formState.errors.Phone?.message as string | undefined}>
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
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 md:p-10 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Security Settings
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-0.5">
                  Manage your password and secure your account credentials.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-white flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-slate-100 bg-white p-10 py-16 shadow-sm transition-all hover:border-sky-200 hover:shadow-md hover:bg-sky-50/50 outline-none group">
                    <div className="rounded-full bg-slate-50 p-4 group-hover:bg-white group-hover:scale-110 transition-transform">
                      <KeyRound className="h-8 w-8 text-slate-700 group-hover:text-sky-600" />
                    </div>
                    <span className="text-lg font-bold text-slate-900">Change password</span>
                    <p className="text-sm font-medium text-slate-500 text-center max-w-[200px]">Update your login credentials securely.</p>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 md:p-7">
                  <DialogTitle className="text-2xl font-bold text-slate-900">Update Password</DialogTitle>
                  <DialogDescription className="text-sm text-slate-600">
                    Dung mat khau manh hon de tang bao mat.
                  </DialogDescription>
                  <div className="mt-5">
                    <ChangePasswordForm />
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-slate-100 bg-white p-10 py-16 shadow-sm transition-all hover:border-sky-200 hover:shadow-md hover:bg-sky-50/50 outline-none group">
                    <div className="rounded-full bg-slate-50 p-4 group-hover:bg-white group-hover:scale-110 transition-transform">
                      <Mail className="h-8 w-8 text-slate-700 group-hover:text-sky-600" />
                    </div>
                    <span className="text-lg font-bold text-slate-900">Change email</span>
                    <p className="text-sm font-medium text-slate-500 text-center max-w-[200px]">Cap nhat email tai khoan cua ban.</p>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 md:p-7">
                  <DialogTitle className="text-2xl font-bold text-slate-900">Update Email</DialogTitle>
                  <DialogDescription className="text-sm text-slate-600">
                    He thong se gui OTP de xac nhan email moi.
                  </DialogDescription>
                  <div className="mt-5">
                    <ChangeEmailForm />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      )}
    </>
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

