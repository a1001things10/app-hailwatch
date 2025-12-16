"use client";

import { useState } from "react";
import Navbar from "@/components/custom/navbar";
import {
  Car,
  Camera,
  Ruler,
  DollarSign,
  FileText,
  Download,
  Mail,
  CheckCircle,
  AlertCircle,
  Info,
  MapPin,
  Calendar,
  Wrench,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react";

interface VehicleInfo {
  year: string;
  make: string;
  model: string;
  vin: string;
  color: string;
  mileage: string;
}

interface DamageAssessment {
  panels: {
    hood: number;
    roof: number;
    frontLeftDoor: number;
    frontRightDoor: number;
    rearLeftDoor: number;
    rearRightDoor: number;
    frontLeftFender: number;
    frontRightFender: number;
    rearLeftQuarter: number;
    rearRightQuarter: number;
    trunk: number;
    bumpers: number;
  };
  dentSize: "small" | "medium" | "large" | "oversized";
  dentDepth: "shallow" | "moderate" | "deep";
  paintDamage: boolean;
  accessDifficulty: "easy" | "moderate" | "difficult" | "extreme";
  aluminumPanels: boolean;
}

interface EstimateResult {
  pdrCost: number;
  paintCost: number;
  laborHours: number;
  totalCost: number;
  timeEstimate: string;
  insuranceDeductible: number;
}

export default function AutoRepairEstimate() {
  const [activeTab, setActiveTab] = useState("auto-estimate");
  const [step, setStep] = useState(1);

  // Form states
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    year: "",
    make: "",
    model: "",
    vin: "",
    color: "",
    mileage: "",
  });

  const [hailEventDate, setHailEventDate] = useState("");
  const [location, setLocation] = useState("");

  const [damageAssessment, setDamageAssessment] = useState<DamageAssessment>({
    panels: {
      hood: 0,
      roof: 0,
      frontLeftDoor: 0,
      frontRightDoor: 0,
      rearLeftDoor: 0,
      rearRightDoor: 0,
      frontLeftFender: 0,
      frontRightFender: 0,
      rearLeftQuarter: 0,
      rearRightQuarter: 0,
      trunk: 0,
      bumpers: 0,
    },
    dentSize: "medium",
    dentDepth: "moderate",
    paintDamage: false,
    accessDifficulty: "moderate",
    aluminumPanels: false,
  });

  const [estimate, setEstimate] = useState<EstimateResult | null>(null);

  // Panel names for display
  const panelNames: { [key: string]: string } = {
    hood: "Hood",
    roof: "Roof",
    frontLeftDoor: "Front Left Door",
    frontRightDoor: "Front Right Door",
    rearLeftDoor: "Rear Left Door",
    rearRightDoor: "Rear Right Door",
    frontLeftFender: "Front Left Fender",
    frontRightFender: "Front Right Fender",
    rearLeftQuarter: "Rear Left Quarter Panel",
    rearRightQuarter: "Rear Right Quarter Panel",
    trunk: "Trunk/Deck Lid",
    bumpers: "Bumpers",
  };

  // Calculate total dents
  const getTotalDents = () => {
    return Object.values(damageAssessment.panels).reduce((sum, count) => sum + count, 0);
  };

  // Calculate estimate
  const calculateEstimate = () => {
    const totalDents = getTotalDents();

    // Base cost per dent based on size
    const dentSizeCosts = {
      small: 75, // < 1 inch (dime-sized)
      medium: 125, // 1-2 inches (quarter-sized)
      large: 175, // 2-3 inches (half-dollar)
      oversized: 250, // > 3 inches
    };

    let baseCostPerDent = dentSizeCosts[damageAssessment.dentSize];

    // Depth multiplier
    const depthMultipliers = {
      shallow: 1.0,
      moderate: 1.3,
      deep: 1.6,
    };
    baseCostPerDent *= depthMultipliers[damageAssessment.dentDepth];

    // Access difficulty multiplier
    const difficultyMultipliers = {
      easy: 1.0,
      moderate: 1.2,
      difficult: 1.5,
      extreme: 2.0,
    };
    baseCostPerDent *= difficultyMultipliers[damageAssessment.accessDifficulty];

    // Aluminum panels cost more (30% increase)
    if (damageAssessment.aluminumPanels) {
      baseCostPerDent *= 1.3;
    }

    // Calculate PDR cost with volume discount
    let pdrCost = 0;
    if (totalDents <= 10) {
      pdrCost = totalDents * baseCostPerDent;
    } else if (totalDents <= 30) {
      pdrCost = 10 * baseCostPerDent + (totalDents - 10) * baseCostPerDent * 0.9;
    } else if (totalDents <= 50) {
      pdrCost =
        10 * baseCostPerDent +
        20 * baseCostPerDent * 0.9 +
        (totalDents - 30) * baseCostPerDent * 0.8;
    } else {
      pdrCost =
        10 * baseCostPerDent +
        20 * baseCostPerDent * 0.9 +
        20 * baseCostPerDent * 0.8 +
        (totalDents - 50) * baseCostPerDent * 0.7;
    }

    // Paint cost if needed
    let paintCost = 0;
    if (damageAssessment.paintDamage) {
      const damagedPanels = Object.values(damageAssessment.panels).filter(
        (count) => count > 0
      ).length;
      paintCost = damagedPanels * 350; // Average cost per panel for paint repair
    }

    // Labor hours estimation
    const laborHours = Math.ceil(totalDents / 5) + (damageAssessment.paintDamage ? 4 : 0);

    // Total cost
    const totalCost = Math.round(pdrCost + paintCost);

    // Time estimate
    let days = Math.ceil(laborHours / 8);
    if (damageAssessment.paintDamage) days += 2; // Paint needs curing time
    const timeEstimate = days === 1 ? "1 day" : `${days} days`;

    // Typical insurance deductible
    const insuranceDeductible = 500;

    setEstimate({
      pdrCost: Math.round(pdrCost),
      paintCost: Math.round(paintCost),
      laborHours,
      totalCost,
      timeEstimate,
      insuranceDeductible,
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
                <Car className="w-8 h-8 text-[#39FF14]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                  Auto Repair Estimate
                </h1>
                <p className="text-gray-400 text-sm sm:text-base mt-1">
                  Professional PDR (Paintless Dent Repair) hail damage assessment
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: "Vehicle Info", icon: Car },
                { num: 2, label: "Damage Count", icon: Camera },
                { num: 3, label: "Assessment", icon: Wrench },
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

          {/* Step 1: Vehicle Information */}
          {step === 1 && (
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Car className="w-6 h-6 text-[#39FF14]" />
                <h2 className="text-2xl font-bold text-white">Vehicle Information</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Year
                    </label>
                    <input
                      type="text"
                      value={vehicleInfo.year}
                      onChange={(e) =>
                        setVehicleInfo({ ...vehicleInfo, year: e.target.value })
                      }
                      placeholder="2023"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Make
                    </label>
                    <input
                      type="text"
                      value={vehicleInfo.make}
                      onChange={(e) =>
                        setVehicleInfo({ ...vehicleInfo, make: e.target.value })
                      }
                      placeholder="Toyota"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      value={vehicleInfo.model}
                      onChange={(e) =>
                        setVehicleInfo({ ...vehicleInfo, model: e.target.value })
                      }
                      placeholder="Camry"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      value={vehicleInfo.color}
                      onChange={(e) =>
                        setVehicleInfo({ ...vehicleInfo, color: e.target.value })
                      }
                      placeholder="Silver"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    VIN (Vehicle Identification Number)
                  </label>
                  <input
                    type="text"
                    value={vehicleInfo.vin}
                    onChange={(e) =>
                      setVehicleInfo({ ...vehicleInfo, vin: e.target.value.toUpperCase() })
                    }
                    placeholder="1HGBH41JXMN109186"
                    maxLength={17}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all uppercase"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mileage
                    </label>
                    <input
                      type="text"
                      value={vehicleInfo.mileage}
                      onChange={(e) =>
                        setVehicleInfo({ ...vehicleInfo, mileage: e.target.value })
                      }
                      placeholder="45,000"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">
                        <strong className="text-white">Pro Tip:</strong> Having your VIN ready
                        helps verify vehicle specifications and ensures accurate insurance
                        documentation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={
                    !vehicleInfo.year ||
                    !vehicleInfo.make ||
                    !vehicleInfo.model ||
                    !hailEventDate
                  }
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Count Dents
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Damage Count by Panel */}
          {step === 2 && (
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-[#39FF14]" />
                <h2 className="text-2xl font-bold text-white">Dent Count by Panel</h2>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/30">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total Dents Counted:</span>
                  <span className="text-3xl font-bold text-[#39FF14]">{getTotalDents()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {Object.entries(damageAssessment.panels).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-4 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all"
                  >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {panelNames[key]}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={value || ""}
                      onChange={(e) =>
                        setDamageAssessment({
                          ...damageAssessment,
                          panels: {
                            ...damageAssessment.panels,
                            [key]: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      placeholder="0"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Counting Tips:</strong> Count each
                      individual dent carefully. Take photos of each panel for documentation.
                      Overlapping dents count as separate dents.
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
                  disabled={getTotalDents() === 0}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Assessment Details
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Detailed Assessment */}
          {step === 3 && (
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Wrench className="w-6 h-6 text-[#39FF14]" />
                <h2 className="text-2xl font-bold text-white">Damage Assessment Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Average Dent Size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { value: "small", label: "Small", desc: "< 1 inch" },
                      { value: "medium", label: "Medium", desc: "1-2 inches" },
                      { value: "large", label: "Large", desc: "2-3 inches" },
                      { value: "oversized", label: "Oversized", desc: "> 3 inches" },
                    ].map((size) => (
                      <button
                        key={size.value}
                        onClick={() =>
                          setDamageAssessment({
                            ...damageAssessment,
                            dentSize: size.value as any,
                          })
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          damageAssessment.dentSize === size.value
                            ? "bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]"
                            : "bg-white/5 border-white/20 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-sm font-semibold">{size.label}</div>
                        <div className="text-xs mt-1">{size.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Dent Depth
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "shallow", label: "Shallow", color: "blue" },
                      { value: "moderate", label: "Moderate", color: "yellow" },
                      { value: "deep", label: "Deep", color: "red" },
                    ].map((depth) => (
                      <button
                        key={depth.value}
                        onClick={() =>
                          setDamageAssessment({
                            ...damageAssessment,
                            dentDepth: depth.value as any,
                          })
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          damageAssessment.dentDepth === depth.value
                            ? depth.color === "blue"
                              ? "bg-[#00BFFF]/20 border-[#00BFFF] text-[#00BFFF]"
                              : depth.color === "yellow"
                              ? "bg-yellow-500/20 border-yellow-500 text-yellow-500"
                              : "bg-red-500/20 border-red-500 text-red-500"
                            : "bg-white/5 border-white/20 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-sm font-semibold">{depth.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Access Difficulty
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { value: "easy", label: "Easy" },
                      { value: "moderate", label: "Moderate" },
                      { value: "difficult", label: "Difficult" },
                      { value: "extreme", label: "Extreme" },
                    ].map((difficulty) => (
                      <button
                        key={difficulty.value}
                        onClick={() =>
                          setDamageAssessment({
                            ...damageAssessment,
                            accessDifficulty: difficulty.value as any,
                          })
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          damageAssessment.accessDifficulty === difficulty.value
                            ? "bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14]"
                            : "bg-white/5 border-white/20 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        <div className="text-sm font-semibold">{difficulty.label}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Consider bracing, double panels, and tool access when rating difficulty
                  </p>
                </div>

                <div className="space-y-3">
                  <label
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={damageAssessment.paintDamage}
                      onChange={(e) =>
                        setDamageAssessment({
                          ...damageAssessment,
                          paintDamage: e.target.checked,
                        })
                      }
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">Paint Damage Present</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Chipped, cracked, or scratched paint requiring repair
                      </div>
                    </div>
                  </label>

                  <label
                    className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={damageAssessment.aluminumPanels}
                      onChange={(e) =>
                        setDamageAssessment({
                          ...damageAssessment,
                          aluminumPanels: e.target.checked,
                        })
                      }
                      className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">Aluminum Panels</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Vehicle has aluminum body panels (requires specialized tools)
                      </div>
                    </div>
                  </label>
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
                    <h2 className="text-2xl font-bold text-white">Repair Estimate</h2>
                    <p className="text-sm text-gray-300">
                      {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} • {getTotalDents()}{" "}
                      dents
                    </p>
                  </div>
                </div>

                <div className="text-center py-6">
                  <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                    {formatCurrency(estimate.totalCost)}
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{estimate.timeEstimate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">{estimate.laborHours} labor hours</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-6">Cost Breakdown</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#39FF14]/20">
                        <Wrench className="w-5 h-5 text-[#39FF14]" />
                      </div>
                      <div>
                        <span className="text-white font-medium">PDR Labor</span>
                        <p className="text-xs text-gray-400">
                          {getTotalDents()} dents • {damageAssessment.dentSize} size •{" "}
                          {damageAssessment.dentDepth} depth
                        </p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-white">
                      {formatCurrency(estimate.pdrCost)}
                    </span>
                  </div>

                  {estimate.paintCost > 0 && (
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#00BFFF]/20">
                          <Camera className="w-5 h-5 text-[#00BFFF]" />
                        </div>
                        <div>
                          <span className="text-white font-medium">Paint Repair</span>
                          <p className="text-xs text-gray-400">Multiple panels affected</p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-white">
                        {formatCurrency(estimate.paintCost)}
                      </span>
                    </div>
                  )}
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

              {/* Insurance Information */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[#00BFFF]" />
                  <h3 className="text-xl font-bold text-white">Insurance Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300">Typical Deductible:</span>
                      <span className="text-xl font-bold text-white">
                        {formatCurrency(estimate.insuranceDeductible)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Your Out-of-Pocket:</span>
                      <span className="text-xl font-bold text-[#39FF14]">
                        {formatCurrency(
                          Math.min(estimate.totalCost, estimate.insuranceDeductible)
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-300 mb-2">
                          <strong className="text-white">Insurance Tips:</strong>
                        </p>
                        <ul className="space-y-1 text-sm text-gray-300">
                          <li className="flex items-start gap-2">
                            <span className="text-[#39FF14] mt-1">•</span>
                            <span>File your claim within 30 days of the hail event</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#39FF14] mt-1">•</span>
                            <span>Take detailed photos of all damage before repairs</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#39FF14] mt-1">•</span>
                            <span>Keep this estimate for your insurance adjuster</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#39FF14] mt-1">•</span>
                            <span>Most comprehensive policies cover hail damage 100%</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Important Notes</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          This is a preliminary estimate based on visual assessment. Final costs
                          may vary after detailed inspection.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          PDR is only effective when paint is intact and metal has not been
                          stretched beyond repair limits.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          Aluminum panels require specialized tools and techniques, affecting
                          repair time and cost.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          Volume discounts applied for repairs with 10+ dents. Larger jobs may
                          qualify for additional savings.
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
                  Email to Customer
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
