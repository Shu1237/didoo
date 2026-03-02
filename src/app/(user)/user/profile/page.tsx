import { Suspense } from "react";
import { ShieldCheck, UserRound } from "lucide-react";
import Loading from "@/components/loading";
import ProfileForm from "./_components/ProfileForm";
import ProfileSidebar from "./_components/ProfileHeader";

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 pb-16 pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-10%] h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[-8%] h-[22rem] w-[22rem] rounded-full bg-amber-200/50 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          {/* Sidebar Area */}
          <aside className="w-full lg:w-[320px] shrink-0 border-b border-slate-100 lg:border-b-0 lg:border-r bg-slate-50/50">
            <Suspense fallback={<Loading />}>
              <ProfileSidebar />
            </Suspense>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <Suspense fallback={<Loading />}>
              <ProfileForm />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
