import { Suspense } from "react";
import Loading from "@/components/loading";
import CheckInScanner from "./_components/CheckInScanner";
import CheckInList from "./_components/CheckInList";

export default function CheckInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Check-in sự kiện</h1>
        <p className="text-muted-foreground mt-2">
          Quét mã QR để check-in người tham dự
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<Loading />}>
          <CheckInScanner />
          <CheckInList />
        </Suspense>
      </div>
    </div>
  );
}
