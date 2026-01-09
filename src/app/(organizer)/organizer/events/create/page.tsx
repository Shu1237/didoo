import { Suspense } from "react";
import Loading from "@/components/loading";
import CreateEventForm from "./_components/CreateEventForm";

export default function CreateEventPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tạo sự kiện mới</h1>
        <p className="text-muted-foreground mt-2">
          Điền thông tin để tạo sự kiện mới
        </p>
      </div>

      <Suspense fallback={<Loading />}>
        <CreateEventForm />
      </Suspense>
    </div>
  );
}
