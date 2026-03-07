"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizerCreateSchema, type OrganizerCreateBody } from "@/schemas/organizer";
import { useOrganizer } from "@/hooks/useOrganizer";
import { useGetUsers } from "@/hooks/useUser";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleErrorApi } from "@/lib/errors";
import { useRouter } from "next/navigation";

export function CreateOrganizerForm() {
  const router = useRouter();
  const { create } = useOrganizer();
  const { data: usersRes } = useGetUsers({ pageSize: 100 });
  const users = usersRes?.data?.items ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrganizerCreateBody>({
    resolver: zodResolver(organizerCreateSchema),
    defaultValues: {
      Name: "",
      Slug: "",
      Description: "",
      LogoUrl: "",
      BannerUrl: "",
      Email: "",
      Phone: "",
      WebsiteUrl: "",
      FacebookUrl: "",
      InstagramUrl: "",
      TiktokUrl: "",
      Address: "",
      UserId: "",
      Status: 1,
    },
  });

  const onSubmit = async (data: OrganizerCreateBody) => {
    try {
      await create.mutateAsync(data);
      router.push("/admin/organizers");
    } catch (err) {
      handleErrorApi({ error: err });
    }
  };

  return (
    <Card className="border-zinc-200">
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-900">Thông tin organizer</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="Name">Tên *</Label>
              <Input
                id="Name"
                {...register("Name")}
                className={errors.Name ? "border-destructive" : ""}
              />
              {errors.Name && (
                <p className="text-sm text-destructive">{errors.Name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Slug">Slug *</Label>
              <Input
                id="Slug"
                {...register("Slug")}
                className={errors.Slug ? "border-destructive" : ""}
              />
              {errors.Slug && (
                <p className="text-sm text-destructive">{errors.Slug.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="Email">Email *</Label>
              <Input
                id="Email"
                type="email"
                {...register("Email")}
                className={errors.Email ? "border-destructive" : ""}
              />
              {errors.Email && (
                <p className="text-sm text-destructive">{errors.Email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Phone">Số điện thoại *</Label>
              <Input
                id="Phone"
                {...register("Phone")}
                className={errors.Phone ? "border-destructive" : ""}
              />
              {errors.Phone && (
                <p className="text-sm text-destructive">{errors.Phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Người dùng liên kết *</Label>
            <Select onValueChange={(v) => setValue("UserId", v)}>
              <SelectTrigger className={errors.UserId ? "border-destructive" : ""}>
                <SelectValue placeholder="Chọn người dùng" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.fullName} ({u.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.UserId && (
              <p className="text-sm text-destructive">{errors.UserId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="Description">Mô tả (optional)</Label>
            <Textarea
              id="Description"
              {...register("Description")}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Hủy
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Đang tạo..." : "Tạo"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
