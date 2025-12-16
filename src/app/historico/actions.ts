'use server'

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export interface HailSearchResult {
  date: string
  location: string
  description: string
  severity: string
  source: string
}

export async function searchHailstormsByPeriod(
  startDate: string,
  endDate: string,
  language: string = 'pt'
): Promise<{ results: HailSearchResult[]; summary: string }> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key não configurada')
    }

    const languagePrompts: Record<string, string> = {
      pt: 'português',
      en: 'English',
      es: 'español',
      it: 'italiano',
      fr: 'français',
      nl: 'Nederlands',
      ja: '日本語'
    }

    const prompt = `Você é um especialista em meteorologia. Pesquise e liste eventos de chuva de granizo que ocorreram entre ${startDate} e ${endDate}.

Para cada evento encontrado, forneça:
- Data exata do evento
- Localização (cidade, estado/província, país)
- Descrição breve do evento (tamanho do granizo, duração, danos)
- Severidade (Leve, Moderado, Severo, Extremo)
- Fonte da informação (se disponível)

Responda em ${languagePrompts[language] || 'português'} no seguinte formato JSON:
{
  "results": [
    {
      "date": "YYYY-MM-DD",
      "location": "Cidade, Estado, País",
      "description": "Descrição do evento",
      "severity": "Severidade",
      "source": "Fonte"
    }
  ],
  "summary": "Resumo geral dos eventos encontrados no período"
}

Se não encontrar eventos específicos, forneça informações sobre padrões climáticos e regiões propensas a granizo no período solicitado.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em meteorologia e eventos climáticos extremos, com foco em chuvas de granizo.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) {
      throw new Error('Resposta vazia da OpenAI')
    }

    const data = JSON.parse(responseContent)
    return {
      results: data.results || [],
      summary: data.summary || ''
    }
  } catch (error: any) {
    console.error('Erro ao buscar eventos de granizo:', error)
    throw new Error(error.message || 'Erro ao buscar eventos de granizo')
  }
}
