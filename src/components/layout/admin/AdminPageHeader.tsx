interface AdminPageHeaderProps {
  title: string;
  description: string;
  badge?: string;
}

export default function AdminPageHeader({ title, description, badge }: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        <p className="text-zinc-500 mt-1 text-sm">{description}</p>
      </div>
      {badge && (
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}
