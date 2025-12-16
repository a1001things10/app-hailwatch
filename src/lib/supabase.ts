import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validar se as credenciais são válidas (não vazias e com formato correto)
const isValidUrl = (url: string) => {
  if (!url || url.trim() === '') return false
  try {
    new URL(url)
    return url.includes('supabase.co')
  } catch {
    return false
  }
}

const isValidKey = (key: string) => {
  return key && key.trim() !== '' && key.length > 20
}

// Criar cliente apenas se as credenciais forem válidas
export const supabase = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey)
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
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  try {
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

    if (error) {
      console.error('Erro ao buscar histórico:', error)
      
      // Erro de tabela não encontrada
      if (error.code === 'PGRST205' || error.message.includes('table') || error.message.includes('schema cache')) {
        throw new Error('TABLE_NOT_FOUND')
      }
      
      // Erro de autenticação
      if (error.message.includes('JWT') || error.message.includes('API key') || error.message.includes('apikey')) {
        throw new Error('INVALID_CREDENTIALS')
      }
      
      throw new Error('DATABASE_ERROR')
    }
    
    return data as HailHistory[]
  } catch (error: any) {
    console.error('Erro na função getHailHistory:', error)
    
    // Propagar erros conhecidos
    if (error.message === 'TABLE_NOT_FOUND' || error.message === 'INVALID_CREDENTIALS' || error.message === 'DATABASE_ERROR') {
      throw error
    }
    
    // Erro de rede/fetch
    if (error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error('NETWORK_ERROR')
    }
    
    throw new Error('UNKNOWN_ERROR')
  }
}

export async function getHailCategories() {
  if (!supabase) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  try {
    const { data, error } = await supabase
      .from('hail_categories')
      .select('*')
      .order('size_min_mm', { ascending: true })

    if (error) {
      console.error('Erro ao buscar categorias:', error)
      
      if (error.code === 'PGRST205' || error.message.includes('table') || error.message.includes('schema cache')) {
        throw new Error('TABLE_NOT_FOUND')
      }
      
      if (error.message.includes('JWT') || error.message.includes('API key') || error.message.includes('apikey')) {
        throw new Error('INVALID_CREDENTIALS')
      }
      
      throw new Error('DATABASE_ERROR')
    }
    
    return data as HailCategory[]
  } catch (error: any) {
    console.error('Erro na função getHailCategories:', error)
    
    if (error.message === 'TABLE_NOT_FOUND' || error.message === 'INVALID_CREDENTIALS' || error.message === 'DATABASE_ERROR') {
      throw error
    }
    
    if (error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error('NETWORK_ERROR')
    }
    
    throw new Error('UNKNOWN_ERROR')
  }
}

export async function insertHailEvent(event: Omit<HailHistory, 'id' | 'created_at' | 'updated_at'>) {
  if (!supabase) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  try {
    const { data, error } = await supabase
      .from('hail_history')
      .insert([event])
      .select()

    if (error) {
      console.error('Erro ao inserir evento:', error)
      
      if (error.code === 'PGRST205' || error.message.includes('table') || error.message.includes('schema cache')) {
        throw new Error('TABLE_NOT_FOUND')
      }
      
      if (error.message.includes('JWT') || error.message.includes('API key') || error.message.includes('apikey')) {
        throw new Error('INVALID_CREDENTIALS')
      }
      
      throw new Error('DATABASE_ERROR')
    }
    
    return data[0] as HailHistory
  } catch (error: any) {
    console.error('Erro na função insertHailEvent:', error)
    
    if (error.message === 'TABLE_NOT_FOUND' || error.message === 'INVALID_CREDENTIALS' || error.message === 'DATABASE_ERROR') {
      throw error
    }
    
    if (error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error('NETWORK_ERROR')
    }
    
    throw new Error('UNKNOWN_ERROR')
  }
}

export async function getHailStatistics(country?: string) {
  if (!supabase) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  try {
    let query = supabase
      .from('hail_history')
      .select('*')

    if (country && country !== 'all') {
      query = query.eq('country', country)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar estatísticas:', error)
      
      if (error.code === 'PGRST205' || error.message.includes('table') || error.message.includes('schema cache')) {
        throw new Error('TABLE_NOT_FOUND')
      }
      
      if (error.message.includes('JWT') || error.message.includes('API key') || error.message.includes('apikey')) {
        throw new Error('INVALID_CREDENTIALS')
      }
      
      throw new Error('DATABASE_ERROR')
    }

    const events = data as HailHistory[]
    
    if (events.length === 0) {
      return {
        totalEvents: 0,
        averageSeverity: 0,
        largestHail: 0,
        mostAffectedCity: '-',
        eventsByYear: {}
      }
    }
    
    return {
      totalEvents: events.length,
      averageSeverity: events.reduce((acc, e) => acc + e.severity_index, 0) / events.length,
      largestHail: Math.max(...events.map(e => e.hail_size_mm)),
      mostAffectedCity: getMostFrequent(events.map(e => e.city)),
      eventsByYear: groupByYear(events)
    }
  } catch (error: any) {
    console.error('Erro na função getHailStatistics:', error)
    
    if (error.message === 'TABLE_NOT_FOUND' || error.message === 'INVALID_CREDENTIALS' || error.message === 'DATABASE_ERROR') {
      throw error
    }
    
    if (error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error('NETWORK_ERROR')
    }
    
    throw new Error('UNKNOWN_ERROR')
  }
}

function getMostFrequent(arr: string[]): string {
  if (arr.length === 0) return '-'
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
