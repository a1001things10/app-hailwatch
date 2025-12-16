"use client";

import { useState } from "react";
import Navbar from "@/components/custom/navbar";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Building,
  ChevronDown,
  Plus,
  Upload,
} from "lucide-react";

export default function ContatosPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("contatos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Categorias de contatos
  const categories = [
    { code: "all", name: t("contacts.allCategories") },
    { code: "homeowners", name: t("contacts.homeowners") },
    { code: "contractors", name: t("contacts.contractors") },
    { code: "insurance", name: t("contacts.insurance") },
    { code: "roofing", name: t("contacts.roofing") },
    { code: "restoration", name: t("contacts.restoration") },
  ];

  // Dados de contatos (mock)
  const contacts = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Oklahoma City, OK",
      category: "homeowners",
      company: "N/A",
      lastContact: "2024-01-10",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@roofing.com",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, Dallas, TX",
      category: "roofing",
      company: "Premium Roofing Co.",
      lastContact: "2024-01-08",
      status: "active",
    },
    {
      id: 3,
      name: "Mike Williams",
      email: "mike.w@insurance.com",
      phone: "(555) 345-6789",
      address: "789 Pine Rd, Kansas City, KS",
      category: "insurance",
      company: "State Insurance Group",
      lastContact: "2024-01-05",
      status: "active",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "(555) 456-7890",
      address: "321 Elm St, Denver, CO",
      category: "homeowners",
      company: "N/A",
      lastContact: "2024-01-12",
      status: "active",
    },
    {
      id: 5,
      name: "Robert Brown",
      email: "robert.b@restoration.com",
      phone: "(555) 567-8901",
      address: "654 Maple Dr, Wichita, KS",
      category: "restoration",
      company: "Quick Restore Services",
      lastContact: "2024-01-03",
      status: "active",
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa.a@contractors.com",
      phone: "(555) 678-9012",
      address: "987 Cedar Ln, Tulsa, OK",
      category: "contractors",
      company: "Anderson Construction",
      lastContact: "2024-01-15",
      status: "active",
    },
  ];

  // Filtrar contatos
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" || contact.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (code: string) => {
    return categories.find((c) => c.code === code)?.name || code;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#39FF14]/10">
                  <Users className="w-8 h-8 text-[#39FF14]" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#39FF14] to-[#00BFFF] bg-clip-text text-transparent">
                    {t("contacts.title")}
                  </h1>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {t("contacts.subtitle")}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/20 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {t("contacts.addNew")}
                  </span>
                </button>
                <button className="px-4 py-2 rounded-xl bg-[#00BFFF]/10 border border-[#00BFFF]/50 text-[#00BFFF] hover:bg-[#00BFFF]/20 transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    {t("contacts.import")}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#39FF14]/10">
                  <Users className="w-5 h-5 text-[#39FF14]" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("contacts.totalContacts")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {contacts.length.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("contacts.unlimited")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#00BFFF]/10">
                  <Building className="w-5 h-5 text-[#00BFFF]" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("contacts.companies")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {
                  contacts.filter((c) => c.company && c.company !== "N/A")
                    .length
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("contacts.business")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("contacts.locations")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {new Set(contacts.map((c) => c.address.split(",").pop())).size}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("contacts.states")}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Filter className="w-5 h-5 text-purple-500" />
                </div>
                <h4 className="text-sm font-semibold text-gray-400">
                  {t("contacts.categories")}
                </h4>
              </div>
              <p className="text-3xl font-bold text-white">
                {categories.length - 1}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("contacts.types")}
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t("contacts.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]/50 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all min-w-[200px]"
                >
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#39FF14]" />
                    <span className="text-sm font-medium">
                      {getCategoryName(selectedCategory)}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1A1A1A] border border-white/20 shadow-2xl z-50">
                    <div className="p-2 space-y-1">
                      {categories.map((category) => (
                        <button
                          key={category.code}
                          onClick={() => {
                            setSelectedCategory(category.code);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                            selectedCategory === category.code
                              ? "bg-[#39FF14]/20 text-white"
                              : "hover:bg-white/5 text-gray-300"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Export Button */}
              <button className="px-6 py-3 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/50 text-[#39FF14] hover:bg-[#39FF14]/20 transition-all flex items-center gap-2 whitespace-nowrap">
                <Download className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {t("contacts.export")}
                </span>
              </button>
            </div>
          </div>

          {/* Contacts List */}
          <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {t("contacts.name")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {t("contacts.contact")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {t("contacts.location")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {t("contacts.category")}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {t("contacts.lastContact")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {contact.name}
                          </p>
                          {contact.company !== "N/A" && (
                            <p className="text-xs text-gray-400">
                              {contact.company}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Mail className="w-3 h-3 text-[#39FF14]" />
                            {contact.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <Phone className="w-3 h-3 text-[#00BFFF]" />
                            {contact.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                          <MapPin className="w-3 h-3 text-orange-500" />
                          {contact.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-[#39FF14]/20 text-[#39FF14] text-xs font-semibold">
                          {getCategoryName(contact.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-gray-400">
                          {contact.lastContact}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">{t("contacts.noResults")}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
