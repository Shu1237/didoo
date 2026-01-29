import { Card } from "@/components/ui/card";
import { ticketSalesData } from "@/utils/mockOrganizer";
import { BarChart3 } from "lucide-react";

export default function SalesChart() {
  const maxSales = Math.max(...ticketSalesData.map(d => d.sales));

  return (
    <Card className="rounded-xl border border-border/50 bg-card shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Biểu đồ doanh thu</h3>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-end">
        <div className="flex items-end justify-between gap-4 h-[240px] w-full">
          {ticketSalesData.map((data, index) => {
            const height = (data.sales / maxSales) * 100;
            return (
              <div key={index} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group cursor-pointer">
                <div className="relative w-full flex justify-center items-end h-full">
                  <div className="w-full bg-secondary rounded-t-sm h-full absolute opacity-20"></div>
                  <div
                    className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 rounded-t-sm relative"
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold pointer-events-none">
                      {data.sales} vé
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{data.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  );
}
