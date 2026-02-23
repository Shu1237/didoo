import { Suspense } from "react";
import Loading from "@/components/loading";
import ProfileForm from "./_components/ProfileForm";
import ProfileSidebar from "./_components/ProfileHeader";

export default function ProfilePage() {
  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#FAFAFA]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/2 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/2 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 max-w-7xl mx-auto">
          <Suspense fallback={<Loading />}>
            {/* Left Column: Personality & Stats */}
            <aside className="animate-slide-up">
              <ProfileSidebar />
            </aside>

            {/* Right Column: Interactive Content */}
            <main className="animate-slide-up [animation-delay:0.1s]">
              <ProfileForm />
            </main>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
