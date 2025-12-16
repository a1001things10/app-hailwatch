"use client";

import { useState } from "react";
import Navbar from "@/components/custom/navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
} from "lucide-react";

export default function PrevisaoPage() {
  const { t } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [activeTab, setActiveTab] = useState("previsao");

  // Próximos 12 meses
  const months = [
    { name: t("months.january"), short: "Jan" },
    { name: t("months.february"), short: "Fev" },
    { name: t("months.march"), short: "Mar" },
    { name: t("months.april"), short: "Abr" },
    { name: t("months.may"), short: "Mai" },
    { name: t("months.june"), short: "Jun" },
    { name: t("months.july"), short: "Jul" },
    { name: t("months.august"), short: "Ago" },
    { name: t("months.september"), short: "Set" },
    { name: t("months.october"), short: "Out" },
    { name: t("months.november"), short: "Nov" },
    { name: t("months.december"), short: "Dez" },
  ];

  // Dados de previsão por mês
  const forecastData = [
    {
      month: 0,
      riskLevel: "high",
      events: 45,
      regions: ["Oklahoma", "Texas", "Kansas"],
      peakDays: [5, 12, 18, 24],
    },
    {
      month: 1,
      riskLevel: "high",
      events: 52,
      regions: ["Texas", "Louisiana", "Arkansas"],
      peakDays: [3, 9, 15, 22, 28],
    },
    {
      month: 2,
      riskLevel: "high",
      events: 68,
      regions: ["Oklahoma", "Kansas", "Nebraska", "Texas"],
      peakDays: [7, 14, 21, 28],
    },
    {
      month: 3,
      riskLevel: "high",
      events: 89,
      regions: ["Oklahoma", "Kansas", "Texas", "Missouri", "Arkansas"],
      peakDays: [4, 11, 18, 25],
    },
    {
      month: 4,
      riskLevel: "high",
      events: 102,
      regions: ["Oklahoma", "Kansas", "Nebraska", "Texas", "Colorado"],
      peakDays: [2, 9, 16, 23, 30],
    },
    {
      month: 5,
      riskLevel: "medium",
      events: 78,
      regions: ["Colorado", "Wyoming", "Montana"],
      peakDays: [6, 13, 20, 27],
    },
    {
      month: 6,
      riskLevel: "medium",
      events: 56,
      regions: ["Colorado", "Wyoming"],
      peakDays: [4, 11, 18, 25],
    },
    {
      month: 7,
      riskLevel: "low",
      events: 34,
      regions: ["Colorado"],
      peakDays: [8, 15, 22],
    },
    {
      month: 8,
      riskLevel: "medium",
      events: 42,
      regions: ["Texas", "Oklahoma"],
      peakDays: [5, 12, 19, 26],
    },
    {
      month: 9,
      riskLevel: "medium",
      events: 38,
      regions: ["Texas", "Louisiana"],
      peakDays: [3, 10, 17, 24, 31],
    },
    {
      month: 10,
      riskLevel: "low",
      events: 28,
      regions: ["Texas"],
      peakDays: [7, 14, 21],
    },
    {
      month: 11,
      riskLevel: "low",
      events: 22,
      regions: ["Texas", "Louisiana"],
      peakDays: [5, 12, 19],
    },
  ];

  const currentForecast = forecastData[selectedMonth];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "from-red-500/20 to-orange-500/20 border-red-500/50";
      case "medium":
        return "from-[#39FF14]/20 to-yellow-500/20 border-[#39FF14]/50";
      case "low":
        return "from-[#00BFFF]/20 to-blue-500/20 border-[#00BFFF]/50";
      default:
        return "from-white/10 to-white/5 border-white/20";
    }
  };

  const getRiskText = (risk: string) => {
    switch (risk) {
      case "high":
        return t("forecast.highRisk");
      case "medium":
        return t("forecast.mediumRisk");
      case "low":
        return t("forecast.lowRisk");
      default:
        return "Normal";
    }
  };

  const getRiskTextColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-[#39FF14]";
      case "low":
        return "text-[#00BFFF]";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
              {t("forecast.title")}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              {t("forecast.subtitle")}
            </p>
          </div>

          {/* Month Selector */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() =>
                  setSelectedMonth((prev) => (prev > 0 ? prev - 1 : 11))
                }
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {months[selectedMonth].name} 2025
                </h2>
                <p className="text-sm text-gray-400">
                  {currentForecast.events} {t("forecast.predictedEvents")}
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedMonth((prev) => (prev < 11 ? prev + 1 : 0))
                }
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {months.map((month, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMonth(index)}
                  className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                    selectedMonth === index
                      ? "bg-[#39FF14]/20 text-[#39FF14] border-2 border-[#39FF14]/50"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {month.short}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Overview */}
          <div
            className={`mb-8 rounded-2xl bg-gradient-to-r border-2 backdrop-blur-sm p-6 ${getRiskColor(
              currentForecast.riskLevel
            )}`}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-black/30">
                <AlertTriangle
                  className={`w-6 h-6 ${getRiskTextColor(
                    currentForecast.riskLevel
                  )}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {getRiskText(currentForecast.riskLevel)}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full bg-black/30 text-xs font-semibold ${getRiskTextColor(
                      currentForecast.riskLevel
                    )}`}
                  >
                    {currentForecast.events} {t("forecast.events")}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  {t("forecast.riskDescription")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentForecast.regions.map((region, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-black/30 text-xs text-white border border-white/20"
                    >
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {region}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#39FF14]/10">
                  <Calendar className="w-5 h-5 text-[#39FF14]" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {t("forecast.peakDays")}
                </h3>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 transition-all">
                  <Download className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 transition-all">
                  <Share2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-400 p-2"
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const isPeakDay = currentForecast.peakDays.includes(day);
                return (
                  <div
                    key={day}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                      isPeakDay
                        ? "bg-red-500/20 text-red-500 border-2 border-red-500/50 hover:bg-red-500/30"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#39FF14]/10">
                  <TrendingUp className="w-5 h-5 text-[#39FF14]" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("forecast.avgEvents")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {currentForecast.events}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("forecast.perMonth")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#00BFFF]/10">
                  <MapPin className="w-5 h-5 text-[#00BFFF]" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("forecast.affectedRegions")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {currentForecast.regions.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("forecast.mainRegions")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("forecast.peakDaysCount")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {currentForecast.peakDays.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("forecast.highRiskDays")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Cloud className="w-5 h-5 text-orange-500" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("forecast.riskLevel")}
                </h4>
              </div>
              <p
                className={`text-3xl font-bold ${getRiskTextColor(
                  currentForecast.riskLevel
                )}`}
              >
                {getRiskText(currentForecast.riskLevel)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("forecast.forMonth")}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
