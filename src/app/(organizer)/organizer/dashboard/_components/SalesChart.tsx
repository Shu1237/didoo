import { Card } from "@/components/ui/card";
import { ticketSalesData } from "@/utils/mockOrganizer";

export default function SalesChart() {
  const maxSales = Math.max(...ticketSalesData.map(d => d.sales));

  return (
    <Card className="p-6 bg-background/60 backdrop-blur-md border-border/50 shadow-sm h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent w-fit">Phân tích bán vé</h3>
        <p className="text-sm text-muted-foreground">Doanh số 7 ngày qua</p>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 min-h-[200px] w-full pt-4">
        {ticketSalesData.map((data, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
            <div className="relative w-full flex justify-center items-end h-[200px]">
              <div
                className="w-full max-w-[40px] bg-primary/20 rounded-t-lg group-hover:bg-primary transition-all duration-300 relative"
                style={{ height: `${(data.sales / maxSales) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                  {data.sales} vé
                </div>
              </div>
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">{data.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
