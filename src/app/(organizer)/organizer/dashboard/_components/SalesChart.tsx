import { Card } from "@/components/ui/card";
import { ticketSalesData } from "@/utils/mockOrganizer";
import { BarChart3 } from "lucide-react";

export default function SalesChart() {
  const maxSales = Math.max(...ticketSalesData.map(d => d.sales));

  return (
    <Card className="rounded-[32px] border border-zinc-100 bg-white h-full flex flex-col overflow-hidden shadow-sm">
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black tracking-tighter text-zinc-900 uppercase italic">Revenue Insight</h3>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-end min-h-0">
        <div className="flex items-end justify-between gap-4 h-full w-full">
          {ticketSalesData.map((data, index) => {
            const height = (data.sales / maxSales) * 100;
            return (
              <div key={index} className="flex flex-col items-center gap-3 flex-1 h-full justify-end group cursor-pointer">
                <div className="relative w-full flex justify-center items-end h-full">
                  <div className="w-full bg-zinc-50 rounded-xl h-full absolute transition-colors group-hover:bg-zinc-100"></div>
                  <div
                    className="w-full bg-linear-to-t from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-700 rounded-xl relative shadow-md"
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 whitespace-nowrap z-10 pointer-events-none">
                      {data.sales.toLocaleString()} vé
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-tight text-zinc-400 group-hover:text-primary transition-colors italic">{data.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  );
}
