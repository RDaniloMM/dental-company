'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrencySymbol } from '@/lib/currency'

interface CasoKPIsProps {
  casoId: string
}

type KpiValues = {
  presupuestado: number
  pagado: number
  saldo: number
  codigo: string
}

export default function CasoKPIs({ casoId }: CasoKPIsProps) {
  const [kpis, setKpis] = useState<{ byCurrency: Record<string, KpiValues>; estado: string }>({ 
    byCurrency: {}, 
    estado: 'Pendiente' 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarKPIs = async () => {
      setLoading(true)
      try {
        // Obtener presupuestos y pagos directamente
        const [presRes, pagosRes] = await Promise.all([
          fetch(`/api/kpi?caso_id=${casoId}`),
          fetch(`/api/pagos?caso_id=${casoId}`)
        ])
        
        if (!presRes.ok || !pagosRes.ok) throw new Error('Error al cargar KPIs')
        
        const presupuestos = await presRes.json()
        const pagos = await pagosRes.json()
        
        type PresupuestoKPI = {
          monedas?: { codigo?: string };
          costo_total?: number | string;
        }
        
        type PagoKPI = {
          monedas?: { codigo?: string };
          monto?: number | string;
        }
        
        // Procesar presupuestos para calcular totales por moneda
        const currencyTotals: Record<string, { presupuestado: number; pagado: number; codigo: string }> = {}
        
        if (presupuestos.data && Array.isArray(presupuestos.data)) {
          presupuestos.data.forEach((pres: PresupuestoKPI) => {
            const monedaCodigo = pres.monedas?.codigo || 'PEN'
            const costoTotal = Number(pres.costo_total || 0)
            
            if (!currencyTotals[monedaCodigo]) {
              currencyTotals[monedaCodigo] = { presupuestado: 0, pagado: 0, codigo: monedaCodigo }
            }
            currencyTotals[monedaCodigo].presupuestado += costoTotal
          })
        }
        
        // Agregar pagos
        if (pagos.data && Array.isArray(pagos.data)) {
          pagos.data.forEach((pago: PagoKPI) => {
            const monedaCodigo = pago.monedas?.codigo || 'PEN'
            const pagoMonto = Number(pago.monto || 0)
            
            if (!currencyTotals[monedaCodigo]) {
              currencyTotals[monedaCodigo] = { presupuestado: 0, pagado: 0, codigo: monedaCodigo }
            }
            currencyTotals[monedaCodigo].pagado += pagoMonto
          })
        }

        const byCurrency: Record<string, KpiValues> = {}
        Object.entries(currencyTotals).forEach(([codigo, vals]) => {
          byCurrency[codigo] = {
            presupuestado: vals.presupuestado,
            pagado: vals.pagado,
            saldo: vals.presupuestado - vals.pagado,
            codigo: vals.codigo
          }
        })

        // Determinar estado general
        let estadoGeneral = 'Pendiente'
        const totalSaldo = Object.values(byCurrency).reduce((sum, v) => sum + v.saldo, 0)
        const totalPresupuestado = Object.values(byCurrency).reduce((sum, v) => sum + v.presupuestado, 0)
        
        if (totalPresupuestado > 0) {
          if (totalSaldo <= 0) estadoGeneral = 'Completado'
          else if (totalSaldo < totalPresupuestado) estadoGeneral = 'En Progreso'
        }

        setKpis({ byCurrency, estado: estadoGeneral })
      } catch (err) {
        console.error('Error loading KPIs:', err)
      } finally {
        setLoading(false)
      }
    }

    cargarKPIs()
  }, [casoId])

  if (loading || Object.keys(kpis.byCurrency).length === 0) return null

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4'>
      <Card className='p-3 border shadow-sm bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 flex flex-col justify-between h-full'>
        <div className='text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2'>Presupuestado</div>
        <div className='space-y-1.5'>
          {Object.entries(kpis.byCurrency).map(([moneda, vals]) => {
            const symbol = getCurrencySymbol(vals.codigo).trim()
            return (
              <div key={moneda} className='flex justify-between items-center border-b last:border-0 pb-1 last:pb-0 border-slate-200 dark:border-slate-700'>
                <span className='text-xs font-bold text-blue-600 dark:text-blue-400'>{vals.codigo}</span>
                <div className='flex items-center gap-1'>
                  <span className='text-sm text-blue-600 dark:text-blue-400 font-medium'>{symbol}</span>
                  <span className='text-base font-bold text-blue-700 dark:text-blue-200'>{vals.presupuestado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
      
      <Card className='p-3 border shadow-sm bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 flex flex-col justify-between h-full'>
        <div className='text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2'>Total Pagado</div>
        <div className='space-y-1.5'>
          {Object.entries(kpis.byCurrency).map(([moneda, vals]) => {
            const symbol = getCurrencySymbol(vals.codigo).trim()
            return (
              <div key={moneda} className='flex justify-between items-center border-b last:border-0 pb-1 last:pb-0 border-slate-200 dark:border-slate-700'>
                <span className='text-xs font-bold text-green-600 dark:text-green-400'>{vals.codigo}</span>
                <div className='flex items-center gap-1'>
                  <span className='text-sm text-green-600 dark:text-green-400 font-medium'>{symbol}</span>
                  <span className='text-base font-bold text-green-700 dark:text-green-200'>{vals.pagado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className='p-3 border shadow-sm bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 flex flex-col justify-between h-full'>
        <div className='text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2'>Por Cobrar</div>
        <div className='space-y-1.5'>
          {Object.entries(kpis.byCurrency).map(([moneda, vals]) => {
            const symbol = getCurrencySymbol(vals.codigo).trim()
            return (
              <div key={moneda} className='flex justify-between items-center border-b last:border-0 pb-1 last:pb-0 border-slate-200 dark:border-slate-700'>
                <span className='text-xs font-bold text-amber-600 dark:text-amber-400'>{vals.codigo}</span>
                <div className='flex items-center gap-1'>
                  <span className='text-sm text-amber-600 dark:text-amber-400 font-medium'>{symbol}</span>
                  <span className='text-base font-bold text-amber-700 dark:text-amber-200'>{vals.saldo.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card className='p-3 border shadow-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 flex flex-col justify-center items-center h-full'>
        <div className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2'>Estado General</div>
        <Badge variant="outline" className={`px-3 py-1 text-sm border capitalize ${
          kpis.estado === 'Completado' ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700' :
          kpis.estado === 'En Progreso' ? 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700' :
          'bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-200 dark:border-red-700'
        }`}>
          {kpis.estado}
        </Badge>
      </Card>
    </div>
  )
}
