import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Criar cliente apenas se as credenciais estiverem disponíveis
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Tipos para o banco de dados
export interface HailHistory {
  id: string
  date: string
  time: string
  location: string
  city: string
  state?: string
  country: string
  latitude?: number
  longitude?: number
  hail_size_mm: number
  hail_size_category: string
  duration_minutes?: number
  wind_speed_kmh?: number
  temperature_celsius?: number
  damage_level?: string
  affected_area_km2?: number
  reports_count: number
  severity_index: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface HailCategory {
  id: string
  category_name: string
  size_min_mm: number
  size_max_mm: number
  description: string
  damage_potential: string
  created_at: string
}

// Funções de consulta
export async function getHailHistory(filters?: {
  country?: string
  startDate?: string
  endDate?: string
  minSeverity?: number
  city?: string
}) {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Configure suas credenciais nas configurações do projeto.')
  }

  let query = supabase
    .from('hail_history')
    .select('*')
    .order('date', { ascending: false })

  if (filters?.country && filters.country !== 'all') {
    query = query.eq('country', filters.country)
  }

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('date', filters.endDate)
  }

  if (filters?.minSeverity) {
    query = query.gte('severity_index', filters.minSeverity)
  }

  if (filters?.city) {
    query = query.ilike('city', `%${filters.city}%`)
  }

  const { data, error } = await query

  if (error) throw error
  return data as HailHistory[]
}

export async function getHailCategories() {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Configure suas credenciais nas configurações do projeto.')
  }

  const { data, error } = await supabase
    .from('hail_categories')
    .select('*')
    .order('size_min_mm', { ascending: true })

  if (error) throw error
  return data as HailCategory[]
}

export async function insertHailEvent(event: Omit<HailHistory, 'id' | 'created_at' | 'updated_at'>) {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Configure suas credenciais nas configurações do projeto.')
  }

  const { data, error } = await supabase
    .from('hail_history')
    .insert([event])
    .select()

  if (error) throw error
  return data[0] as HailHistory
}

export async function getHailStatistics(country?: string) {
  if (!supabase) {
    throw new Error('Supabase não está configurado. Configure suas credenciais nas configurações do projeto.')
  }

  let query = supabase
    .from('hail_history')
    .select('*')

  if (country && country !== 'all') {
    query = query.eq('country', country)
  }

  const { data, error } = await query

  if (error) throw error

  const events = data as HailHistory[]
  
  return {
    totalEvents: events.length,
    averageSeverity: events.reduce((acc, e) => acc + e.severity_index, 0) / events.length,
    largestHail: Math.max(...events.map(e => e.hail_size_mm)),
    mostAffectedCity: getMostFrequent(events.map(e => e.city)),
    eventsByYear: groupByYear(events)
  }
}

function getMostFrequent(arr: string[]): string {
  const frequency: Record<string, number> = {}
  arr.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1
  })
  return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b, '')
}

function groupByYear(events: HailHistory[]) {
  const grouped: Record<string, number> = {}
  events.forEach(event => {
    const year = new Date(event.date).getFullYear().toString()
    grouped[year] = (grouped[year] || 0) + 1
  })
  return grouped
}
