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
  Layers,
  Shield,
  Clock,
  Users,
  Wrench,
  CloudRain,
  Wind,
  Thermometer,
  Image as ImageIcon,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Building,
  Zap,
} from "lucide-react";

interface RoofMeasurement {
  length: number;
  width: number;
  pitch: number;
  stories: number;
  complexity: "simple" | "moderate" | "complex";
  accessDifficulty: "easy" | "moderate" | "difficult";
}

interface DamageAssessment {
  severity: "minor" | "moderate" | "severe" | "total";
  affectedArea: number;
  shinglesAffected: number;
  underlaymentDamage: boolean;
  gutterDamage: boolean;
  ventsDamage: boolean;
  flashingDamage: boolean;
  ridgeCapDamage: boolean;
  valleyDamage: boolean;
  chimneyDamage: boolean;
  skylightDamage: boolean;
  deckingDamage: boolean;
  soffit_fasciaDamage: boolean;
  hailSize: string;
  windSpeed: string;
  ageOfRoof: number;
}

interface PropertyDetails {
  address: string;
  hailEventDate: string;
  roofType: string;
  roofAge: number;
  previousClaims: boolean;
  insuranceCompany: string;
  policyNumber: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
}

interface EstimateResult {
  materialsCost: number;
  laborCost: number;
  disposalCost: number;
  permitsCost: number;
  contingency: number;
  overheadProfit: number;
  totalCost: number;
  insuranceEstimate: number;
  timeEstimate: string;
  warranty: string;
  rcvValue: number;
  acvValue: number;
  deductible: number;
}

interface PhotoUpload {
  id: string;
  file: File | null;
  preview: string;
  category: "overview" | "damage" | "detail" | "interior";
  description: string;
}

export default function RoofRepairEstimate() {
  const [activeTab, setActiveTab] = useState("estimate");
  const [step, setStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form states
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    address: "",
    hailEventDate: "",
    roofType: "asphalt-shingles",
    roofAge: 0,
    previousClaims: false,
    insuranceCompany: "",
    policyNumber: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",
  });

  const [roofMeasurement, setRoofMeasurement] = useState<RoofMeasurement>({
    length: 0,
    width: 0,
    pitch: 4,
    stories: 1,
    complexity: "moderate",
    accessDifficulty: "moderate",
  });

  const [damageAssessment, setDamageAssessment] = useState<DamageAssessment>({
    severity: "moderate",
    affectedArea: 0,
    shinglesAffected: 0,
    underlaymentDamage: false,
    gutterDamage: false,
    ventsDamage: false,
    flashingDamage: false,
    ridgeCapDamage: false,
    valleyDamage: false,
    chimneyDamage: false,
    skylightDamage: false,
    deckingDamage: false,
    soffit_fasciaDamage: false,
    hailSize: "1.0",
    windSpeed: "60",
    ageOfRoof: 0,
  });

  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);

  // Calculate roof area with pitch factor
  const calculateRoofArea = () => {
    const baseArea = roofMeasurement.length * roofMeasurement.width;
    // More accurate pitch multiplier calculation
    const pitchMultiplier = Math.sqrt(1 + Math.pow(roofMeasurement.pitch / 12, 2));
    
    // Complexity factor
    const complexityMultiplier = {
      simple: 1.0,
      moderate: 1.15,
      complex: 1.35,
    }[roofMeasurement.complexity];

    return Math.round(baseArea * pitchMultiplier * complexityMultiplier);
  };

  // Calculate squares (roofing measurement unit)
  const calculateSquares = () => {
    return (calculateRoofArea() / 100).toFixed(2);
  };

  // Advanced estimate calculation
  const calculateEstimate = () => {
    const roofArea = calculateRoofArea();
    const affectedArea = damageAssessment.affectedArea || roofArea;
    const squares = affectedArea / 100;

    // Material costs per square based on roof type (updated 2024 prices)
    const materialCosts: { [key: string]: number } = {
      "asphalt-shingles": 350,
      "architectural-shingles": 500,
      "metal-roofing": 800,
      "tile-roofing": 1200,
      "slate-roofing": 1500,
      "tpo-membrane": 650,
      "epdm-rubber": 550,
    };

    // Base material cost
    let materialsCost = squares * (materialCosts[propertyDetails.roofType] || 350);

    // Severity multiplier
    const severityMultipliers = {
      minor: 0.4,
      moderate: 1.0,
      severe: 1.8,
      total: 2.5,
    };
    materialsCost *= severityMultipliers[damageAssessment.severity];

    // Additional component costs
    if (damageAssessment.underlaymentDamage) materialsCost += affectedArea * 1.75;
    if (damageAssessment.gutterDamage) materialsCost += 1200;
    if (damageAssessment.ventsDamage) materialsCost += 600;
    if (damageAssessment.flashingDamage) materialsCost += 850;
    if (damageAssessment.ridgeCapDamage) materialsCost += 450;
    if (damageAssessment.valleyDamage) materialsCost += 700;
    if (damageAssessment.chimneyDamage) materialsCost += 1500;
    if (damageAssessment.skylightDamage) materialsCost += 800;
    if (damageAssessment.deckingDamage) materialsCost += affectedArea * 2.5;
    if (damageAssessment.soffit_fasciaDamage) materialsCost += 1800;

    // Labor cost calculation (varies by complexity and access)
    let laborMultiplier = 0.65; // Base 65% of materials
    
    // Pitch factor
    if (roofMeasurement.pitch >= 8) laborMultiplier += 0.15;
    if (roofMeasurement.pitch >= 10) laborMultiplier += 0.25;

    // Stories factor
    if (roofMeasurement.stories >= 2) laborMultiplier += 0.1;
    if (roofMeasurement.stories >= 3) laborMultiplier += 0.2;

    // Complexity factor
    const complexityLabor = {
      simple: 0,
      moderate: 0.1,
      complex: 0.25,
    }[roofMeasurement.complexity];
    laborMultiplier += complexityLabor;

    // Access difficulty
    const accessLabor = {
      easy: 0,
      moderate: 0.1,
      difficult: 0.25,
    }[roofMeasurement.accessDifficulty];
    laborMultiplier += accessLabor;

    const laborCost = materialsCost * laborMultiplier;

    // Disposal cost (updated rates)
    const disposalCost = squares * 85;

    // Permits and fees
    const permitsCost = affectedArea > 1000 ? 1200 : 800;

    // Overhead & Profit (industry standard 20%)
    const subtotal = materialsCost + laborCost + disposalCost + permitsCost;
    const overheadProfit = subtotal * 0.20;

    // Contingency (8% for unforeseen issues)
    const contingency = subtotal * 0.08;

    // Total RCV (Replacement Cost Value)
    const totalCost = subtotal + overheadProfit + contingency;

    // Insurance calculations
    const rcvValue = totalCost;
    
    // ACV calculation (depreciation based on roof age)
    const roofAge = propertyDetails.roofAge || damageAssessment.ageOfRoof || 0;
    const depreciationRate = Math.min(roofAge * 0.05, 0.5); // Max 50% depreciation
    const acvValue = rcvValue * (1 - depreciationRate);

    // Typical deductible (1% of home value, estimated)
    const estimatedHomeValue = totalCost * 15; // Rough estimate
    const deductible = Math.round(estimatedHomeValue * 0.01);

    const insuranceEstimate = Math.max(rcvValue - deductible, 0);

    // Time estimate
    let days = Math.ceil(affectedArea / 800); // 800 sq ft per day average
    if (damageAssessment.severity === "severe") days += 3;
    if (damageAssessment.severity === "total") days += 5;
    if (roofMeasurement.complexity === "complex") days += 2;
    if (roofMeasurement.pitch >= 8) days += 1;
    
    const timeEstimate = days === 1 ? "1-2 days" : `${days}-${days + 2} days`;

    // Warranty based on material type
    const warranties: { [key: string]: string } = {
      "asphalt-shingles": "25-30 years manufacturer, 10 years workmanship",
      "architectural-shingles": "30-50 years manufacturer, 10 years workmanship",
      "metal-roofing": "40-50 years manufacturer, 15 years workmanship",
      "tile-roofing": "50+ years manufacturer, 15 years workmanship",
      "slate-roofing": "75-100 years manufacturer, 20 years workmanship",
      "tpo-membrane": "20-30 years manufacturer, 10 years workmanship",
      "epdm-rubber": "25-30 years manufacturer, 10 years workmanship",
    };

    setEstimate({
      materialsCost: Math.round(materialsCost),
      laborCost: Math.round(laborCost),
      disposalCost: Math.round(disposalCost),
      permitsCost,
      contingency: Math.round(contingency),
      overheadProfit: Math.round(overheadProfit),
      totalCost: Math.round(totalCost),
      insuranceEstimate: Math.round(insuranceEstimate),
      timeEstimate,
      warranty: warranties[propertyDetails.roofType] || warranties["asphalt-shingles"],
      rcvValue: Math.round(rcvValue),
      acvValue: Math.round(acvValue),
      deductible: Math.round(deductible),
    });

    setStep(5);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const addPhoto = () => {
    const newPhoto: PhotoUpload = {
      id: Date.now().toString(),
      file: null,
      preview: "",
      category: "overview",
      description: "",
    };
    setPhotos([...photos, newPhoto]);
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#39FF14]/20 to-[#00BFFF]/20 border border-[#39FF14]/30">
                <Calculator className="w-8 h-8 text-[#39FF14]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                  Professional Roof Estimate
                </h1>
                <p className="text-gray-400 text-sm sm:text-base mt-1">
                  Comprehensive hail damage assessment with insurance-ready documentation
                </p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm">
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {[
                { num: 1, label: "Property", icon: Home },
                { num: 2, label: "Measurements", icon: Ruler },
                { num: 3, label: "Damage", icon: AlertCircle },
                { num: 4, label: "Photos", icon: Camera },
                { num: 5, label: "Estimate", icon: FileText },
              ].map((s, idx) => {
                const Icon = s.icon;
                const isActive = step === s.num;
                const isCompleted = step > s.num;
                return (
                  <div key={s.num} className="flex items-center flex-1 min-w-[80px]">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          isActive
                            ? "bg-[#39FF14]/20 border-[#39FF14] text-[#39FF14] scale-110"
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
                        className={`text-xs mt-2 font-medium text-center ${
                          isActive || isCompleted ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < 4 && (
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
                {/* Owner Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Property Owner Name *
                    </label>
                    <input
                      type="text"
                      value={propertyDetails.ownerName}
                      onChange={(e) =>
                        setPropertyDetails({ ...propertyDetails, ownerName: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={propertyDetails.ownerPhone}
                      onChange={(e) =>
                        setPropertyDetails({ ...propertyDetails, ownerPhone: e.target.value })
                      }
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={propertyDetails.ownerEmail}
                    onChange={(e) =>
                      setPropertyDetails({ ...propertyDetails, ownerEmail: e.target.value })
                    }
                    placeholder="john.doe@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Property Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={propertyDetails.address}
                      onChange={(e) =>
                        setPropertyDetails({ ...propertyDetails, address: e.target.value })
                      }
                      placeholder="123 Main Street, City, State ZIP"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hail Event Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={propertyDetails.hailEventDate}
                        onChange={(e) =>
                          setPropertyDetails({ ...propertyDetails, hailEventDate: e.target.value })
                        }
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#39FF14]/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Roof Age (years) *
                    </label>
                    <input
                      type="number"
                      value={propertyDetails.roofAge || ""}
                      onChange={(e) =>
                        setPropertyDetails({
                          ...propertyDetails,
                          roofAge: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="10"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Roof Type *
                  </label>
                  <select
                    value={propertyDetails.roofType}
                    onChange={(e) =>
                      setPropertyDetails({ ...propertyDetails, roofType: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#39FF14]/50 transition-all"
                  >
                    <option value="asphalt-shingles">Asphalt Shingles (3-Tab)</option>
                    <option value="architectural-shingles">Architectural Shingles</option>
                    <option value="metal-roofing">Metal Roofing</option>
                    <option value="tile-roofing">Tile Roofing</option>
                    <option value="slate-roofing">Slate Roofing</option>
                    <option value="tpo-membrane">TPO Membrane</option>
                    <option value="epdm-rubber">EPDM Rubber</option>
                  </select>
                </div>

                {/* Insurance Information - Collapsible */}
                <div>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-[#39FF14] hover:text-[#00BFFF] transition-colors mb-3"
                  >
                    {showAdvanced ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                    <span className="font-medium">Insurance Information (Optional)</span>
                  </button>

                  {showAdvanced && (
                    <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Insurance Company
                        </label>
                        <input
                          type="text"
                          value={propertyDetails.insuranceCompany}
                          onChange={(e) =>
                            setPropertyDetails({
                              ...propertyDetails,
                              insuranceCompany: e.target.value,
                            })
                          }
                          placeholder="State Farm, Allstate, etc."
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Policy Number
                        </label>
                        <input
                          type="text"
                          value={propertyDetails.policyNumber}
                          onChange={(e) =>
                            setPropertyDetails({
                              ...propertyDetails,
                              policyNumber: e.target.value,
                            })
                          }
                          placeholder="POL-123456789"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                        />
                      </div>

                      <label className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all cursor-pointer">
                        <input
                          type="checkbox"
                          checked={propertyDetails.previousClaims}
                          onChange={(e) =>
                            setPropertyDetails({
                              ...propertyDetails,
                              previousClaims: e.target.checked,
                            })
                          }
                          className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#39FF14] focus:ring-[#39FF14] focus:ring-offset-0"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white">
                            Previous Insurance Claims
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Check if you've filed claims for this property before
                          </div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">
                        <strong className="text-white">Pro Tip:</strong> Accurate property
                        information helps generate precise estimates and insurance-ready
                        documentation. All fields marked with * are required.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setStep(2)}
                  disabled={
                    !propertyDetails.address ||
                    !propertyDetails.hailEventDate ||
                    !propertyDetails.ownerName ||
                    !propertyDetails.ownerPhone ||
                    !propertyDetails.ownerEmail
                  }
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Length (feet) *
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
                      Width (feet) *
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
                      Roof Pitch (rise/run) *
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
                      <option value="2">2/12 (Low Slope - 9.5°)</option>
                      <option value="3">3/12 (Low - 14°)</option>
                      <option value="4">4/12 (Standard - 18.5°)</option>
                      <option value="5">5/12 (Medium - 22.5°)</option>
                      <option value="6">6/12 (Medium - 26.5°)</option>
                      <option value="7">7/12 (Steep - 30°)</option>
                      <option value="8">8/12 (Steep - 33.5°)</option>
                      <option value="9">9/12 (Very Steep - 37°)</option>
                      <option value="10">10/12 (Very Steep - 40°)</option>
                      <option value="12">12/12 (Extreme - 45°)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Number of Stories *
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
                      <option value="3">3+ Stories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Roof Complexity *
                    </label>
                    <select
                      value={roofMeasurement.complexity}
                      onChange={(e) =>
                        setRoofMeasurement({
                          ...roofMeasurement,
                          complexity: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    >
                      <option value="simple">Simple (Gable, Hip)</option>
                      <option value="moderate">Moderate (Multiple Planes)</option>
                      <option value="complex">Complex (Valleys, Dormers, Turrets)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Access Difficulty *
                    </label>
                    <select
                      value={roofMeasurement.accessDifficulty}
                      onChange={(e) =>
                        setRoofMeasurement({
                          ...roofMeasurement,
                          accessDifficulty: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#39FF14]/50 transition-all"
                    >
                      <option value="easy">Easy (Clear Access)</option>
                      <option value="moderate">Moderate (Some Obstacles)</option>
                      <option value="difficult">Difficult (Limited Access, Landscaping)</option>
                    </select>
                  </div>
                </div>

                {roofMeasurement.length > 0 && roofMeasurement.width > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-[#39FF14]" />
                          <span className="text-gray-300 text-sm">Total Roof Area:</span>
                        </div>
                        <span className="text-xl font-bold text-[#39FF14]">
                          {calculateRoofArea().toLocaleString()} sq ft
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-[#00BFFF]" />
                          <span className="text-gray-300 text-sm">Roofing Squares:</span>
                        </div>
                        <span className="text-xl font-bold text-[#00BFFF]">
                          {calculateSquares()} sq
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">
                        <strong className="text-white">Measurement Tips:</strong> Use satellite
                        imagery (Google Maps, Nearmap) or professional measurement tools for
                        accuracy. Roof pitch and complexity significantly affect material
                        requirements and labor costs. One roofing "square" = 100 square feet.
                      </p>
                    </div>
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
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <h2 className="text-2xl font-bold text-white">Comprehensive Damage Assessment</h2>
              </div>

              <div className="space-y-6">
                {/* Weather Conditions */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CloudRain className="w-5 h-5 text-[#00BFFF]" />
                    Weather Event Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Hail Size (inches)
                      </label>
                      <select
                        value={damageAssessment.hailSize}
                        onChange={(e) =>
                          setDamageAssessment({ ...damageAssessment, hailSize: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#39FF14]/50 transition-all"
                      >
                        <option value="0.5">0.5" (Pea)</option>
                        <option value="0.75">0.75" (Dime)</option>
                        <option value="1.0">1.0" (Quarter)</option>
                        <option value="1.25">1.25" (Half Dollar)</option>
                        <option value="1.5">1.5" (Walnut)</option>
                        <option value="1.75">1.75" (Golf Ball)</option>
                        <option value="2.0">2.0" (Hen Egg)</option>
                        <option value="2.5">2.5" (Tennis Ball)</option>
                        <option value="2.75">2.75" (Baseball)</option>
                        <option value="3.0">3.0"+ (Softball)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Wind Speed (mph)
                      </label>
                      <select
                        value={damageAssessment.windSpeed}
                        onChange={(e) =>
                          setDamageAssessment({ ...damageAssessment, windSpeed: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-[#39FF14]/50 transition-all"
                      >
                        <option value="40">40-50 mph (Moderate)</option>
                        <option value="60">50-60 mph (Strong)</option>
                        <option value="70">60-70 mph (Severe)</option>
                        <option value="80">70-80 mph (Very Severe)</option>
                        <option value="90">80+ mph (Extreme)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Damage Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Overall Damage Severity *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      {
                        value: "minor",
                        label: "Minor",
                        desc: "Cosmetic damage",
                        color: "blue",
                      },
                      {
                        value: "moderate",
                        label: "Moderate",
                        desc: "Functional damage",
                        color: "yellow",
                      },
                      {
                        value: "severe",
                        label: "Severe",
                        desc: "Structural concerns",
                        color: "orange",
                      },
                      {
                        value: "total",
                        label: "Total Loss",
                        desc: "Full replacement",
                        color: "red",
                      },
                    ].map((severity) => (
                      <button
                        key={severity.value}
                        onClick={() =>
                          setDamageAssessment({
                            ...damageAssessment,
                            severity: severity.value as any,
                          })
                        }
                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          damageAssessment.severity === severity.value
                            ? severity.color === "blue"
                              ? "bg-[#00BFFF]/20 border-[#00BFFF] shadow-lg shadow-[#00BFFF]/20"
                              : severity.color === "yellow"
                              ? "bg-yellow-500/20 border-yellow-500 shadow-lg shadow-yellow-500/20"
                              : severity.color === "orange"
                              ? "bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/20"
                              : "bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20"
                            : "bg-white/5 border-white/20 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`text-sm font-semibold mb-1 ${
                            damageAssessment.severity === severity.value
                              ? severity.color === "blue"
                                ? "text-[#00BFFF]"
                                : severity.color === "yellow"
                                ? "text-yellow-500"
                                : severity.color === "orange"
                                ? "text-orange-500"
                                : "text-red-500"
                              : ""
                          }`}
                        >
                          {severity.label}
                        </div>
                        <div className="text-xs text-gray-400">{severity.desc}</div>
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
                    placeholder={`Max: ${calculateRoofArea()} sq ft`}
                    max={calculateRoofArea()}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave blank to estimate entire roof area ({calculateRoofArea().toLocaleString()}{" "}
                    sq ft)
                  </p>
                </div>

                {/* Component Damage Checklist */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#39FF14]" />
                    Damaged Components
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        key: "underlaymentDamage",
                        label: "Underlayment",
                        desc: "Felt or synthetic underlayment",
                        icon: Layers,
                      },
                      {
                        key: "gutterDamage",
                        label: "Gutters & Downspouts",
                        desc: "Dented or need replacement",
                        icon: Wind,
                      },
                      {
                        key: "ventsDamage",
                        label: "Roof Vents",
                        desc: "Ridge vents, box vents, turbines",
                        icon: Wind,
                      },
                      {
                        key: "flashingDamage",
                        label: "Flashing",
                        desc: "Chimney, valley, wall flashing",
                        icon: Shield,
                      },
                      {
                        key: "ridgeCapDamage",
                        label: "Ridge Cap",
                        desc: "Peak shingles damaged",
                        icon: TrendingUp,
                      },
                      {
                        key: "valleyDamage",
                        label: "Valleys",
                        desc: "Valley metal or shingles",
                        icon: Layers,
                      },
                      {
                        key: "chimneyDamage",
                        label: "Chimney",
                        desc: "Cap, crown, or flashing",
                        icon: Building,
                      },
                      {
                        key: "skylightDamage",
                        label: "Skylights",
                        desc: "Glass or flashing damaged",
                        icon: ImageIcon,
                      },
                      {
                        key: "deckingDamage",
                        label: "Roof Decking",
                        desc: "Plywood or OSB damage",
                        icon: Layers,
                      },
                      {
                        key: "soffit_fasciaDamage",
                        label: "Soffit & Fascia",
                        desc: "Trim and eaves damage",
                        icon: Home,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <label
                          key={item.key}
                          className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all cursor-pointer group"
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
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-[#39FF14] group-hover:text-[#00BFFF] transition-colors" />
                              <div className="text-sm font-medium text-white">{item.label}</div>
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">
                        <strong className="text-white">Important:</strong> Accurate damage
                        assessment is critical for insurance claims. Document all visible damage and
                        consider a professional inspection for hidden damage to decking or
                        structure.
                      </p>
                    </div>
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
                  onClick={() => setStep(4)}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300"
                >
                  Next: Photo Documentation
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Photo Documentation */}
          {step === 4 && (
            <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Camera className="w-6 h-6 text-[#39FF14]" />
                <h2 className="text-2xl font-bold text-white">Photo Documentation</h2>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/30">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300 mb-2">
                        <strong className="text-white">Photo Guidelines:</strong> Upload clear,
                        well-lit photos of damage from multiple angles. Include:
                      </p>
                      <ul className="text-xs text-gray-400 space-y-1 ml-4">
                        <li>• Overall roof views (all sides)</li>
                        <li>• Close-ups of hail impacts on shingles</li>
                        <li>• Damaged gutters, vents, and flashing</li>
                        <li>• Interior water damage or stains (if applicable)</li>
                        <li>• Reference objects for scale (coin, ruler)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {photos.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex p-6 rounded-full bg-white/5 border border-white/20 mb-4">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-400 mb-6">No photos uploaded yet</p>
                    <button
                      onClick={addPhoto}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300"
                    >
                      <Plus className="w-5 h-5" />
                      Add Photos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {photos.map((photo, index) => (
                      <div
                        key={photo.id}
                        className="p-4 rounded-xl bg-white/5 border border-white/20"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                  Category
                                </label>
                                <select
                                  value={photo.category}
                                  onChange={(e) => {
                                    const updated = [...photos];
                                    updated[index].category = e.target.value as any;
                                    setPhotos(updated);
                                  }}
                                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 transition-all"
                                >
                                  <option value="overview">Overview</option>
                                  <option value="damage">Damage Detail</option>
                                  <option value="detail">Component Detail</option>
                                  <option value="interior">Interior Damage</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  value={photo.description}
                                  onChange={(e) => {
                                    const updated = [...photos];
                                    updated[index].description = e.target.value;
                                    setPhotos(updated);
                                  }}
                                  placeholder="Describe the damage..."
                                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="flex-1 px-4 py-2 rounded-lg bg-[#39FF14]/20 border border-[#39FF14]/50 text-[#39FF14] text-sm font-medium hover:bg-[#39FF14]/30 transition-all">
                                <Upload className="w-4 h-4 inline mr-2" />
                                Upload File
                              </button>
                              <button
                                onClick={() => removePhoto(photo.id)}
                                className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-500 text-sm font-medium hover:bg-red-500/30 transition-all"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addPhoto}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-white/20 text-gray-400 hover:border-[#39FF14]/50 hover:text-[#39FF14] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add Another Photo
                    </button>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-300">
                        <strong className="text-white">Pro Tip:</strong> Photos are optional but
                        highly recommended for insurance claims. Quality documentation can
                        significantly speed up claim approval and ensure accurate coverage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  Back
                </button>
                <button
                  onClick={calculateEstimate}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300"
                >
                  Calculate Estimate
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Estimate Results */}
          {step === 5 && estimate && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#39FF14]/20 to-[#00BFFF]/20 border-2 border-[#39FF14]/50 backdrop-blur-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <DollarSign className="w-8 h-8 text-[#39FF14]" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Professional Estimate</h2>
                    <p className="text-sm text-gray-300">
                      {calculateSquares()} squares • {calculateRoofArea().toLocaleString()} sq ft
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="text-center p-6 rounded-xl bg-white/10 border border-white/20">
                    <div className="text-sm text-gray-400 mb-2">Replacement Cost Value (RCV)</div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                      {formatCurrency(estimate.rcvValue)}
                    </div>
                  </div>

                  <div className="text-center p-6 rounded-xl bg-white/10 border border-white/20">
                    <div className="text-sm text-gray-400 mb-2">Actual Cash Value (ACV)</div>
                    <div className="text-4xl font-bold text-white">
                      {formatCurrency(estimate.acvValue)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      After {propertyDetails.roofAge || 0} years depreciation
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-black/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-[#39FF14]" />
                      <span className="text-xs text-gray-400">Timeline</span>
                    </div>
                    <p className="text-lg font-bold text-white">{estimate.timeEstimate}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-[#00BFFF]" />
                      <span className="text-xs text-gray-400">Est. Deductible</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(estimate.deductible)}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/20">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-[#39FF14]" />
                      <span className="text-xs text-gray-400">Insurance Payout</span>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(estimate.insuranceEstimate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Cost Breakdown */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-[#39FF14]" />
                  Detailed Cost Breakdown
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      label: "Materials & Supplies",
                      amount: estimate.materialsCost,
                      icon: Home,
                      color: "blue",
                      desc: "Shingles, underlayment, components",
                    },
                    {
                      label: "Labor & Installation",
                      amount: estimate.laborCost,
                      icon: Users,
                      color: "green",
                      desc: "Professional installation crew",
                    },
                    {
                      label: "Disposal & Cleanup",
                      amount: estimate.disposalCost,
                      icon: Upload,
                      color: "yellow",
                      desc: "Tear-off and debris removal",
                    },
                    {
                      label: "Permits & Inspections",
                      amount: estimate.permitsCost,
                      icon: FileText,
                      color: "purple",
                      desc: "Building permits and fees",
                    },
                    {
                      label: "Overhead & Profit",
                      amount: estimate.overheadProfit,
                      icon: TrendingUp,
                      color: "cyan",
                      desc: "Business operations (20%)",
                    },
                    {
                      label: "Contingency Reserve",
                      amount: estimate.contingency,
                      icon: AlertCircle,
                      color: "orange",
                      desc: "Unforeseen conditions (8%)",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`p-2 rounded-lg transition-all ${
                              item.color === "blue"
                                ? "bg-[#00BFFF]/20 group-hover:bg-[#00BFFF]/30"
                                : item.color === "green"
                                ? "bg-[#39FF14]/20 group-hover:bg-[#39FF14]/30"
                                : item.color === "yellow"
                                ? "bg-yellow-500/20 group-hover:bg-yellow-500/30"
                                : item.color === "purple"
                                ? "bg-purple-500/20 group-hover:bg-purple-500/30"
                                : item.color === "cyan"
                                ? "bg-cyan-500/20 group-hover:bg-cyan-500/30"
                                : "bg-orange-500/20 group-hover:bg-orange-500/30"
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
                                  : item.color === "cyan"
                                  ? "text-cyan-500"
                                  : "text-orange-500"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <span className="text-white font-medium block">{item.label}</span>
                            <span className="text-xs text-gray-400">{item.desc}</span>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-white">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t-2 border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-white block">
                        Total RCV Estimate
                      </span>
                      <span className="text-xs text-gray-400">Replacement Cost Value</span>
                    </div>
                    <span className="text-4xl font-bold bg-gradient-to-r from-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                      {formatCurrency(estimate.totalCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warranty Information */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-[#39FF14]" />
                  <h3 className="text-lg font-bold text-white">Warranty Coverage</h3>
                </div>
                <p className="text-gray-300">{estimate.warranty}</p>
              </div>

              {/* Important Notes */}
              <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="w-5 h-5 text-[#00BFFF] mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-white mb-3">Important Information</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          <strong className="text-white">RCV vs ACV:</strong> Replacement Cost
                          Value (RCV) is the full cost to replace. Actual Cash Value (ACV)
                          deducts depreciation based on roof age.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          <strong className="text-white">Insurance Process:</strong> Most
                          policies pay ACV upfront, then RCV after work completion. Keep all
                          receipts and documentation.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          <strong className="text-white">Estimate Validity:</strong> This is a
                          preliminary estimate. Final costs may vary based on professional
                          inspection and unforeseen conditions.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          <strong className="text-white">Next Steps:</strong> Contact your
                          insurance company immediately to file a claim. Schedule a professional
                          inspection within 72 hours of the storm event.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#39FF14] mt-1">•</span>
                        <span>
                          <strong className="text-white">Code Compliance:</strong> All work
                          includes compliance with current building codes and manufacturer
                          specifications.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
                >
                  New Estimate
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#39FF14] to-[#00BFFF] text-black font-semibold hover:shadow-lg hover:shadow-[#39FF14]/50 transition-all duration-300">
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300">
                  <Mail className="w-5 h-5" />
                  Email Report
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
