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

      <div className="relative mx-auto w-full max-w-7xl">
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                <UserRound className="h-3.5 w-3.5" />
                My Profile
              </p>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Tai khoan cua ban
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                Cap nhat thong tin ca nhan, bao mat tai khoan va quan ly trang thai organizer
                ngay tai mot noi.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-4 w-4" />
              Bao mat tai khoan dang bat
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          <Suspense fallback={<Loading />}>
            <aside>
              <ProfileSidebar />
            </aside>
            <main>
              <ProfileForm />
            </main>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
