import { Suspense } from "react";
import Loading from "@/components/loading";
import ProfileForm from "./_components/ProfileForm";
import ProfileHeader from "./_components/ProfileHeader";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Suspense fallback={<Loading />}>
        <ProfileHeader />
        <ProfileForm />
      </Suspense>
    </div>
  );
}
