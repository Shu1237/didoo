"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, Mail, Save, Shield, Key, Phone, Loader2, Calendar } from "lucide-react";
import { Gender } from "@/utils/enum";
import { useEffect } from "react";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeEmailForm from "./ChangeEmailForm";
import { useGetMe, useUser } from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateBody, userUpdateSchema } from "@/schemas/user";
import { handleErrorApi } from "@/lib/errors";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export default function ProfileForm() {
  const { data: userData, isLoading } = useGetMe();
  const { update } = useUser();
  const form = useForm<Pick<UserUpdateBody, 'FullName' | 'Phone' | 'Gender' | 'DateOfBirth'>>({
    resolver: zodResolver(userUpdateSchema.pick({ FullName: true, Phone: true, Gender: true, DateOfBirth: true })) as any,
    defaultValues: {
      FullName: "",
      Phone: "",
      Gender: Gender.MALE,
      DateOfBirth: undefined,
    },
  });

  useEffect(() => {
    if (userData?.data) {
      form.reset({
        FullName: userData.data.fullName || "",
        Phone: userData.data.phone || "",
        Gender: userData.data.gender ?? Gender.MALE,
        DateOfBirth: userData.data.dateOfBirth
          ? new Date(userData.data.dateOfBirth).toISOString().split('T')[0]
          : undefined,
      });
    }
  }, [userData]);

  const onSubmit = async (values: Pick<UserUpdateBody, 'FullName' | 'Phone' | 'Gender' | 'DateOfBirth'>) => {
    if (!userData?.data?.id) return;
    const api = userData.data;
    const body: UserUpdateBody = {
      FullName: values.FullName,
      Phone: values.Phone,
      Gender: values.Gender,
      DateOfBirth: values.DateOfBirth,
      Address: api.address || undefined,
      AvatarUrl: api.avatarUrl || undefined,
      Status: api.status,
      RoleName: api.role?.name?.toLocaleLowerCase() === 'user' ? 2
        : api.role?.name?.toLocaleLowerCase() === 'organizer' ? 3
        : api.role?.name?.toLocaleLowerCase() === 'admin' ? 1
        : 4,
      OrganizerId: api.organizerId ?? undefined,
    };
    try {
      await update.mutateAsync({ id: api.id, body });
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const user = userData?.data;

  return (
    <div className="flex flex-col gap-10">
      {/* Section 1: Profile Information */}
      <Card className="bg-white border border-slate-200 shadow-xl overflow-hidden rounded-[32px]">
        <CardHeader className="bg-white border-b border-slate-100 p-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <UserIcon className="w-5 h-5 text-slate-400" />
              Profile Information
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* Row 1: Email + Role */}
              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 font-semibold rounded-2xl px-5 text-sm cursor-not-allowed pr-24 border-dashed"
                  />
                  {user?.isVerified && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md tracking-wider">
                      VERIFIED
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-slate-400 ml-1">Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input
                    value={user?.role?.name || "USER"}
                    disabled
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 font-semibold rounded-2xl pl-12 pr-5 text-sm cursor-not-allowed border-dashed"
                  />
                </div>
              </div>

              {/* Row 2: Full Name + Phone */}
              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-slate-400 ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input
                    {...form.register("FullName")}
                    placeholder="Enter your name"
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 font-semibold rounded-2xl pl-12 pr-5 text-sm focus:bg-white focus:border-slate-300 transition-all"
                  />
                </div>
                {form.formState.errors.FullName && (
                  <p className="text-[10px] text-red-500 ml-1">{form.formState.errors.FullName.message}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-slate-400 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <Input
                    {...form.register("Phone")}
                    placeholder="None"
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 font-semibold rounded-2xl pl-12 pr-5 text-sm focus:bg-white focus:border-slate-300 transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Gender + Date of Birth */}
              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-slate-400 ml-1">Gender</label>
                <select
                  {...form.register("Gender", { valueAsNumber: true })}
                  className="w-full h-12 bg-slate-50 border border-slate-100 text-slate-900 font-semibold rounded-2xl px-5 text-sm focus:bg-white focus:border-slate-300 focus:outline-none transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                >
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                  <option value={Gender.OTHER}>Other</option>
                </select>
              </div>

              <div className="space-y-2.5">
                <label className="text-[13px] font-bold text-slate-400 ml-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                  <input
                    type="date"
                    {...form.register("DateOfBirth")}
                    className="w-full h-12 bg-slate-50 border border-slate-100 text-slate-900 font-semibold rounded-2xl pl-12 pr-5 text-sm focus:bg-white focus:border-slate-300 focus:outline-none transition-all [color-scheme:light]"
                  />
                </div>
                {form.formState.errors.DateOfBirth && (
                  <p className="text-[10px] text-red-500 ml-1">{form.formState.errors.DateOfBirth.message as string}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="submit"
                disabled={update.isPending}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 shadow-lg shadow-slate-900/10 font-bold flex items-center gap-2 h-11 transition-all active:scale-95"
              >
                {update.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Section 2: Security Settings */}
      <div className="space-y-6">
        <h3 className="text-[18px] font-bold text-slate-900 ml-1">Security Settings</h3>

        <div className="grid grid-cols-1 gap-4">
          {/* Password Row */}
          <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100">
                <Key className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-slate-900">Password</span>
                <span className="text-[13px] text-slate-400 font-medium tracking-tight">Last updated 30 days ago</span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full px-6 font-bold text-slate-700 h-10 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all">
                  Change
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[500px] p-10 bg-white border-none shadow-2xl overflow-hidden rounded-[32px]">
                <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#FF9B8A]/10 rounded-xl">
                    <Key className="w-5 h-5 text-[#FF9B8A]" />
                  </div>
                  Update Password
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium mb-8">
                  Ensure your account is using a long, random password to stay secure.
                </DialogDescription>
                <ChangePasswordForm />
              </DialogContent>
            </Dialog>
          </div>

          {/* Email Change Row */}
          <div className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100">
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-slate-900">Email Address</span>
                <span className="text-[13px] text-slate-400 font-medium tracking-tight truncate max-w-[200px]">{user?.email}</span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full px-6 font-bold text-slate-700 h-10 border-slate-200 hover:bg-slate-50 active:scale-95 transition-all">
                  Change
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[500px] p-10 bg-white border-none shadow-2xl overflow-hidden rounded-[32px]">
                <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#FF9B8A]/10 rounded-xl">
                    <Mail className="w-5 h-5 text-[#FF9B8A]" />
                  </div>
                  Update Email
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium mb-8">
                  You will need to verify your new email address.
                </DialogDescription>
                <ChangeEmailForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
