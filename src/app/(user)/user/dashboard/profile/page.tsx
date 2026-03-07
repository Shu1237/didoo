"use client";

import { Suspense } from "react";
import Loading from "@/components/loading";
import ProfileSidebar from "./_components/ProfileHeader";
import ProfileForm from "./_components/ProfileForm";

export default function DashboardProfilePage() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b lg:w-72 lg:border-b-0 lg:border-r border-zinc-100 bg-zinc-50/50">
          <Suspense fallback={<Loading />}>
            <ProfileSidebar />
          </Suspense>
        </aside>

        <main className="min-w-0 flex-1">
          <Suspense fallback={<Loading />}>
            <ProfileForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
