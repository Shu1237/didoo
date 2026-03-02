import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";

interface SalesChartPoint {
  name: string;
  sales: number;
  capacity: number;
  occupancy: number;
}

interface SalesChartProps {
  data: SalesChartPoint[];
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const createFallbackChart = (): SalesChartPoint[] => {
  const formatter = new Intl.DateTimeFormat("vi-VN", { weekday: "short" });
  const now = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (6 - index));

    return {
      name: formatter.format(day).replace(/\./g, ""),
      sales: 0,
      capacity: 0,
      occupancy: 0,
    };
  });
};

export default function SalesChart({ data }: SalesChartProps) {
  const chartData = data && data.length > 0 ? data : createFallbackChart();
  const maxSales = Math.max(...chartData.map((point) => point.sales), 1);
  const hasTicketData = chartData.some((point) => point.sales > 0 || point.capacity > 0);

  const totalSales = chartData.reduce((sum, point) => sum + point.sales, 0);
  const totalCapacity = chartData.reduce((sum, point) => sum + point.capacity, 0);
  const averageOccupancy = totalCapacity > 0 ? (totalSales / totalCapacity) * 100 : 0;

  const lineCoordinates = chartData.map((point, index) => {
    const x = ((index + 0.5) / chartData.length) * 100;
    const y = 100 - clamp(point.occupancy, 0, 100);
    return { x, y };
  });

  const linePoints = lineCoordinates.map((coord) => `${coord.x},${coord.y}`).join(" ");

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700">
            <BarChart3 className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-tight text-zinc-900">Hiệu suất 7 ngày</h3>
            <p className="text-xs text-zinc-500">Cột: vé bán ra • Đường: tỉ lệ lấp đầy</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-zinc-500">Tổng vé đã bán</p>
          <p className="text-lg font-semibold text-zinc-900">{totalSales.toLocaleString("vi-VN")}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
        <div className="mb-4 flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/80 px-3 py-2 text-xs text-zinc-600">
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-cyan-600" />
            Tỉ lệ lấp đầy trung bình: <strong className="text-zinc-900">{averageOccupancy.toFixed(1)}%</strong>
          </span>
          <span>
            Tổng sức chứa: <strong className="text-zinc-900">{totalCapacity.toLocaleString("vi-VN")}</strong>
          </span>
        </div>

        {hasTicketData ? (
          <div className="relative flex-1">
            <div className="absolute inset-x-2 top-2 h-[76%] rounded-2xl border border-zinc-100 bg-zinc-50/80" />

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-2 top-2 z-20 h-[76%]"
            >
              <polyline
                fill="none"
                stroke="rgb(8 145 178)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />
              {lineCoordinates.map((coord, index) => (
                <circle
                  key={`dot-${index}`}
                  cx={coord.x}
                  cy={coord.y}
                  r="1.2"
                  fill="rgb(8 145 178)"
                  stroke="white"
                  strokeWidth="0.8"
                >
                  <title>{`${chartData[index].name}: ${chartData[index].occupancy.toFixed(1)}%`}</title>
                </circle>
              ))}
            </svg>

            <div className="absolute inset-0 px-2 pb-2 pt-2">
              <div
                className="grid h-full gap-2"
                style={{ gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))` }}
              >
                {chartData.map((point, index) => {
                  const rawHeight = (point.sales / maxSales) * 100;
                  const barHeight = point.sales > 0 ? Math.max(rawHeight, 8) : 4;

                  return (
                    <div key={`${point.name}-${index}`} className="flex h-full flex-col justify-end">
                      <div className="relative h-[76%] overflow-hidden rounded-xl border border-zinc-200 bg-white">
                        <div
                          className="absolute inset-x-0 bottom-0 rounded-xl bg-gradient-to-t from-sky-500 to-cyan-400 transition-all duration-500"
                          style={{ height: `${barHeight}%` }}
                        />
                      </div>

                      <div className="mt-2 text-center">
                        <p className="text-[11px] font-medium text-zinc-500">{point.name}</p>
                        <p className="text-[11px] text-zinc-400">{point.sales.toLocaleString("vi-VN")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 text-center">
            <p className="text-sm font-semibold text-zinc-700">Chưa có dữ liệu bán vé trong 7 ngày gần nhất</p>
            <p className="mt-1 text-xs text-zinc-500">Khi có đơn hàng mới, biểu đồ sẽ tự động hiển thị theo ngày.</p>

            <div className="mt-4 flex w-full max-w-lg gap-2 overflow-x-auto pb-1">
              {chartData.map((point, index) => (
                <div
                  key={`${point.name}-empty-${index}`}
                  className="min-w-[54px] flex-1 rounded-lg border border-zinc-200 bg-white px-1.5 py-2"
                >
                  <p className="text-[11px] font-medium text-zinc-500">{point.name}</p>
                  <p className="text-[11px] text-zinc-400">0</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
