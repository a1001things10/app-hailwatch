"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "./language-selector";
import {
  Cloud,
  Calendar,
  Database,
  Play,
  Users,
  Menu,
  X,
  Calculator,
  Car,
} from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: "dashboard",
      label: t("nav.dashboard"),
      icon: Cloud,
      href: "/",
    },
    {
      id: "estimate",
      label: "Roof Repair Estimate",
      icon: Calculator,
      href: "/estimate",
    },
    {
      id: "auto-estimate",
      label: "Auto Repair Estimate",
      icon: Car,
      href: "/auto-estimate",
    },
    {
      id: "previsao",
      label: t("nav.forecast"),
      icon: Calendar,
      href: "/previsao",
    },
    {
      id: "historico",
      label: t("nav.history"),
      icon: Database,
      href: "/historico",
    },
    {
      id: "replay",
      label: t("nav.replay"),
      icon: Play,
      href: "/replay",
    },
    {
      id: "contatos",
      label: t("nav.contacts"),
      icon: Users,
      href: "/contatos",
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#39FF14]/20 to-[#00BFFF]/20 border border-[#39FF14]/30">
              <Cloud className="w-6 h-6 text-[#39FF14]" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-[#39FF14] bg-clip-text text-transparent hidden sm:block">
              HAIL WATCH
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Language Selector & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
