"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatKwacha } from "@/lib/utils";

export interface DailyPoint {
  day: string;
  revenue: number;
}

/** Revenue area chart in brand colors (burnt fill, honey grid). */
export function RevenueChart({ data }: { data: DailyPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="burntFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#BF4C00" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#FFBE00" stopOpacity={0.15} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#FFBE00" strokeOpacity={0.25} vertical={false} />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#7C2B00" }} tickLine={false} axisLine={false} interval={4} />
          <YAxis
            tick={{ fontSize: 11, fill: "#7C2B00" }}
            tickLine={false}
            axisLine={false}
            width={60}
            tickFormatter={(v: number) => `K${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value) => [formatKwacha(Number(value)), "Revenue"]}
            contentStyle={{ borderRadius: 16, border: "2px solid #FFBE00", color: "#7C2B00" }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#BF4C00" strokeWidth={3} fill="url(#burntFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
