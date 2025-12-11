"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/custom/navbar";
import {
  Zap,
  Shield,
  Calendar,
  CreditCard,
  LogOut,
  Settings,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";

interface UserSubscription {
  id: string;
  plan_type: string;
  modules: string[];
  status: string;
  price_paid: number;
  started_at: string;
  expires_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Verificar se o Supabase está configurado
      if (!supabase) {
        setSupabaseConfigured(false);
        setLoading(false);
        return;
      }

      setSupabaseConfigured(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      // Fetch subscription data
      const { data: subData } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (subData) {
        setSubscription(subData);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
  };

  const getPlanName = (planType: string) => {
    const plans: Record<string, string> = {
      hailwatch_monthly: "HailWatch Monthly",
      hailwatch_yearly: "HailWatch Yearly",
      full_monthly: "Complete Suite Monthly",
      full_yearly: "Complete Suite Yearly",
    };
    return plans[planType] || planType;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 rounded-full bg-[#39FF14]/10 mb-4 animate-pulse">
            <Zap className="w-8 h-8 text-[#39FF14]" />
          </div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Tela de configuração do Supabase
  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <Navbar activeTab="dashboard" onTabChange={() => {}} />
        
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/30 backdrop-blur-sm p-8 text-center">
              <div className="inline-flex p-4 rounded-full bg-orange-500/20 mb-6">
                <AlertCircle className="w-12 h-12 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Supabase Configuration Required
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                To access your dashboard and subscription features, you need to configure your Supabase credentials.
              </p>
              <div className="bg-black/30 rounded-xl p-6 mb-6 text-left">
                <h3 className="text-xl font-bold text-white mb-4">How to configure:</h3>
                <ol className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] flex items-center justify-center text-sm font-bold">1</span>
                    <span>Go to <strong className="text-white">Project Settings → Integrations</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] flex items-center justify-center text-sm font-bold">2</span>
                    <span>Click <strong className="text-white">Connect Supabase</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#39FF14]/20 text-[#39FF14] flex items-center justify-center text-sm font-bold">3</span>
                    <span>Follow the OAuth flow to connect your account</span>
                  </li>
                </ol>
              </div>
              <Link href="/">
                <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#39FF14] to-green-600 text-black font-bold hover:shadow-2xl hover:shadow-[#39FF14]/30 transition-all duration-300">
                  Return to Home
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar activeTab="dashboard" onTabChange={() => {}} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Welcome back, {user?.user_metadata?.full_name || "User"}!
              </h1>
              <p className="text-gray-400">Manage your subscription and access your tools</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all text-gray-300 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>

          {/* Subscription Status */}
          {subscription ? (
            <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#39FF14]/10 to-green-600/5 border border-[#39FF14]/30 backdrop-blur-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[#39FF14]/20">
                    <CheckCircle className="w-6 h-6 text-[#39FF14]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Active Subscription</h3>
                    <p className="text-sm text-gray-400">
                      {getPlanName(subscription.plan_type)}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-black/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Amount Paid</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ${subscription.price_paid.toFixed(2)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Started</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatDate(subscription.started_at)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400">Renews</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatDate(subscription.expires_at)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {subscription.modules.map((module) => (
                  <span
                    key={module}
                    className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium"
                  >
                    {module === "hailwatch" ? "HailWatch Monitoring" : "Estimate & Supplement"}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/30 backdrop-blur-sm p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">No Active Subscription</h3>
                  <p className="text-gray-400 mb-4">
                    Subscribe to a plan to access HailWatch monitoring and professional tools.
                  </p>
                  <Link href="/pricing">
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-green-600 text-black font-bold hover:shadow-2xl hover:shadow-[#39FF14]/30 transition-all duration-300">
                      View Plans
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick Access Modules */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* HailWatch Module */}
            <Link
              href="/"
              className={`rounded-2xl border-2 backdrop-blur-sm p-6 transition-all duration-300 hover:scale-105 ${
                subscription?.modules.includes("hailwatch")
                  ? "border-[#39FF14]/50 bg-gradient-to-br from-[#39FF14]/10 to-green-600/5 hover:border-[#39FF14]"
                  : "border-white/20 bg-gradient-to-br from-white/5 to-white/0 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#39FF14]/20">
                  <Zap className="w-8 h-8 text-[#39FF14]" />
                </div>
                {subscription?.modules.includes("hailwatch") ? (
                  <span className="px-3 py-1 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold">
                    ACTIVE
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">
                    LOCKED
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">HailWatch Monitoring</h3>
              <p className="text-gray-400 text-sm mb-4">
                Real-time hail tracking, severe weather alerts, and historical data access
              </p>
              <div className="flex items-center gap-2 text-[#39FF14]">
                <span className="text-sm font-semibold">
                  {subscription?.modules.includes("hailwatch") ? "Open Dashboard" : "Upgrade to Access"}
                </span>
                <TrendingUp className="w-4 h-4" />
              </div>
            </Link>

            {/* Estimate Module */}
            <div
              className={`rounded-2xl border-2 backdrop-blur-sm p-6 transition-all duration-300 ${
                subscription?.modules.includes("estimate")
                  ? "border-[#00BFFF]/50 bg-gradient-to-br from-[#00BFFF]/10 to-blue-600/5 hover:border-[#00BFFF] hover:scale-105 cursor-pointer"
                  : "border-white/20 bg-gradient-to-br from-white/5 to-white/0 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-[#00BFFF]/20">
                  <FileText className="w-8 h-8 text-[#00BFFF]" />
                </div>
                {subscription?.modules.includes("estimate") ? (
                  <span className="px-3 py-1 rounded-full bg-[#00BFFF]/20 text-[#00BFFF] text-xs font-bold">
                    ACTIVE
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-gray-500/20 text-gray-400 text-xs font-bold">
                    LOCKED
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Estimate & Supplement</h3>
              <p className="text-gray-400 text-sm mb-4">
                Professional damage estimation tools and insurance supplement generation
              </p>
              <div className="flex items-center gap-2 text-[#00BFFF]">
                <span className="text-sm font-semibold">
                  {subscription?.modules.includes("estimate") ? "Coming Soon" : "Upgrade to Access"}
                </span>
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-white/10">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Account Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Email</p>
                    <p className="text-white">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400">Account Created</p>
                    <p className="text-white">
                      {user?.created_at ? formatDate(user.created_at) : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {subscription && (
                <Link href="/pricing">
                  <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Manage Subscription</p>
                        <p className="text-white text-sm">Upgrade, downgrade, or cancel</p>
                      </div>
                      <Shield className="w-5 h-5 text-[#39FF14]" />
                    </div>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
