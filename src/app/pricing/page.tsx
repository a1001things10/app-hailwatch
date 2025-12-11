"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/custom/navbar";
import {
  Check,
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Camera,
  Download,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    {
      id: "hailwatch",
      name: "HailWatch",
      tagline: "Essential Monitoring",
      description: "Real-time hail tracking and severe weather alerts",
      icon: Zap,
      monthlyPrice: 99,
      yearlyPrice: 999,
      yearlyDiscount: 198,
      popular: false,
      modules: ["hailwatch"],
      features: [
        "Real-time hail tracking",
        "Severe weather alerts",
        "Historical data access (5 years)",
        "12 US monitoring areas",
        "Mobile notifications",
        "Email alerts",
        "Interactive maps",
        "24/7 monitoring",
      ],
      cta: "Start Monitoring",
      gradient: "from-[#00BFFF] to-blue-600",
    },
    {
      id: "complete",
      name: "Complete Suite",
      tagline: "Professional Solution",
      description: "Full access to monitoring + estimation tools",
      icon: Sparkles,
      monthlyPrice: 199,
      yearlyPrice: 1999,
      yearlyDiscount: 398,
      popular: true,
      modules: ["hailwatch", "estimate"],
      features: [
        "Everything in HailWatch",
        "Damage estimation tools",
        "Insurance supplement generator",
        "Photo documentation system",
        "PDF report export",
        "Priority support",
        "Advanced analytics",
        "Custom reporting",
        "API access",
      ],
      cta: "Get Complete Access",
      gradient: "from-[#39FF14] to-green-600",
    },
  ];

  const modules = [
    {
      name: "HailWatch Monitoring",
      icon: Shield,
      description: "Real-time monitoring and alerts for severe weather conditions",
      features: [
        "Live hail tracking across 12 US regions",
        "Instant severe weather notifications",
        "5-year historical database access",
        "Interactive severity maps",
        "Customizable alert thresholds",
      ],
    },
    {
      name: "Estimate & Supplement",
      icon: FileText,
      description: "Professional damage assessment and insurance documentation",
      features: [
        "AI-powered damage estimation",
        "Insurance supplement generation",
        "Photo documentation with GPS tagging",
        "Professional PDF reports",
        "Integration with major insurance platforms",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar activeTab="pricing" onTabChange={() => {}} />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30 mb-6">
              <Sparkles className="w-4 h-4 text-[#39FF14]" />
              <span className="text-sm font-semibold text-[#39FF14]">
                Professional Weather Intelligence
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Get instant access to real-time hail monitoring and professional estimation tools.
              Save up to $398/year with annual billing.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-2 rounded-2xl bg-white/5 border border-white/10">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  billingCycle === "monthly"
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-[#39FF14] to-green-600 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Yearly
                <span className="px-2 py-1 rounded-full bg-black/20 text-xs font-bold">
                  Save up to $398
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {plans.map((plan) => {
              const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
              const discount = billingCycle === "yearly" ? plan.yearlyDiscount : 0;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl border-2 backdrop-blur-sm p-8 transition-all duration-300 hover:scale-105 ${
                    plan.popular
                      ? "border-[#39FF14] bg-gradient-to-br from-[#39FF14]/10 to-green-600/5 shadow-2xl shadow-[#39FF14]/20"
                      : "border-white/20 bg-gradient-to-br from-white/5 to-white/0"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gradient-to-r from-[#39FF14] to-green-600 text-black font-bold text-sm">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-8">
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-4`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-sm font-semibold text-[#39FF14] mb-2">{plan.tagline}</p>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold text-white">${price}</span>
                      <span className="text-gray-400">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    </div>
                    {billingCycle === "yearly" && discount > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          ${plan.monthlyPrice * 12}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold">
                          Save ${discount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href="/auth/signup">
                    <button
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                        plan.popular
                          ? "bg-gradient-to-r from-[#39FF14] to-green-600 text-black hover:shadow-2xl hover:shadow-[#39FF14]/30"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      {plan.cta}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Modules Breakdown */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">What's Included</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Explore the powerful modules that make HailWatch the professional choice
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {modules.map((module, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-8 hover:border-[#39FF14]/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-[#39FF14]/10">
                      <module.icon className="w-6 h-6 text-[#39FF14]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{module.name}</h3>
                      <p className="text-gray-400 text-sm">{module.description}</p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {module.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] mt-2 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ / Trust Section */}
          <div className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-8 sm:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Weather Professionals
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Join thousands of professionals who rely on HailWatch for accurate, real-time weather intelligence.
              Cancel anytime, no questions asked.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#39FF14]" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#39FF14]" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#39FF14]" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
