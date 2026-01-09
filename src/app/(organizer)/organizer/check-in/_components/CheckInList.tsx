"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

// TODO: Replace with actual API call
async function fetchCheckIns() {
  return [];
}

export default function CheckInList() {
  const { data: checkIns, isLoading } = useQuery({
    queryKey: ["check-ins"],
    queryFn: fetchCheckIns,
  });

  if (isLoading) {
    return <Card className="p-6">Đang tải...</Card>;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Danh sách check-in</h3>
      {!checkIns || checkIns.length === 0 ? (
        <p className="text-muted-foreground">Chưa có check-in nào</p>
      ) : (
        <div className="space-y-2">
          {checkIns.map((checkIn: any) => (
            <div key={checkIn.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="font-medium">{checkIn.name}</p>
                <p className="text-sm text-muted-foreground">{checkIn.time}</p>
              </div>
              <span className="text-sm text-green-600">✓ Đã check-in</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
