"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap, MapPin, History, DollarSign, User } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: MapPin, href: "/" },
    { id: "historico", label: "Histórico", icon: History, href: "/historico" },
    { id: "pricing", label: "Pricing", icon: DollarSign, href: "/pricing" },
    { id: "account", label: "Account", icon: User, href: "/dashboard" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#39FF14] to-green-600 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#39FF14] bg-clip-text text-transparent">
                HailWatch
              </h1>
              <p className="text-xs text-gray-500">Premium Monitoring</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
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
                      ? "bg-[#39FF14]/20 text-[#39FF14] font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <Link href="/auth/signup">
              <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#39FF14] to-green-600 text-black font-bold hover:shadow-2xl hover:shadow-[#39FF14]/30 transition-all duration-300">
                Get Started
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
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
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-[#39FF14]/20 text-[#39FF14] font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile CTA */}
              <Link href="/auth/signup">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-green-600 text-black font-bold hover:shadow-2xl hover:shadow-[#39FF14]/30 transition-all duration-300"
                >
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
