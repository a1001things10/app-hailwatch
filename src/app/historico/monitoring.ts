'use server'

import { supabase, insertHailEvent } from '@/lib/supabase'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

interface MonitoringResult {
  success: boolean
  eventsFound: number
  eventsInserted: number
  errors: string[]
  lastCheck: string
}

/**
 * Monitora e atualiza dados de tempestades de granizo usando OpenAI
 * Busca em fontes web e insere novos eventos no banco de dados
 */
export async function monitorHailstorms(): Promise<MonitoringResult> {
  const result: MonitoringResult = {
    success: false,
    eventsFound: 0,
    eventsInserted: 0,
    errors: [],
    lastCheck: new Date().toISOString()
  }

  try {
    // Verificar se Supabase está configurado
    if (!supabase) {
      result.errors.push('Supabase não configurado')
      return result
    }

    // Verificar se OpenAI está configurado
    if (!process.env.OPENAI_API_KEY) {
      result.errors.push('OpenAI API Key não configurada')
      return result
    }

    // Buscar eventos recentes (últimas 24 horas)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dateStr = yesterday.toISOString().split('T')[0]

    // Usar OpenAI para buscar informações sobre tempestades de granizo
    const prompt = `Search for recent hailstorm events from the last 24 hours (since ${dateStr}). 
    
For each event found, provide:
- Date (YYYY-MM-DD format)
- Time (HH:MM:SS format)
- Location (specific place/neighborhood)
- City
- State (if applicable)
- Country
- Hail size in millimeters
- Duration in minutes (if available)
- Wind speed in km/h (if available)
- Temperature in Celsius (if available)
- Severity index (0-10 scale)
- Brief description/notes

Format your response as a JSON array of events. If no events found, return an empty array.

Example format:
[
  {
    "date": "2024-01-15",
    "time": "14:30:00",
    "location": "Downtown",
    "city": "Oklahoma City",
    "state": "OK",
    "country": "United States",
    "hail_size_mm": 45,
    "duration_minutes": 30,
    "wind_speed_kmh": 95,
    "temperature_celsius": 20,
    "severity_index": 8,
    "notes": "Severe hailstorm with significant damage to vehicles"
  }
]`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a meteorological data analyst specialized in hailstorm events. Search for recent hailstorm reports from reliable weather sources, news outlets, and meteorological databases. Provide accurate, verified information only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    let eventsData: any

    try {
      eventsData = JSON.parse(responseText)
      
      // Se a resposta tiver uma propriedade "events", usar ela
      const events = eventsData.events || eventsData
      
      if (!Array.isArray(events)) {
        result.errors.push('Formato de resposta inválido da OpenAI')
        return result
      }

      result.eventsFound = events.length

      // Inserir cada evento no banco de dados
      for (const event of events) {
        try {
          // Determinar categoria baseada no tamanho
          let category = 'Pequeno'
          if (event.hail_size_mm > 100) category = 'Extremo'
          else if (event.hail_size_mm > 50) category = 'Muito Grande'
          else if (event.hail_size_mm > 25) category = 'Grande'
          else if (event.hail_size_mm > 15) category = 'Médio'

          // Preparar dados do evento
          const hailEvent = {
            date: event.date,
            time: event.time || '00:00:00',
            location: event.location,
            city: event.city,
            state: event.state || null,
            country: event.country,
            latitude: event.latitude || null,
            longitude: event.longitude || null,
            hail_size_mm: event.hail_size_mm,
            hail_size_category: category,
            duration_minutes: event.duration_minutes || null,
            wind_speed_kmh: event.wind_speed_kmh || null,
            temperature_celsius: event.temperature_celsius || null,
            damage_level: event.damage_level || null,
            affected_area_km2: event.affected_area_km2 || null,
            reports_count: event.reports_count || 1,
            severity_index: event.severity_index,
            notes: event.notes || null
          }

          // Verificar se evento já existe (evitar duplicatas)
          const { data: existing } = await supabase
            .from('hail_history')
            .select('id')
            .eq('date', hailEvent.date)
            .eq('city', hailEvent.city)
            .eq('hail_size_mm', hailEvent.hail_size_mm)
            .single()

          if (!existing) {
            await insertHailEvent(hailEvent)
            result.eventsInserted++
          }
        } catch (error: any) {
          result.errors.push(`Erro ao inserir evento em ${event.city}: ${error.message}`)
        }
      }

      result.success = result.eventsInserted > 0 || result.eventsFound === 0
    } catch (parseError: any) {
      result.errors.push(`Erro ao processar resposta da OpenAI: ${parseError.message}`)
    }
  } catch (error: any) {
    result.errors.push(`Erro geral no monitoramento: ${error.message}`)
  }

  return result
}

/**
 * Busca eventos de granizo em um período específico usando OpenAI
 */
export async function searchHailstormsByDateRange(
  startDate: string,
  endDate: string,
  region?: string
): Promise<MonitoringResult> {
  const result: MonitoringResult = {
    success: false,
    eventsFound: 0,
    eventsInserted: 0,
    errors: [],
    lastCheck: new Date().toISOString()
  }

  try {
    if (!supabase) {
      result.errors.push('Supabase não configurado')
      return result
    }

    if (!process.env.OPENAI_API_KEY) {
      result.errors.push('OpenAI API Key não configurada')
      return result
    }

    const regionFilter = region ? ` in ${region}` : ' worldwide'
    
    const prompt = `Search for hailstorm events between ${startDate} and ${endDate}${regionFilter}.
    
For each event found, provide:
- Date (YYYY-MM-DD format)
- Time (HH:MM:SS format)
- Location (specific place/neighborhood)
- City
- State (if applicable)
- Country
- Hail size in millimeters
- Duration in minutes (if available)
- Wind speed in km/h (if available)
- Temperature in Celsius (if available)
- Severity index (0-10 scale)
- Brief description/notes

Format your response as a JSON array of events. If no events found, return an empty array.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a meteorological data analyst specialized in hailstorm events. Search for hailstorm reports from reliable weather sources, news outlets, and meteorological databases. Provide accurate, verified information only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })

    const responseText = completion.choices[0]?.message?.content || '{}'
    const eventsData = JSON.parse(responseText)
    const events = eventsData.events || eventsData

    if (!Array.isArray(events)) {
      result.errors.push('Formato de resposta inválido da OpenAI')
      return result
    }

    result.eventsFound = events.length

    for (const event of events) {
      try {
        let category = 'Pequeno'
        if (event.hail_size_mm > 100) category = 'Extremo'
        else if (event.hail_size_mm > 50) category = 'Muito Grande'
        else if (event.hail_size_mm > 25) category = 'Grande'
        else if (event.hail_size_mm > 15) category = 'Médio'

        const hailEvent = {
          date: event.date,
          time: event.time || '00:00:00',
          location: event.location,
          city: event.city,
          state: event.state || null,
          country: event.country,
          latitude: event.latitude || null,
          longitude: event.longitude || null,
          hail_size_mm: event.hail_size_mm,
          hail_size_category: category,
          duration_minutes: event.duration_minutes || null,
          wind_speed_kmh: event.wind_speed_kmh || null,
          temperature_celsius: event.temperature_celsius || null,
          damage_level: event.damage_level || null,
          affected_area_km2: event.affected_area_km2 || null,
          reports_count: event.reports_count || 1,
          severity_index: event.severity_index,
          notes: event.notes || null
        }

        const { data: existing } = await supabase
          .from('hail_history')
          .select('id')
          .eq('date', hailEvent.date)
          .eq('city', hailEvent.city)
          .eq('hail_size_mm', hailEvent.hail_size_mm)
          .single()

        if (!existing) {
          await insertHailEvent(hailEvent)
          result.eventsInserted++
        }
      } catch (error: any) {
        result.errors.push(`Erro ao inserir evento: ${error.message}`)
      }
    }

    result.success = true
  } catch (error: any) {
    result.errors.push(`Erro na busca: ${error.message}`)
  }

  return result
}
