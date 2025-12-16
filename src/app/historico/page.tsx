"use client";

import { useState } from "react";
import Navbar from "@/components/custom/navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Database,
  Calendar,
  MapPin,
  TrendingUp,
  Download,
  Filter,
  Search,
  ChevronDown,
  BarChart3,
  Activity,
} from "lucide-react";

export default function HistoricoPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("historico");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  // Anos disponíveis (10+ anos)
  const years = Array.from({ length: 15 }, (_, i) => 2024 - i);

  // Regiões disponíveis
  const regions = [
    { code: "all", name: t("history.allRegions") },
    { code: "tornado-alley", name: "Tornado Alley" },
    { code: "midwest", name: "Midwest" },
    { code: "south", name: "South" },
    { code: "plains", name: "Great Plains" },
    { code: "rockies", name: "Rocky Mountains" },
  ];

  // Dados históricos por ano
  const historicalData: Record<number, any> = {
    2024: {
      totalEvents: 1247,
      severeEvents: 342,
      affectedStates: 18,
      totalDamage: "$2.8B",
      peakMonth: "May",
      avgHailSize: "4.2cm",
    },
    2023: {
      totalEvents: 1189,
      severeEvents: 318,
      affectedStates: 16,
      totalDamage: "$2.4B",
      peakMonth: "April",
      avgHailSize: "3.9cm",
    },
    2022: {
      totalEvents: 1356,
      severeEvents: 389,
      affectedStates: 19,
      totalDamage: "$3.2B",
      peakMonth: "May",
      avgHailSize: "4.5cm",
    },
    2021: {
      totalEvents: 1098,
      severeEvents: 287,
      affectedStates: 15,
      totalDamage: "$2.1B",
      peakMonth: "June",
      avgHailSize: "3.7cm",
    },
    2020: {
      totalEvents: 1423,
      severeEvents: 412,
      affectedStates: 20,
      totalDamage: "$3.6B",
      peakMonth: "May",
      avgHailSize: "4.8cm",
    },
    2019: {
      totalEvents: 1267,
      severeEvents: 356,
      affectedStates: 17,
      totalDamage: "$2.9B",
      peakMonth: "April",
      avgHailSize: "4.1cm",
    },
    2018: {
      totalEvents: 1145,
      severeEvents: 298,
      affectedStates: 16,
      totalDamage: "$2.3B",
      peakMonth: "May",
      avgHailSize: "3.8cm",
    },
    2017: {
      totalEvents: 1389,
      severeEvents: 401,
      affectedStates: 19,
      totalDamage: "$3.4B",
      peakMonth: "June",
      avgHailSize: "4.6cm",
    },
    2016: {
      totalEvents: 1201,
      severeEvents: 334,
      affectedStates: 17,
      totalDamage: "$2.7B",
      peakMonth: "May",
      avgHailSize: "4.0cm",
    },
    2015: {
      totalEvents: 1078,
      severeEvents: 276,
      affectedStates: 14,
      totalDamage: "$2.0B",
      peakMonth: "April",
      avgHailSize: "3.6cm",
    },
    2014: {
      totalEvents: 1312,
      severeEvents: 378,
      affectedStates: 18,
      totalDamage: "$3.1B",
      peakMonth: "May",
      avgHailSize: "4.4cm",
    },
    2013: {
      totalEvents: 1156,
      severeEvents: 312,
      affectedStates: 16,
      totalDamage: "$2.5B",
      peakMonth: "June",
      avgHailSize: "3.9cm",
    },
    2012: {
      totalEvents: 1234,
      severeEvents: 345,
      affectedStates: 17,
      totalDamage: "$2.8B",
      peakMonth: "May",
      avgHailSize: "4.2cm",
    },
    2011: {
      totalEvents: 1445,
      severeEvents: 428,
      affectedStates: 21,
      totalDamage: "$3.9B",
      peakMonth: "April",
      avgHailSize: "5.1cm",
    },
    2010: {
      totalEvents: 1089,
      severeEvents: 289,
      affectedStates: 15,
      totalDamage: "$2.2B",
      peakMonth: "May",
      avgHailSize: "3.8cm",
    },
  };

  const currentData = historicalData[selectedYear];

  // Eventos notáveis do ano selecionado
  const notableEvents = [
    {
      date: `${selectedYear}-05-15`,
      location: "Oklahoma City, OK",
      severity: "Extreme",
      hailSize: "Baseball (7cm)",
      damage: "$450M",
    },
    {
      date: `${selectedYear}-04-22`,
      location: "Dallas-Fort Worth, TX",
      severity: "Severe",
      hailSize: "Golf Ball (4.5cm)",
      damage: "$380M",
    },
    {
      date: `${selectedYear}-06-08`,
      location: "Kansas City, KS",
      severity: "Severe",
      hailSize: "Tennis Ball (6cm)",
      damage: "$320M",
    },
    {
      date: `${selectedYear}-05-28`,
      location: "Denver, CO",
      severity: "Moderate",
      hailSize: "Walnut (3cm)",
      damage: "$180M",
    },
    {
      date: `${selectedYear}-04-12`,
      location: "Wichita, KS",
      severity: "Severe",
      hailSize: "Golf Ball (4.5cm)",
      damage: "$290M",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#39FF14]/10">
                <Database className="w-8 h-8 text-[#39FF14]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                  {t("history.title")}
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  {t("history.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Year Filter */}
              <div className="relative flex-1">
                <button
                  onClick={() => setIsYearOpen(!isYearOpen)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#39FF14]" />
                    <span className="text-sm font-medium">{selectedYear}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isYearOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isYearOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1A1A1A] border border-white/20 shadow-2xl z-50 max-h-64 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setSelectedYear(year);
                            setIsYearOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                            selectedYear === year
                              ? "bg-[#39FF14]/20 text-white"
                              : "hover:bg-white/5 text-gray-300"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Region Filter */}
              <div className="relative flex-1">
                <button
                  onClick={() => setIsRegionOpen(!isRegionOpen)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#00BFFF]" />
                    <span className="text-sm font-medium">
                      {regions.find((r) => r.code === selectedRegion)?.name}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isRegionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isRegionOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1A1A1A] border border-white/20 shadow-2xl z-50">
                    <div className="p-2 space-y-1">
                      {regions.map((region) => (
                        <button
                          key={region.code}
                          onClick={() => {
                            setSelectedRegion(region.code);
                            setIsRegionOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                            selectedRegion === region.code
                              ? "bg-[#00BFFF]/20 text-white"
                              : "hover:bg-white/5 text-gray-300"
                          }`}
                        >
                          {region.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t("history.searchPlaceholder")}
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>

              {/* Download Button */}
              <button className="px-6 py-3 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/20 transition-all flex items-center gap-2 whitespace-nowrap">
                <Download className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {t("history.export")}
                </span>
              </button>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#39FF14]/10">
                  <Activity className="w-5 h-5 text-[#39FF14]" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("history.totalEvents")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {currentData.totalEvents.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentData.severeEvents} {t("history.severe")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#00BFFF]/10">
                  <MapPin className="w-5 h-5 text-[#00BFFF]" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("history.affectedStates")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {currentData.affectedStates}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("history.acrossUS")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("history.totalDamage")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {currentData.totalDamage}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("history.estimated")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Calendar className="w-5 h-5 text-orange-500" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("history.peakMonth")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {currentData.peakMonth}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("history.mostActive")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("history.avgHailSize")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {currentData.avgHailSize}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("history.diameter")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#39FF14]/10">
                  <Database className="w-5 h-5 text-[#39FF14]" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("history.dataPoints")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {(currentData.totalEvents * 12).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("history.collected")}
              </p>
            </div>
          </div>

          {/* Notable Events */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Activity className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {t("history.notableEvents")} - {selectedYear}
              </h3>
            </div>

            <div className="space-y-4">
              {notableEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-lg bg-red-500/20 text-red-500 text-xs font-semibold">
                        {event.severity}
                      </span>
                      <span className="text-xs text-gray-500">{event.date}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">
                      {event.location}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {t("history.hailSize")}: {event.hailSize}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{event.damage}</p>
                    <p className="text-xs text-gray-500">
                      {t("history.estimatedDamage")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
