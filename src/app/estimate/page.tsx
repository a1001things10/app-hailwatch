"use client";

import { useState } from "react";
import Navbar from "@/components/custom/navbar";
import {
  Calculator,
  Home,
  Ruler,
  DollarSign,
  FileText,
  Download,
  Mail,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingUp,
  Calendar,
  MapPin,
  Camera,
  Upload,
} from "lucide-react";

interface RoofMeasurement {
  length: number;
  width: number;
  pitch: number;
  stories: number;
}

interface DamageAssessment {
  severity: "minor" | "moderate" | "severe" | "total";
  affectedArea: number;
  shinglesAffected: number;
  underlaymentDamage: boolean;
  gutterDamage: boolean;
  ventsDamage: boolean;
  flashingDamage: boolean;
}

interface EstimateResult {
  materialsCost: number;
  laborCost: number;
  disposalCost: number;
  permitsCost: number;
  contingency: number;
  totalCost: number;
  timeEstimate: string;
}

export default function RoofRepairEstimate() {
  const [activeTab, setActiveTab] = useState("estimate");
  const [step, setStep] = useState(1);

  // Form states
  const [propertyAddress, setPropertyAddress] = useState("");
  const [hailEventDate, setHailEventDate] = useState("");
  const [roofMeasurement, setRoofMeasurement] = useState<RoofMeasurement>({
    length: 0,
    width: 0,
    pitch: 4,
    stories: 1,
  });
  const [damageAssessment, setDamageAssessment] = useState<DamageAssessment>({
    severity: "moderate",
    affectedArea: 0,
    shinglesAffected: 0,
    underlaymentDamage: false,
    gutterDamage: false,
    ventsDamage: false,
    flashingDamage: false,
  });
  const [roofType, setRoofType] = useState("asphalt-shingles");
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);

  // Calculate roof area
  const calculateRoofArea = () => {
    const baseArea = roofMeasurement.length * roofMeasurement.width;
    const pitchMultiplier = 1 + (roofMeasurement.pitch / 12) * 0.5;
    return Math.round(baseArea * pitchMultiplier);
  };

  // Calculate estimate
  const calculateEstimate = () => {
    const roofArea = calculateRoofArea();
    const affectedArea = damageAssessment.affectedArea || roofArea;

    // Material costs per square foot based on roof type
    const materialCosts: { [key: string]: number } = {
      "asphalt-shingles": 3.5,
      "architectural-shingles": 5.0,
      "metal-roofing": 8.0,
      "tile-roofing": 12.0,
      "slate-roofing": 15.0,
    };

    // Base calculations
    const materialCostPerSqFt = materialCosts[roofType] || 3.5;
    let materialsCost = affectedArea * materialCostPerSqFt;

    // Severity multiplier
    const severityMultipliers = {
      minor: 0.5,
      moderate: 1.0,
      severe: 1.5,
      total: 2.0,
    };
    materialsCost *= severityMultipliers[damageAssessment.severity];

    // Additional damage costs
    if (damageAssessment.underlaymentDamage) materialsCost += affectedArea * 1.5;
    if (damageAssessment.gutterDamage) materialsCost += 800;
    if (damageAssessment.ventsDamage) materialsCost += 400;
    if (damageAssessment.flashingDamage) materialsCost += 600;

    // Labor cost (typically 60% of materials)
    const laborCost = materialsCost * 0.6;

    // Disposal cost ($50-100 per square)
    const squares = affectedArea / 100;
    const disposalCost = squares * 75;

    // Permits (typically $500-1500)
    const permitsCost = 800;

    // Contingency (10% of subtotal)
    const subtotal = materialsCost + laborCost + disposalCost + permitsCost;
    const contingency = subtotal * 0.1;

    // Total
    const totalCost = subtotal + contingency;

    // Time estimate
    let days = Math.ceil(affectedArea / 1000);
    if (damageAssessment.severity === "severe") days += 2;
    if (damageAssessment.severity === "total") days += 4;
    const timeEstimate = `${days}-${days + 2} days`;

    setEstimate({
      materialsCost: Math.round(materialsCost),
      laborCost: Math.round(laborCost),
      disposalCost: Math.round(disposalCost),
      permitsCost,
      contingency: Math.round(contingency),
      totalCost: Math.round(totalCost),
      timeEstimate,
    });

    setStep(4);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#39FF14]/20 to-[#00BFFF]/20 border border-[#39FF14]/30">
                <Calculator className="w-8 h-8 text-[#39FF14]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                  Roof Repair Estimate
                </h1>
                <p className="text-gray-400 text-sm sm:text-base mt-1">
                  Professional hail damage assessment and cost estimation
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: "Property Info", icon: Home },
                { num: 2, label: "Measurements", icon: Ruler },
                { num: 3, label: "Damage Assessment", icon: AlertCircle },
                { num: 4, label: "Estimate", icon: FileText },
              ].map((s, idx) => {
                const Icon = s.icon;
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div key={s.num} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isActive
                            ? "bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]"
                            : isCompleted
                            ? "bg-[#39FF14]/10 border-[#39FF14]/50 text-[#39FF14]"
                            : "bg-white/5 border-white/20 text-gray-500"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Icon className="w-6 h-6" />
                        )}
                      </div>
                      <span
                        className={`text-xs mt-2 font-medium hidden sm:block ${
                          isActive || isCompleted ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < 3 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                          isCompleted ? "bg-[#39FF14]/50" : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1: Property Information */}
          {step === 1 && (
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Home className="w-6 h-6 text-[#39FF14]" />
                <h2 className="text-2xl font-bold text-white">Property Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Property Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="123 Main Street, City, State ZIP"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hail Event Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={hailEventDate}
                      onChange={(e) => setHailEventDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Roof Type
                  </label>
                  <select
                    value={roofType}
                    onChange={(e) => setRoofType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#39FF14]/50 transition-all"
                  >
                    <option value="asphalt-shingles">Asphalt Shingles (3-Tab)</option>
                    <option value="architectural-shingles">Architectural Shingles</option>
                    <option value="metal-roofing">Metal Roofing</option>
                    <option value="tile-roofing">Tile Roofing</option>
                    <option value="slate-roofing">Slate Roofing</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">
                        <strong className="text-white">Pro Tip:</strong> Accurate property
                        information helps generate more precise estimates and documentation for
                        insurance claims.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={!propertyAddress || !hailEventDate}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Measurements
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Roof Measurements */}
          {step === 2 && (
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Ruler className="w-6 h-6 text-[#39FF14]" />
                <h2 className="text-2xl font-bold text-white">Roof Measurements</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Length (feet)
                  </label>
                  <input
                    type="number"
                    value={roofMeasurement.length || ""}
                    onChange={(e) =>
                      setRoofMeasurement({
                        ...roofMeasurement,
                        length: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="50"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Width (feet)
                  </label>
                  <input
                    type="number"
                    value={roofMeasurement.width || ""}
                    onChange={(e) =>
                      setRoofMeasurement({
                        ...roofMeasurement,
                        width: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="30"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Roof Pitch (rise/run)
                  </label>
                  <select
                    value={roofMeasurement.pitch}
                    onChange={(e) =>
                      setRoofMeasurement({
                        ...roofMeasurement,
                        pitch: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#39FF14]/50 transition-all"
                  >
                    <option value="2">2/12 (Low Slope)</option>
                    <option value="4">4/12 (Standard)</option>
                    <option value="6">6/12 (Medium)</option>
                    <option value="8">8/12 (Steep)</option>
                    <option value="10">10/12 (Very Steep)</option>
                    <option value="12">12/12 (Extreme)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Stories
                  </label>
                  <select
                    value={roofMeasurement.stories}
                    onChange={(e) =>
                      setRoofMeasurement({
                        ...roofMeasurement,
                        stories: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#39FF14]/50 transition-all"
                  >
                    <option value="1">1 Story</option>
                    <option value="2">2 Stories</option>
                    <option value="3">3 Stories</option>
                  </select>
                </div>
              </div>

              {roofMeasurement.length > 0 && roofMeasurement.width > 0 && (
                <div className="p-4 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/30 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Calculated Roof Area:</span>
                    <span className="text-2xl font-bold text-[#39FF14]">
                      {calculateRoofArea().toLocaleString()} sq ft
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Measurement Tips:</strong> Use satellite
                      imagery or professional measurement tools for accuracy. Roof pitch
                      significantly affects material requirements and labor costs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={roofMeasurement.length === 0 || roofMeasurement.width === 0}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Damage Assessment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Damage Assessment */}
          {step === 3 && (
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="w-6 h-6 text-[#39FF14]" />
                <h2 className="text-2xl font-bold text-white">Damage Assessment</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Damage Severity
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { value: "minor", label: "Minor", color: "blue" },
                      { value: "moderate", label: "Moderate", color: "yellow" },
                      { value: "severe", label: "Severe", color: "orange" },
                      { value: "total", label: "Total Loss", color: "red" },
                    ].map((severity) => (
                      <button
                        key={severity.value}
                        onClick={() =>
                          setDamageAssessment({
                            ...damageAssessment,
                            severity: severity.value as any,
                          })
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          damageAssessment.severity === severity.value
                            ? severity.color === "blue"
                              ? "bg-[#00BFFF]/20 border-[#00BFFF] text-[#00BFFF]"
                              : severity.color === "yellow"
                              ? "bg-yellow-500/20 border-yellow-500 text-yellow-500"
                              : severity.color === "orange"
                              ? "bg-orange-500/20 border-orange-500 text-orange-500"
                              : "bg-red-500/20 border-red-500 text-red-500"
                            : "bg-white/5 border-white/20 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-sm font-semibold">{severity.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Affected Area (sq ft)
                  </label>
                  <input
                    type="number"
                    value={damageAssessment.affectedArea || ""}
                    onChange={(e) =>
                      setDamageAssessment({
                        ...damageAssessment,
                        affectedArea: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder={`Max: ${calculateRoofArea()}`}
                    max={calculateRoofArea()}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave blank to estimate entire roof area
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Additional Damage
                  </label>
                  <div className="space-y-3">
                    {[
                      {
                        key: "underlaymentDamage",
                        label: "Underlayment Damage",
                        desc: "Felt or synthetic underlayment needs replacement",
                      },
                      {
                        key: "gutterDamage",
                        label: "Gutter Damage",
                        desc: "Gutters dented or need replacement",
                      },
                      {
                        key: "ventsDamage",
                        label: "Vents Damage",
                        desc: "Roof vents or ridge vents damaged",
                      },
                      {
                        key: "flashingDamage",
                        label: "Flashing Damage",
                        desc: "Chimney, valley, or wall flashing damaged",
                      },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            damageAssessment[item.key as keyof DamageAssessment] as boolean
                          }
                          onChange={(e) =>
                            setDamageAssessment({
                              ...damageAssessment,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-0"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">{item.label}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={calculateEstimate}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300"
                >
                  Calculate Estimate
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Estimate Results */}
          {step === 4 && estimate && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#39FF14]/20 to-[#00BFFF]/20 border-2 border-[#39FF14]/50 backdrop-blur-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-8 h-8 text-[#39FF14]" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Estimated Total Cost</h2>
                    <p className="text-sm text-gray-300">
                      Based on {calculateRoofArea().toLocaleString()} sq ft roof area
                    </p>
                  </div>
                </div>

                <div className="text-center py-6">
                  <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                    {formatCurrency(estimate.totalCost)}
                  </div>
                  <p className="text-gray-300 mt-2">Estimated completion: {estimate.timeEstimate}</p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-6">Cost Breakdown</h3>

                <div className="space-y-4">
                  {[
                    {
                      label: "Materials",
                      amount: estimate.materialsCost,
                      icon: Home,
                      color: "blue",
                    },
                    {
                      label: "Labor",
                      amount: estimate.laborCost,
                      icon: TrendingUp,
                      color: "green",
                    },
                    {
                      label: "Disposal & Cleanup",
                      amount: estimate.disposalCost,
                      icon: Upload,
                      color: "yellow",
                    },
                    {
                      label: "Permits & Fees",
                      amount: estimate.permitsCost,
                      icon: FileText,
                      color: "purple",
                    },
                    {
                      label: "Contingency (10%)",
                      amount: estimate.contingency,
                      icon: AlertCircle,
                      color: "orange",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              item.color === "blue"
                                ? "bg-[#00BFFF]/20"
                                : item.color === "green"
                                ? "bg-[#39FF14]/20"
                                : item.color === "yellow"
                                ? "bg-yellow-500/20"
                                : item.color === "purple"
                                ? "bg-purple-500/20"
                                : "bg-orange-500/20"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${
                                item.color === "blue"
                                  ? "text-[#00BFFF]"
                                  : item.color === "green"
                                  ? "text-[#39FF14]"
                                  : item.color === "yellow"
                                  ? "text-yellow-500"
                                  : item.color === "purple"
                                  ? "text-purple-500"
                                  : "text-orange-500"
                              }`}
                            />
                          </div>
                          <span className="text-white font-medium">{item.label}</span>
                        </div>
                        <span className="text-xl font-bold text-white">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">Total Estimate</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                      {formatCurrency(estimate.totalCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Important Notes</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          This is a preliminary estimate. Final costs may vary based on actual
                          inspection and unforeseen conditions.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          Prices include standard materials and labor. Premium materials will
                          increase costs.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          A professional inspection is recommended before starting any repair work.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          Contact your insurance company immediately to file a claim for hail
                          damage.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  New Estimate
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300">
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300">
                  <Mail className="w-5 h-5" />
                  Email Estimate
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
