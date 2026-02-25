"use client";

import { Suspense } from "react";
import Loading from "@/components/loading";
import ProfileForm from "@/app/(user)/user/profile/_components/ProfileForm";
import ProfileSidebar from "@/app/(user)/user/profile/_components/ProfileHeader";

export default function AdminProfilePage() {
    return (
        <div className="p-8 max-w-5xl mx-auto min-h-screen">
            <Suspense fallback={<Loading />}>
                <div className="animate-in fade-in slide-in-from-bottom duration-700">
                    <ProfileSidebar />
                    <ProfileForm />
                </div>
            </Suspense>
        </div>
    );
}
