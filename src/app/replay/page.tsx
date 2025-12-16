"use client";

import { useState } from "react";
import Navbar from "@/components/custom/navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Calendar,
  MapPin,
  Clock,
  Download,
  Share2,
  Maximize,
  Settings,
  Activity,
} from "lucide-react";

export default function ReplayPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("replay");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(0);

  // Eventos disponíveis para replay
  const replayEvents = [
    {
      id: 0,
      date: "2024-05-15",
      time: "14:30 - 18:45",
      location: "Oklahoma City, OK",
      severity: "Extreme",
      duration: "4h 15min",
      frames: 255,
      maxHailSize: "Baseball (7cm)",
      damage: "$450M",
    },
    {
      id: 1,
      date: "2024-04-22",
      time: "16:00 - 19:30",
      location: "Dallas-Fort Worth, TX",
      severity: "Severe",
      duration: "3h 30min",
      frames: 210,
      maxHailSize: "Golf Ball (4.5cm)",
      damage: "$380M",
    },
    {
      id: 2,
      date: "2024-06-08",
      time: "13:15 - 17:00",
      location: "Kansas City, KS",
      severity: "Severe",
      duration: "3h 45min",
      frames: 225,
      maxHailSize: "Tennis Ball (6cm)",
      damage: "$320M",
    },
  ];

  const currentEvent = replayEvents[selectedEvent];
  const totalFrames = currentEvent.frames;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    setCurrentFrame(Math.max(0, currentFrame - 10));
  };

  const handleSkipForward = () => {
    setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 10));
  };

  const formatTime = (frame: number) => {
    const totalMinutes = Math.floor((frame / totalFrames) * 255);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Extreme":
        return "text-red-500 bg-red-500/20 border-red-500/50";
      case "Severe":
        return "text-orange-500 bg-orange-500/20 border-orange-500/50";
      case "Moderate":
        return "text-[#39FF14] bg-[#39FF14]/20 border-[#39FF14]/50";
      default:
        return "text-gray-400 bg-gray-400/20 border-gray-400/50";
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#39FF14]/10">
                <Play className="w-8 h-8 text-[#39FF14]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                  {t("replay.title")}
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  {t("replay.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Event Selector */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {t("replay.selectEvent")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {replayEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event.id);
                    setCurrentFrame(0);
                    setIsPlaying(false);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedEvent === event.id
                      ? "bg-[#39FF14]/20 border-[#39FF14]/50"
                      : "bg-white/5 border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getSeverityColor(
                        event.severity
                      )}`}
                    >
                      {event.severity}
                    </span>
                    <span className="text-xs text-gray-500">{event.date}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {event.location}
                  </h4>
                  <p className="text-xs text-gray-400">{event.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Radar Display */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm overflow-hidden">
            {/* Radar Screen */}
            <div className="relative aspect-video bg-black/50">
              {/* Simulated Radar Image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-16 h-16 text-[#39FF14] mx-auto mb-4 animate-pulse" />
                  <p className="text-white font-semibold mb-2">
                    {t("replay.radarView")}
                  </p>
                  <p className="text-sm text-gray-400">
                    {currentEvent.location}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Frame {currentFrame + 1} / {totalFrames}
                  </p>
                </div>
              </div>

              {/* Overlay Info */}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20">
                  <p className="text-xs text-gray-400 mb-1">
                    {t("replay.timestamp")}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {currentEvent.date} {formatTime(currentFrame)}
                  </p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20">
                  <p className="text-xs text-gray-400 mb-1">
                    {t("replay.maxHailSize")}
                  </p>
                  <p className="text-sm font-semibold text-orange-500">
                    {currentEvent.maxHailSize}
                  </p>
                </div>
              </div>

              {/* Controls Overlay */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20 hover:bg-white/10 transition-all">
                  <Settings className="w-4 h-4 text-white" />
                </button>
                <button className="p-2 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20 hover:bg-white/10 transition-all">
                  <Maximize className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">
                    {formatTime(currentFrame)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {currentEvent.duration}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={totalFrames - 1}
                  value={currentFrame}
                  onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full bg-white/10 appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #39FF14 0%, #39FF14 ${
                      (currentFrame / (totalFrames - 1)) * 100
                    }%, rgba(255,255,255,0.1) ${
                      (currentFrame / (totalFrames - 1)) * 100
                    }%, rgba(255,255,255,0.1) 100%)`,
                  }}
                />
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleSkipBack}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 transition-all"
                >
                  <SkipBack className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={handlePlayPause}
                  className="p-4 rounded-xl bg-[#39FF14]/20 hover:bg-[#39FF14]/30 border-2 border-[#39FF14]/50 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-[#39FF14]" />
                  ) : (
                    <Play className="w-6 h-6 text-[#39FF14]" />
                  )}
                </button>

                <button
                  onClick={handleSkipForward}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/20 transition-all"
                >
                  <SkipForward className="w-5 h-5 text-white" />
                </button>

                {/* Speed Control */}
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-xs text-gray-400">
                    {t("replay.speed")}:
                  </span>
                  {[0.5, 1, 2, 4].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        playbackSpeed === speed
                          ? "bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50"
                          : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Event Info */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                {t("replay.eventDetails")}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#39FF14] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      {t("replay.date")}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {currentEvent.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#00BFFF] mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      {t("replay.timeRange")}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {currentEvent.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      {t("replay.location")}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {currentEvent.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      {t("replay.severity")}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${getSeverityColor(
                        currentEvent.severity
                      )}`}
                    >
                      {currentEvent.severity}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                {t("replay.statistics")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-400 mb-2">
                    {t("replay.duration")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {currentEvent.duration}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-400 mb-2">
                    {t("replay.frames")}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {currentEvent.frames}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-400 mb-2">
                    {t("replay.maxHail")}
                  </p>
                  <p className="text-lg font-bold text-orange-500">
                    {currentEvent.maxHailSize}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <p className="text-xs text-gray-400 mb-2">
                    {t("replay.damage")}
                  </p>
                  <p className="text-2xl font-bold text-red-500">
                    {currentEvent.damage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/20 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {t("replay.download")}
              </span>
            </button>
            <button className="px-6 py-3 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/50 text-[#00BFFF] hover:bg-[#00BFFF]/20 transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-semibold">{t("replay.share")}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
