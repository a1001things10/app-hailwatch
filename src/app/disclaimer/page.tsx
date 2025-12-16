"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/custom/navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Shield,
  AlertTriangle,
  FileText,
  Scale,
  Info,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";

export default function DisclaimerPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("disclaimer");

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">{t("disclaimer.backToHome")}</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/30">
                <Shield className="w-8 h-8 text-[#39FF14]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  {t("disclaimer.title")}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {t("disclaimer.lastUpdated")}
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice Banner */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {t("disclaimer.importantNotice")}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {t("disclaimer.importantText")}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Section 1: General Disclaimer */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-white">
                  {t("disclaimer.section1.title")}
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>{t("disclaimer.section1.p1")}</p>
                <p>{t("disclaimer.section1.p2")}</p>
                <p>{t("disclaimer.section1.p3")}</p>
              </div>
            </div>

            {/* Section 2: Data Accuracy */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-[#00BFFF] flex-shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-white">
                  {t("disclaimer.section2.title")}
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>{t("disclaimer.section2.p1")}</p>
                <p>{t("disclaimer.section2.p2")}</p>
              </div>
            </div>

            {/* Section 3: Limitation of Liability */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <Scale className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-white">
                  {t("disclaimer.section3.title")}
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>{t("disclaimer.section3.p1")}</p>
                <p className="font-semibold text-orange-400">
                  {t("disclaimer.section3.p2")}
                </p>
              </div>
            </div>

            {/* Section 4: User Responsibilities */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-white">
                  {t("disclaimer.section4.title")}
                </h2>
              </div>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t("disclaimer.section4.intro")}
                </p>
                <ul className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#39FF14] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">
                        {t(`disclaimer.section4.item${i}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 5: No Professional Advice */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-white">
                  {t("disclaimer.section5.title")}
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>{t("disclaimer.section5.p1")}</p>
              </div>
            </div>

            {/* Section 6: Third-Party Data */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-[#00BFFF] flex-shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-white">
                  {t("disclaimer.section6.title")}
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>{t("disclaimer.section6.p1")}</p>
              </div>
            </div>

            {/* Section 7: Changes to Disclaimer */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="w-5 h-5 text-[#39FF14] flex-shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-white">
                  {t("disclaimer.section7.title")}
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>{t("disclaimer.section7.p1")}</p>
              </div>
            </div>

            {/* Section 8: Governing Law */}
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-start gap-3 mb-4">
                <Scale className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
                <h2 className="text-xl font-bold text-white">
                  {t("disclaimer.section8.title")}
                </h2>
              </div>
              <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                <p>{t("disclaimer.section8.p1")}</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#39FF14]/10 to-[#00BFFF]/10 border border-[#39FF14]/30 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-2">
              {t("disclaimer.contact.title")}
            </h3>
            <p className="text-sm text-gray-300">
              {t("disclaimer.contact.text")}
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/50 hover:bg-[#39FF14]/30 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">{t("disclaimer.backToHome")}</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
