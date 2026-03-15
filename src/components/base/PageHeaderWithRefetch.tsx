"use client";

import { RefetchButton } from "./RefetchButton";

type PageHeaderWithRefetchProps = {
  title: string;
  subtitle?: string;
  queryKeys: readonly (readonly string[])[];
};

export function PageHeaderWithRefetch({
  title,
  subtitle,
  queryKeys,
}: PageHeaderWithRefetchProps) {
  return (
    <div className="flex flex-1 items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 lg:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      <RefetchButton queryKeys={queryKeys} />
    </div>
  );
}
