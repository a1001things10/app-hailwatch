"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/custom/navbar";
import WeatherCard from "@/components/custom/weather-card";
import ChartComponent from "@/components/custom/chart-component";
import {
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Activity,
  Globe,
  Filter,
  ChevronDown,
  Database,
  Calendar,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Países com histórico de chuvas de granizo
  const countriesWithHail = [
    { code: "all", name: "Todos os Países", flag: "🌍" },
    { code: "us", name: "Estados Unidos", flag: "🇺🇸" },
    { code: "br", name: "Brasil", flag: "🇧🇷" },
    { code: "ar", name: "Argentina", flag: "🇦🇷" },
    { code: "au", name: "Austrália", flag: "🇦🇺" },
    { code: "cn", name: "China", flag: "🇨🇳" },
    { code: "in", name: "Índia", flag: "🇮🇳" },
    { code: "za", name: "África do Sul", flag: "🇿🇦" },
    { code: "ca", name: "Canadá", flag: "🇨🇦" },
  ];

  // Áreas de monitoramento nos Estados Unidos (expandido)
  const monitoringAreas = [
    // Estados Unidos - Tornado Alley e regiões críticas
    {
      id: 1,
      name: "Oklahoma City, OK",
      country: "us",
      status: "high",
      hailProbability: 92,
      lastUpdate: "Há 3 min",
      temperature: 29,
      windSpeed: 68,
      hailSize: "Golf Ball (4.5cm)",
    },
    {
      id: 2,
      name: "Dallas-Fort Worth, TX",
      country: "us",
      status: "high",
      hailProbability: 88,
      lastUpdate: "Há 5 min",
      temperature: 31,
      windSpeed: 62,
      hailSize: "Baseball (7cm)",
    },
    {
      id: 3,
      name: "Kansas City, KS",
      country: "us",
      status: "high",
      hailProbability: 85,
      lastUpdate: "Há 7 min",
      temperature: 27,
      windSpeed: 58,
      hailSize: "Tennis Ball (6cm)",
    },
    {
      id: 4,
      name: "Denver, CO",
      country: "us",
      status: "medium",
      hailProbability: 74,
      lastUpdate: "Há 10 min",
      temperature: 24,
      windSpeed: 52,
      hailSize: "Ping Pong (4cm)",
    },
    {
      id: 5,
      name: "Omaha, NE",
      country: "us",
      status: "medium",
      hailProbability: 68,
      lastUpdate: "Há 12 min",
      temperature: 26,
      windSpeed: 48,
      hailSize: "Marble (2cm)",
    },
    {
      id: 6,
      name: "Wichita, KS",
      country: "us",
      status: "high",
      hailProbability: 81,
      lastUpdate: "Há 8 min",
      temperature: 28,
      windSpeed: 55,
      hailSize: "Golf Ball (4.5cm)",
    },
    {
      id: 7,
      name: "Amarillo, TX",
      country: "us",
      status: "medium",
      hailProbability: 71,
      lastUpdate: "Há 15 min",
      temperature: 30,
      windSpeed: 50,
      hailSize: "Pea (1cm)",
    },
    {
      id: 8,
      name: "Tulsa, OK",
      country: "us",
      status: "high",
      hailProbability: 79,
      lastUpdate: "Há 9 min",
      temperature: 28,
      windSpeed: 60,
      hailSize: "Walnut (3cm)",
    },
    {
      id: 9,
      name: "Colorado Springs, CO",
      country: "us",
      status: "medium",
      hailProbability: 65,
      lastUpdate: "Há 18 min",
      temperature: 23,
      windSpeed: 45,
      hailSize: "Marble (2cm)",
    },
    {
      id: 10,
      name: "Lubbock, TX",
      country: "us",
      status: "medium",
      hailProbability: 70,
      lastUpdate: "Há 14 min",
      temperature: 32,
      windSpeed: 47,
      hailSize: "Pea (1cm)",
    },
    {
      id: 11,
      name: "Topeka, KS",
      country: "us",
      status: "high",
      hailProbability: 83,
      lastUpdate: "Há 6 min",
      temperature: 27,
      windSpeed: 56,
      hailSize: "Golf Ball (4.5cm)",
    },
    {
      id: 12,
      name: "Sioux Falls, SD",
      country: "us",
      status: "low",
      hailProbability: 42,
      lastUpdate: "Há 25 min",
      temperature: 22,
      windSpeed: 35,
      hailSize: "Pea (1cm)",
    },
    // Brasil
    {
      id: 13,
      name: "São Paulo - Centro",
      country: "br",
      status: "high",
      hailProbability: 85,
      lastUpdate: "Há 5 min",
      temperature: 24,
      windSpeed: 45,
      hailSize: "Marble (2cm)",
    },
    {
      id: 14,
      name: "Porto Alegre, RS",
      country: "br",
      status: "medium",
      hailProbability: 67,
      lastUpdate: "Há 16 min",
      temperature: 21,
      windSpeed: 42,
      hailSize: "Pea (1cm)",
    },
    // Argentina
    {
      id: 15,
      name: "Buenos Aires - Centro",
      country: "ar",
      status: "high",
      hailProbability: 78,
      lastUpdate: "Há 8 min",
      temperature: 22,
      windSpeed: 52,
      hailSize: "Walnut (3cm)",
    },
    // Austrália
    {
      id: 16,
      name: "Sydney - CBD",
      country: "au",
      status: "low",
      hailProbability: 25,
      lastUpdate: "Há 20 min",
      temperature: 19,
      windSpeed: 18,
      hailSize: "Pea (1cm)",
    },
    // China
    {
      id: 17,
      name: "Beijing - Chaoyang",
      country: "cn",
      status: "medium",
      hailProbability: 55,
      lastUpdate: "Há 15 min",
      temperature: 26,
      windSpeed: 32,
      hailSize: "Marble (2cm)",
    },
    // Índia
    {
      id: 18,
      name: "Mumbai - Centro",
      country: "in",
      status: "high",
      hailProbability: 72,
      lastUpdate: "Há 10 min",
      temperature: 31,
      windSpeed: 41,
      hailSize: "Walnut (3cm)",
    },
    // Canadá
    {
      id: 19,
      name: "Calgary, AB",
      country: "ca",
      status: "medium",
      hailProbability: 63,
      lastUpdate: "Há 17 min",
      temperature: 18,
      windSpeed: 38,
      hailSize: "Marble (2cm)",
    },
    // África do Sul
    {
      id: 20,
      name: "Johannesburg",
      country: "za",
      status: "low",
      hailProbability: 38,
      lastUpdate: "Há 22 min",
      temperature: 20,
      windSpeed: 28,
      hailSize: "Pea (1cm)",
    },
  ];

  // Filtrar áreas por país selecionado
  const filteredAreas =
    selectedCountry === "all"
      ? monitoringAreas
      : monitoringAreas.filter((area) => area.country === selectedCountry);

  // Mock data para gráficos
  const temperatureData = [
    { name: "00h", value: 18 },
    { name: "04h", value: 16 },
    { name: "08h", value: 20 },
    { name: "12h", value: 25 },
    { name: "16h", value: 28 },
    { name: "20h", value: 22 },
    { name: "24h", value: 19 },
  ];

  const precipitationData = [
    { name: "Seg", value: 12 },
    { name: "Ter", value: 8 },
    { name: "Qua", value: 25 },
    { name: "Qui", value: 45 },
    { name: "Sex", value: 30 },
    { name: "Sáb", value: 15 },
    { name: "Dom", value: 5 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "border-red-500/50 bg-red-500/10";
      case "medium":
        return "border-[#39FF14]/50 bg-[#39FF14]/10";
      case "low":
        return "border-[#00BFFF]/50 bg-[#00BFFF]/10";
      default:
        return "border-white/20 bg-white/5";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "high":
        return "Risco Alto";
      case "medium":
        return "Risco Médio";
      case "low":
        return "Risco Baixo";
      default:
        return "Normal";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
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
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                  HailWatch USA
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Monitoramento em tempo real de granizo nos Estados Unidos
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-[#39FF14]/20 backdrop-blur-sm">
                <MapPin className="w-4 h-4 text-[#39FF14]" />
                <span className="text-sm font-medium">
                  {countriesWithHail.find((c) => c.code === selectedCountry)
                    ?.name || "Global"}
                </span>
              </div>
            </div>
          </div>

          {/* Database Access Banner */}
          <Link href="/historico">
            <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#39FF14]/10 to-[#00BFFF]/10 border border-[#39FF14]/30 backdrop-blur-sm hover:border-[#39FF14]/50 transition-all duration-300 cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#39FF14]/20 group-hover:bg-[#39FF14]/30 transition-all">
                  <Database className="w-6 h-6 text-[#39FF14]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-white">
                      Banco de Dados Histórico
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-semibold">
                      NOVO
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    Acesse o histórico completo de chuvas de granizo dos últimos 5 anos. 
                    Dados precisos com data, hora, localização e detalhes completos de cada evento.
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      2019-2024
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      8 países monitorados
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-4 h-4" />
                      Dados em tempo real
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center text-[#39FF14] group-hover:translate-x-2 transition-transform">
                  <ChevronDown className="w-6 h-6 -rotate-90" />
                </div>
              </div>
            </div>
          </Link>

          {/* Alert Banner */}
          <div className="mb-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">
                  Alerta Severo - Tornado Alley
                </h3>
                <p className="text-sm text-gray-300">
                  Condições extremas detectadas em Oklahoma, Kansas e Texas.
                  Granizo de até 7cm (tamanho de baseball) esperado nas
                  próximas 2 horas. Procure abrigo imediatamente.
                </p>
              </div>
            </div>
          </div>

          {/* Weather Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <WeatherCard
              title="Temperatura"
              value="29"
              unit="°C"
              icon={Cloud}
              trend="up"
              trendValue="+3°C"
              color="blue"
            />
            <WeatherCard
              title="Precipitação"
              value="85"
              unit="%"
              icon={CloudRain}
              trend="up"
              trendValue="+25%"
              color="green"
            />
            <WeatherCard
              title="Velocidade do Vento"
              value="68"
              unit="km/h"
              icon={Wind}
              trend="up"
              trendValue="+15 km/h"
              color="white"
            />
            <WeatherCard
              title="Umidade"
              value="82"
              unit="%"
              icon={Droplets}
              trend="up"
              trendValue="+8%"
              color="blue"
            />
          </div>

          {/* Monitoring Areas Section */}
          <div className="mb-8 sm:mb-12">
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              {/* Header with Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#39FF14]/10">
                    <Globe className="w-5 h-5 text-[#39FF14]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Áreas de Monitoramento
                    </h3>
                    <p className="text-sm text-gray-400">
                      {filteredAreas.length} área(s) ativa(s)
                      {selectedCountry === "us" && " nos Estados Unidos"}
                    </p>
                  </div>
                </div>

                {/* Country Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all duration-300"
                  >
                    <Filter className="w-4 h-4 text-[#39FF14]" />
                    <span className="text-sm font-medium">
                      {countriesWithHail.find((c) => c.code === selectedCountry)
                        ?.flag || "🌍"}{" "}
                      {countriesWithHail.find((c) => c.code === selectedCountry)
                        ?.name || "Filtrar"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isFilterOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#1A1A1A] border border-white/20 shadow-2xl z-50 overflow-hidden">
                      <div className="p-2 space-y-1">
                        {countriesWithHail.map((country) => (
                          <button
                            key={country.code}
                            onClick={() => {
                              setSelectedCountry(country.code);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                              selectedCountry === country.code
                                ? "bg-[#39FF14]/20 text-white"
                                : "hover:bg-white/5 text-gray-300"
                            }`}
                          >
                            <span className="text-xl">{country.flag}</span>
                            <span className="text-sm font-medium">
                              {country.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Monitoring Areas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAreas.map((area) => (
                  <div
                    key={area.id}
                    className={`rounded-xl border-2 backdrop-blur-sm p-5 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${getStatusColor(
                      area.status
                    )}`}
                  >
                    {/* Area Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">
                            {
                              countriesWithHail.find(
                                (c) => c.code === area.country
                              )?.flag
                            }
                          </span>
                          <h4 className="text-base font-bold text-white">
                            {area.name}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-400">
                          Atualizado {area.lastUpdate}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-semibold ${getStatusTextColor(
                          area.status
                        )} bg-black/30`}
                      >
                        {getStatusText(area.status)}
                      </div>
                    </div>

                    {/* Hail Probability */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">
                          Probabilidade de Granizo
                        </span>
                        <span className="text-sm font-bold text-white">
                          {area.hailProbability}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            area.status === "high"
                              ? "bg-red-500"
                              : area.status === "medium"
                              ? "bg-[#39FF14]"
                              : "bg-[#00BFFF]"
                          }`}
                          style={{ width: `${area.hailProbability}%` }}
                        />
                      </div>
                    </div>

                    {/* Hail Size Badge */}
                    <div className="mb-4 p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                      <p className="text-xs text-orange-400 font-semibold">
                        Tamanho esperado: {area.hailSize}
                      </p>
                    </div>

                    {/* Weather Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20">
                        <Cloud className="w-4 h-4 text-[#00BFFF]" />
                        <div>
                          <p className="text-xs text-gray-400">Temp.</p>
                          <p className="text-sm font-semibold text-white">
                            {area.temperature}°C
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20">
                        <Wind className="w-4 h-4 text-[#39FF14]" />
                        <div>
                          <p className="text-xs text-gray-400">Vento</p>
                          <p className="text-sm font-semibold text-white">
                            {area.windSpeed} km/h
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredAreas.length === 0 && (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Nenhuma área de monitoramento encontrada para este país.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {/* Temperature Chart */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-[#00BFFF]/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#00BFFF]/10">
                  <TrendingUp className="w-5 h-5 text-[#00BFFF]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Temperatura (24h)
                  </h3>
                  <p className="text-sm text-gray-400">Previsão para hoje</p>
                </div>
              </div>
              <ChartComponent
                data={temperatureData}
                type="area"
                color="#00BFFF"
                height={250}
              />
            </div>

            {/* Precipitation Chart */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-[#39FF14]/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#39FF14]/10">
                  <Activity className="w-5 h-5 text-[#39FF14]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Precipitação (7 dias)
                  </h3>
                  <p className="text-sm text-gray-400">Histórico semanal</p>
                </div>
              </div>
              <ChartComponent
                data={precipitationData}
                type="area"
                color="#39FF14"
                height={250}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#39FF14]/10">
                <Activity className="w-5 h-5 text-[#39FF14]" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Atividade Recente - Estados Unidos
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  time: "Há 3 min",
                  event: "Granizo severo detectado (Baseball size)",
                  location: "Dallas-Fort Worth, TX",
                  severity: "high",
                },
                {
                  time: "Há 5 min",
                  event: "Alerta de tornado e granizo",
                  location: "Oklahoma City, OK",
                  severity: "high",
                },
                {
                  time: "Há 8 min",
                  event: "Tempestade severa com granizo",
                  location: "Kansas City, KS",
                  severity: "high",
                },
                {
                  time: "Há 12 min",
                  event: "Condições favoráveis para granizo",
                  location: "Denver, CO",
                  severity: "medium",
                },
                {
                  time: "Há 18 min",
                  event: "Monitoramento ativo iniciado",
                  location: "Wichita, KS",
                  severity: "medium",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.severity === "high"
                        ? "bg-red-500"
                        : activity.severity === "medium"
                        ? "bg-[#39FF14]"
                        : "bg-[#00BFFF]"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-white">
                        {activity.event}
                      </h4>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{activity.location}</p>
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
