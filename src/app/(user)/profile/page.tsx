import { Suspense } from "react";
import Loading from "@/components/loading";
import ProfileForm from "./_components/ProfileForm";
import ProfileHeader from "./_components/ProfileHeader";

export default function ProfilePage() {
  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Suspense fallback={<Loading />}>
          <div className="animate-slide-up">
            <ProfileHeader />
          </div>
          <div className="animate-slide-up [animation-delay:0.1s]">
            <ProfileForm />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
