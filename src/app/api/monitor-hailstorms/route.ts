import { NextRequest, NextResponse } from 'next/server'
import { monitorHailstorms } from '@/app/historico/monitoring'

export async function POST(request: NextRequest) {
  try {
    const result = await monitorHailstorms()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        eventsFound: 0,
        eventsInserted: 0,
        errors: [error.message || 'Erro desconhecido'],
        lastCheck: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
