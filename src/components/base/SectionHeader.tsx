"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  /** Nếu có, hiển thị nút Create. href = link đến trang create, onClick = mở drawer */
  createHref?: string;
  createOnClick?: () => void;
  createLabel?: string;
};

export function SectionHeader({ title, subtitle, createHref, createOnClick, createLabel = "Tạo mới" }: SectionHeaderProps) {
  const createButton = createHref ? (
    <Button asChild size="sm" className="rounded-xl">
      <Link href={createHref}>
        <Plus className="h-4 w-4" />
        {createLabel}
      </Link>
    </Button>
  ) : createOnClick ? (
    <Button size="sm" className="rounded-xl" onClick={createOnClick}>
      <Plus className="h-4 w-4" />
      {createLabel}
    </Button>
  ) : null;

  return (
    <div className="flex flex-1 items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {createButton && <div className="shrink-0">{createButton}</div>}
    </div>
  );
}
