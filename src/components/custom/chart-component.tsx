"use client";

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
  value2?: number;
}

interface ChartComponentProps {
  data: ChartData[];
  type?: "line" | "area";
  color?: string;
  title?: string;
  height?: number;
}

export default function ChartComponent({
  data,
  type = "area",
  color = "#39FF14",
  title,
  height = 300,
}: ChartComponentProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1A1A] border border-[#39FF14]/30 rounded-lg p-3 shadow-xl">
          <p className="text-sm text-gray-400 mb-1">{payload[0].payload.name}</p>
          <p className="text-lg font-bold text-white">
            {payload[0].value}
            {payload[0].payload.unit || ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {type === "area" ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="name"
              stroke="#666"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#999" }}
            />
            <YAxis
              stroke="#666"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#999" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis
              dataKey="name"
              stroke="#666"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#999" }}
            />
            <YAxis
              stroke="#666"
              style={{ fontSize: "12px" }}
              tick={{ fill: "#999" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
