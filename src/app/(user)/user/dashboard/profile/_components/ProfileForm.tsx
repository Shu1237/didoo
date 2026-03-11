"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetMe, useUser } from "@/hooks/useAuth";
import { handleErrorApi } from "@/lib/errors";
import { Gender } from "@/utils/enum";
import { UserUpdateBody, userUpdateSchema } from "@/schemas/auth";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";
import {
  CalendarDays,
  KeyRound,
  Loader2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const profileSchema = z.object({
  FullName: z.string().optional(),
  DateOfBirth: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function parseProfileDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed;
}

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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      FullName: "",
      DateOfBirth: "",
    },
  });

  useEffect(() => {
    if (!userData?.data) return;

    form.reset({
      FullName: userData.data.fullName || "",
      DateOfBirth: userData.data.dateOfBirth
        ? new Date(userData.data.dateOfBirth).toISOString().split("T")[0]
        : "",
    });
  }, [form, userData]);

  const user = userData?.data;

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) return;

    const body: UserUpdateBody = {
      FullName: values.FullName,
      Phone: user.phone || "",
      Gender: user.gender ?? Gender.MALE,
      DateOfBirth: values.DateOfBirth || undefined,
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
                  Thông tin hồ sơ
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-0.5">
                  Cập nhật thông tin cơ bản và quản lý tài khoản của bạn.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 bg-white flex-1">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Địa chỉ email">
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-700"
                  />
                </Field>

                <Field label="Vai trò">
                  <Input
                    value={user?.role?.name || "Người dùng"}
                    disabled
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-700"
                  />
                </Field>

                <Field label="Họ và tên" error={form.formState.errors.FullName?.message as string | undefined}>
                  <Input
                    {...form.register("FullName")}
                    placeholder="Nhập họ và tên"
                    className="h-11 rounded-xl border-slate-200 bg-white"
                  />
                </Field>

                <Field label="Ngày sinh" error={form.formState.errors.DateOfBirth?.message as string | undefined}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 w-full justify-start rounded-xl border-slate-200 bg-white px-3 text-left text-sm font-medium text-slate-700"
                      >
                        <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
                        {(() => {
                          const selectedDate = parseProfileDate(form.watch("DateOfBirth"));
                          return selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Chọn ngày sinh";
                        })()}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={parseProfileDate(form.watch("DateOfBirth"))}
                        onSelect={(date) =>
                          form.setValue("DateOfBirth", date ? format(date, "yyyy-MM-dd") : "", {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
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
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Lưu thay đổi
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
                  Cài đặt bảo mật
                </h2>
                <p className="text-sm font-medium text-slate-500 mt-0.5">
                  Quản lý mật khẩu và tăng cường bảo mật tài khoản.
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
                    <span className="text-lg font-bold text-slate-900">Đổi mật khẩu</span>
                    <p className="text-sm font-medium text-slate-500 text-center max-w-[200px]">Cập nhật thông tin đăng nhập an toàn.</p>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 md:p-7">
                  <DialogTitle className="text-2xl font-bold text-slate-900">Cập nhật mật khẩu</DialogTitle>
                  <DialogDescription className="text-sm text-slate-600">
                    Dùng mật khẩu mạnh hơn để tăng bảo mật.
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
                    <span className="text-lg font-bold text-slate-900">Đổi email</span>
                    <p className="text-sm font-medium text-slate-500 text-center max-w-[200px]">Cập nhật email tài khoản của bạn.</p>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 md:p-7">
                  <DialogTitle className="text-2xl font-bold text-slate-900">Cập nhật email</DialogTitle>
                  <DialogDescription className="text-sm text-slate-600">
                    Hệ thống sẽ gửi OTP để xác nhận email mới.
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

