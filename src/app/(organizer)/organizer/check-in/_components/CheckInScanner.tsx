"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

// TODO: Implement QR code scanner
export default function CheckInScanner() {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // TODO: Implement QR code scanning logic
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quét mã QR</h3>
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
        {isScanning ? (
          <div className="text-center">
            <QrCode className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Đang quét...</p>
          </div>
        ) : (
          <div className="text-center">
            <QrCode className="w-16 h-16 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Nhấn để bắt đầu quét</p>
          </div>
        )}
      </div>
      <Button onClick={handleScan} className="w-full" disabled={isScanning}>
        {isScanning ? "Đang quét..." : "Bắt đầu quét"}
      </Button>
    </Card>
  );
}
