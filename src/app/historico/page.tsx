"use client"

import { useState, useEffect } from 'react'
import { Calendar, MapPin, Cloud, AlertTriangle, Search, Filter, Download, TrendingUp, Settings } from 'lucide-react'
import { supabase, getHailHistory, getHailStatistics, type HailHistory } from '@/lib/supabase'

export default function HistoricoPage() {
  const [events, setEvents] = useState<HailHistory[]>([])
  const [filteredEvents, setFilteredEvents] = useState<HailHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Filtros
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [searchCity, setSearchCity] = useState('')
  const [minSeverity, setMinSeverity] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const countries = [
    { code: 'all', name: 'Todos os Países', flag: '🌍' },
    { code: 'United States', name: 'Estados Unidos', flag: '🇺🇸' },
    { code: 'Brazil', name: 'Brasil', flag: '🇧🇷' },
    { code: 'Canada', name: 'Canadá', flag: '🇨🇦' },
    { code: 'Argentina', name: 'Argentina', flag: '🇦🇷' },
    { code: 'Australia', name: 'Austrália', flag: '🇦🇺' },
    { code: 'China', name: 'China', flag: '🇨🇳' },
    { code: 'India', name: 'Índia', flag: '🇮🇳' },
    { code: 'South Africa', name: 'África do Sul', flag: '🇿🇦' }
  ]

  useEffect(() => {
    // Verificar se Supabase está configurado antes de carregar dados
    if (!supabase) {
      setError('Supabase não está configurado. Configure suas credenciais nas configurações do projeto.')
      setLoading(false)
      return
    }
    loadData()
  }, [])

  useEffect(() => {
    // Só aplicar filtros se Supabase estiver configurado e não houver erro
    if (!error && supabase) {
      applyFilters()
    }
  }, [events, selectedCountry, searchCity, minSeverity, startDate, endDate])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getHailHistory()
      setEvents(data)
      
      const stats = await getHailStatistics(selectedCountry)
      setStatistics(stats)
    } catch (error: any) {
      setError(error.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = async () => {
    try {
      setError(null)
      const filtered = await getHailHistory({
        country: selectedCountry,
        startDate,
        endDate,
        minSeverity,
        city: searchCity
      })
      setFilteredEvents(filtered)
      
      const stats = await getHailStatistics(selectedCountry)
      setStatistics(stats)
    } catch (error: any) {
      setError(error.message || 'Erro ao aplicar filtros')
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-red-500 bg-red-500/10 border-red-500/20'
    if (severity >= 6) return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    if (severity >= 4) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
    return 'text-green-500 bg-green-500/10 border-green-500/20'
  }

  const getSeverityLabel = (severity: number) => {
    if (severity >= 8) return 'Extremo'
    if (severity >= 6) return 'Severo'
    if (severity >= 4) return 'Moderado'
    return 'Leve'
  }

  const exportToCSV = () => {
    const headers = ['Data', 'Hora', 'Local', 'Cidade', 'País', 'Tamanho (mm)', 'Categoria', 'Severidade', 'Duração (min)', 'Vento (km/h)', 'Temperatura (°C)']
    const rows = filteredEvents.map(e => [
      e.date,
      e.time,
      e.location,
      e.city,
      e.country,
      e.hail_size_mm,
      e.hail_size_category,
      e.severity_index,
      e.duration_minutes || '-',
      e.wind_speed_kmh || '-',
      e.temperature_celsius || '-'
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hailwatch-historico-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#39FF14] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Carregando histórico...</p>
        </div>
      </div>
    )
  }

  // Tela de erro quando Supabase não está configurado
  if (error && error.includes('não está configurado')) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Configuração Necessária</h2>
          <p className="text-white/60 mb-6">
            Para acessar o histórico de granizo, você precisa configurar suas credenciais do Supabase.
          </p>
          <div className="space-y-3">
            <a
              href="/dashboard"
              className="block w-full px-6 py-3 bg-[#39FF14] text-black font-semibold rounded-lg hover:bg-[#39FF14]/90 transition-all"
            >
              Voltar ao Dashboard
            </a>
            <p className="text-sm text-white/40">
              Configure o Supabase em: Configurações → Integrações
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Histórico de Granizo</h1>
              <p className="text-white/60">Dados dos últimos 5 anos</p>
            </div>
            <button
              onClick={exportToCSV}
              disabled={filteredEvents.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-[#39FF14] text-black font-semibold rounded-lg hover:bg-[#39FF14]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Estatísticas */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#39FF14]/10 to-transparent border border-[#39FF14]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-[#39FF14]" />
                <span className="text-white/60 text-sm">Total de Eventos</span>
              </div>
              <p className="text-3xl font-bold text-[#39FF14]">{statistics.totalEvents}</p>
            </div>

            <div className="bg-gradient-to-br from-[#00BFFF]/10 to-transparent border border-[#00BFFF]/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#00BFFF]" />
                <span className="text-white/60 text-sm">Severidade Média</span>
              </div>
              <p className="text-3xl font-bold text-[#00BFFF]">{statistics.averageSeverity.toFixed(1)}/10</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Cloud className="w-5 h-5 text-purple-400" />
                <span className="text-white/60 text-sm">Maior Granizo</span>
              </div>
              <p className="text-3xl font-bold text-purple-400">{statistics.largestHail}mm</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-white/60 text-sm">Cidade Mais Afetada</span>
              </div>
              <p className="text-xl font-bold text-orange-400">{statistics.mostAffectedCity}</p>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-[#39FF14]" />
            <h2 className="text-xl font-bold">Filtros</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* País */}
            <div>
              <label className="block text-sm text-white/60 mb-2">País</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code} className="bg-[#0D0D0D]">
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Cidade</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Buscar cidade..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-[#39FF14] transition-colors"
                />
              </div>
            </div>

            {/* Data Inicial */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Data Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
              />
            </div>

            {/* Data Final */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Data Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#39FF14] transition-colors"
              />
            </div>

            {/* Severidade Mínima */}
            <div>
              <label className="block text-sm text-white/60 mb-2">Severidade Mínima: {minSeverity}</label>
              <input
                type="range"
                min="0"
                max="10"
                value={minSeverity}
                onChange={(e) => setMinSeverity(Number(e.target.value))}
                className="w-full accent-[#39FF14]"
              />
            </div>
          </div>
        </div>

        {/* Lista de Eventos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Eventos Registrados ({filteredEvents.length})</h2>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
              <Cloud className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Nenhum evento encontrado com os filtros aplicados</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-[#39FF14]/30 transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4 mb-3">
                        <div className={`px-3 py-1 rounded-lg border text-sm font-semibold ${getSeverityColor(event.severity_index)}`}>
                          {getSeverityLabel(event.severity_index)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{event.location}</h3>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.city}, {event.state && `${event.state}, `}{event.country}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-white/40 mb-1">Tamanho do Granizo</p>
                          <p className="text-sm font-semibold text-[#39FF14]">{event.hail_size_mm}mm ({event.hail_size_category})</p>
                        </div>
                        {event.duration_minutes && (
                          <div>
                            <p className="text-xs text-white/40 mb-1">Duração</p>
                            <p className="text-sm font-semibold">{event.duration_minutes} min</p>
                          </div>
                        )}
                        {event.wind_speed_kmh && (
                          <div>
                            <p className="text-xs text-white/40 mb-1">Vento</p>
                            <p className="text-sm font-semibold">{event.wind_speed_kmh} km/h</p>
                          </div>
                        )}
                        {event.temperature_celsius && (
                          <div>
                            <p className="text-xs text-white/40 mb-1">Temperatura</p>
                            <p className="text-sm font-semibold">{event.temperature_celsius}°C</p>
                          </div>
                        )}
                      </div>

                      {event.notes && (
                        <p className="text-sm text-white/60 mt-3 italic">{event.notes}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#39FF14] mb-1">{event.severity_index}</div>
                      <div className="text-xs text-white/40">Índice de Severidade</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
