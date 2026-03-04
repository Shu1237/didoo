interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
}

export default function AdminPageHeader({ title, description, badge, children }: AdminPageHeaderProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm lg:px-5 lg:py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            {badge && (
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                {badge}
              </span>
            )}
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 lg:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-zinc-500">{description}</p>}
        </div>

        {children && <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">{children}</div>}
      </div>
    </section>
  );
}
