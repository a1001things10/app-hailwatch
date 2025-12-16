'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'

interface MonitoringResult {
  success: boolean
  eventsFound: number
  eventsInserted: number
  errors: string[]
  lastCheck: string
}

interface MonitoringPanelProps {
  onUpdate?: () => void
}

export default function MonitoringPanel({ onUpdate }: MonitoringPanelProps) {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<MonitoringResult | null>(null)
  const [intervalMinutes, setIntervalMinutes] = useState(1)
  const [nextCheckIn, setNextCheckIn] = useState<number | null>(null)

  // Função para executar monitoramento
  const runMonitoring = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/monitor-hailstorms', {
        method: 'POST'
      })
      const result: MonitoringResult = await response.json()
      setLastResult(result)
      
      // Atualizar lista de eventos se houver callback
      if (result.eventsInserted > 0 && onUpdate) {
        onUpdate()
      }
    } catch (error) {
      console.error('Erro ao executar monitoramento:', error)
      setLastResult({
        success: false,
        eventsFound: 0,
        eventsInserted: 0,
        errors: ['Erro ao conectar com o servidor'],
        lastCheck: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Iniciar/Parar monitoramento automático
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    let countdown: NodeJS.Timeout | null = null

    if (isMonitoring) {
      // Executar imediatamente
      runMonitoring()
      
      // Configurar próxima verificação
      setNextCheckIn(intervalMinutes * 60)
      
      // Intervalo principal
      interval = setInterval(() => {
        runMonitoring()
        setNextCheckIn(intervalMinutes * 60)
      }, intervalMinutes * 60 * 1000)

      // Countdown
      countdown = setInterval(() => {
        setNextCheckIn(prev => {
          if (prev === null || prev <= 1) return intervalMinutes * 60
          return prev - 1
        })
      }, 1000)
    } else {
      setNextCheckIn(null)
    }

    return () => {
      if (interval) clearInterval(interval)
      if (countdown) clearInterval(countdown)
    }
  }, [isMonitoring, intervalMinutes])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
    }
    if (!lastResult) {
      return <Clock className="w-5 h-5 text-gray-400" />
    }
    if (lastResult.success) {
      return <CheckCircle className="w-5 h-5 text-green-400" />
    }
    return <XCircle className="w-5 h-5 text-red-400" />
  }

  const getStatusColor = () => {
    if (isLoading) return 'border-blue-500/30 bg-blue-500/5'
    if (!lastResult) return 'border-gray-500/30 bg-gray-500/5'
    if (lastResult.success) return 'border-green-500/30 bg-green-500/5'
    return 'border-red-500/30 bg-red-500/5'
  }

  return (
    <div className={`bg-black/40 backdrop-blur-sm border rounded-xl p-6 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-bold text-white">Monitoramento Automático</h3>
            <p className="text-sm text-white/60">
              {isMonitoring ? 'Ativo' : 'Pausado'} • Verificação a cada {intervalMinutes} minuto{intervalMinutes > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isMonitoring
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-[#39FF14] hover:bg-[#39FF14]/90 text-black'
            }`}
          >
            {isMonitoring ? (
              <>
                <Pause className="w-4 h-4" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Iniciar
              </>
            )}
          </button>

          <button
            onClick={runMonitoring}
            disabled={isLoading || isMonitoring}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Manual
          </button>
        </div>
      </div>

      {/* Configuração de Intervalo */}
      <div className="mb-6">
        <label className="block text-sm text-white/60 mb-2">
          Intervalo de Verificação (minutos)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1"
            max="60"
            value={intervalMinutes}
            onChange={(e) => setIntervalMinutes(Number(e.target.value))}
            disabled={isMonitoring}
            className="flex-1 accent-[#39FF14] disabled:opacity-50"
          />
          <span className="text-white font-semibold w-12 text-right">
            {intervalMinutes}m
          </span>
        </div>
      </div>

      {/* Próxima Verificação */}
      {isMonitoring && nextCheckIn !== null && (
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-blue-400">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">
              Próxima verificação em: {formatTime(nextCheckIn)}
            </span>
          </div>
        </div>
      )}

      {/* Último Resultado */}
      {lastResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs text-white/60 mb-1">Eventos Encontrados</p>
              <p className="text-2xl font-bold text-[#39FF14]">{lastResult.eventsFound}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs text-white/60 mb-1">Eventos Inseridos</p>
              <p className="text-2xl font-bold text-blue-400">{lastResult.eventsInserted}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs text-white/60 mb-1">Erros</p>
              <p className="text-2xl font-bold text-red-400">{lastResult.errors.length}</p>
            </div>
          </div>

          {lastResult.errors.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-400 mb-2">Erros Detectados:</p>
                  <ul className="space-y-1">
                    {lastResult.errors.map((error, index) => (
                      <li key={index} className="text-xs text-red-300">
                        • {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-white/40 text-center">
            Última verificação: {new Date(lastResult.lastCheck).toLocaleString('pt-BR')}
          </p>
        </div>
      )}
    </div>
  )
}
