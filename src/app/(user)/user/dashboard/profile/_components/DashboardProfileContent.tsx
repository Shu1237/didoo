"use client";

import { Suspense } from "react";
import Loading from "@/components/loading";
import ProfileSidebar from "./ProfileHeader";
import ProfileForm from "./ProfileForm";

export default function DashboardProfileContent() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
      <Suspense fallback={<Loading />}>
        <ProfileSidebar />
      </Suspense>

      <div className="border-t border-zinc-100">
        <Suspense fallback={<Loading />}>
          <ProfileForm />
        </Suspense>
      </div>
    </div>
  );
}
