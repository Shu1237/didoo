"use client";

import { Mail, Phone, Globe } from "lucide-react";

interface OrganizerContactInfoProps {
  email?: string;
  phone?: string;
  websiteUrl?: string;
}

export function OrganizerContactInfo({
  email,
  phone,
  websiteUrl,
}: OrganizerContactInfoProps) {
  const hasAny = email || phone || websiteUrl;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-zinc-900">Thông tin liên hệ</h2>
      <div className="mt-4 space-y-3">
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 text-sm text-zinc-600 hover:text-primary"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {email}
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-3 text-sm text-zinc-600 hover:text-primary"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {phone}
          </a>
        )}
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-zinc-600 hover:text-primary"
          >
            <Globe className="h-4 w-4 shrink-0" />
            {websiteUrl.replace(/^https?:\/\//, "")}
          </a>
        )}
        {!hasAny && (
          <p className="text-sm text-zinc-500">Chưa có thông tin liên hệ</p>
        )}
      </div>
    </section>
  );
}
