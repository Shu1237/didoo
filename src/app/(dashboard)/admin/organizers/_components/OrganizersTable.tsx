"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useGetOrganizers, useOrganizer } from "@/hooks/useOrganizer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BasePagination } from "@/components/base/BasePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { OrganizerStatus } from "@/utils/enum";
import type { Organizer } from "@/types/organizer";

function toQuery(params: Record<string, string | string[] | undefined>) {
  const q: Record<string, string | number | boolean> = {};
  const pageNumber = Number(params.pageNumber ?? params.page ?? 1) || 1;
  const pageSize = Number(params.pageSize) || 10;
  q.pageNumber = pageNumber;
  q.pageSize = pageSize;
  if (params.name && typeof params.name === "string") q.name = params.name;
  if (params.slug && typeof params.slug === "string") q.slug = params.slug;
  if (params.status && params.status !== "") q.status = Number(params.status);
  if (params.isDescending !== undefined) q.isDescending = params.isDescending === "true";
  return q;
}

const statusLabels: Record<OrganizerStatus, string> = {
  [OrganizerStatus.PENDING]: "Chờ duyệt",
  [OrganizerStatus.VERIFIED]: "Đã xác minh",
  [OrganizerStatus.BANNED]: "Bị cấm",
};

export function OrganizersTable({
  params,
  onDelete,
}: {
  params: Record<string, string | string[] | undefined>;
  onDelete?: (organizer: Organizer) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = toQuery(params);
  const { data, isLoading } = useGetOrganizers(query);
  const { verify } = useOrganizer();

  if (isLoading || !data) return null;

  const items = data.data?.items ?? [];
  const totalItems = data.data?.totalItems ?? 0;
  const pageNumber = data.data?.pageNumber ?? 1;
  const pageSize = data.data?.pageSize ?? 10;
  const totalPages = data.data?.totalPages ?? 1;

  const updateParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString());
    p.set(key, value);
    if (key !== "pageNumber" && key !== "page") p.set("pageNumber", "1");
    router.push(`${pathname}?${p.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200 hover:bg-transparent">
              <TableHead className="w-12">Logo</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((o) => (
              <TableRow key={o.id} className="border-zinc-100">
                <TableCell>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={o.logoUrl} />
                    <AvatarFallback className="bg-zinc-100">{o.name?.[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{o.name}</TableCell>
                <TableCell className="text-zinc-600">{o.email}</TableCell>
                <TableCell className="text-zinc-600">{o.phone ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      o.status === OrganizerStatus.VERIFIED
                        ? "default"
                        : o.status === OrganizerStatus.BANNED
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {statusLabels[o.status as OrganizerStatus] ?? o.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/organizers/${o.id}`}>Xem chi tiết</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/organizers/${o.id}/edit`}>Chỉnh sửa</Link>
                      </DropdownMenuItem>
                      {o.status === OrganizerStatus.PENDING && (
                        <DropdownMenuItem
                          onClick={() => verify.mutate(o.id)}
                          disabled={verify.isPending}
                          className="text-emerald-600 focus:text-emerald-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Duyệt
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(o)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BasePagination
        currentPage={pageNumber}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={pageSize}
        onPageChange={(p) => updateParam("pageNumber", String(p))}
        onPageSizeChange={(s) => updateParam("pageSize", String(s))}
      />
    </div>
  );
}
