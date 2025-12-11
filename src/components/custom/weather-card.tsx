"use client";

import { LucideIcon } from "lucide-react";

interface WeatherCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  color?: "green" | "blue" | "white";
}

export default function WeatherCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  color = "white",
}: WeatherCardProps) {
  const colorClasses = {
    green: "from-[#39FF14]/20 to-[#39FF14]/5 border-[#39FF14]/30",
    blue: "from-[#00BFFF]/20 to-[#00BFFF]/5 border-[#00BFFF]/30",
    white: "from-white/10 to-white/5 border-white/20",
  };

  const iconColorClasses = {
    green: "text-[#39FF14]",
    blue: "text-[#00BFFF]",
    white: "text-white",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorClasses[color]} border backdrop-blur-sm p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-${color === "green" ? "[#39FF14]" : color === "blue" ? "[#00BFFF]" : "white"}/10 group`}
    >
      {/* Background Glow Effect */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 bg-${color === "green" ? "[#39FF14]" : color === "blue" ? "[#00BFFF]" : "white"}/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`p-3 rounded-xl bg-${color === "green" ? "[#39FF14]" : color === "blue" ? "[#00BFFF]" : "white"}/10 backdrop-blur-sm`}
          >
            <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
          </div>
          {trend && trendValue && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend === "up"
                  ? "text-[#39FF14]"
                  : trend === "down"
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              <span>{trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold text-white">
              {value}
            </span>
            {unit && (
              <span className="text-lg text-gray-400 font-medium">{unit}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
