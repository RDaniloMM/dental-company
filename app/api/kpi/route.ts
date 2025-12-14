import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { convertToPEN } from "@/lib/currency-converter";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const casoId = request.nextUrl.searchParams.get("caso_id");

    // Si viene caso_id, retornar presupuestos del caso con monedas
    if (casoId) {
      const { data, error } = await supabase
        .from("presupuestos")
        .select("id, costo_total, moneda_id, monedas(codigo)")
        .eq("caso_id", casoId)
        .is("deleted_at", null);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ data: data || [] });
    }
    // Fechas para filtros
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();
    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    ).toISOString();
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0
    ).toISOString();
    const startOfWeek = new Date(
      now.setDate(now.getDate() - now.getDay())
    ).toISOString();

    // Generar datos históricos de los últimos 6 meses
    const historicoMeses = [];
    for (let i = 5; i >= 0; i--) {
      const mesDate = new Date();
      mesDate.setMonth(mesDate.getMonth() - i);
      const inicioMes = new Date(mesDate.getFullYear(), mesDate.getMonth(), 1);
      const finMes = new Date(mesDate.getFullYear(), mesDate.getMonth() + 1, 0);

      historicoMeses.push({
        mes: inicioMes.toLocaleDateString("es-ES", { month: "short" }),
        mesCompleto: inicioMes.toLocaleDateString("es-ES", {
          month: "long",
          year: "numeric",
        }),
        inicio: inicioMes.toISOString(),
        fin: finMes.toISOString(),
      });
    }

    // Obtener datos históricos de pacientes por mes
    const pacientesPorMes = await Promise.all(
      historicoMeses.map(async (mes) => {
        const { count } = await supabase
          .from("pacientes")
          .select("*", { count: "exact", head: true })
          .gte("created_at", mes.inicio)
          .lte("created_at", mes.fin);
        return { mes: mes.mes, pacientes: count || 0 };
      })
    );

    // Obtener datos históricos de ingresos por mes (de pagos) - CONVERTIDOS A PEN
    const ingresosPorMes = await Promise.all(
      historicoMeses.map(async (mes) => {
        // Ingresos de pagos con moneda (presupuestos)
        const { data: pagos } = await supabase
          .from("pagos")
          .select("monto, monedas(codigo)")
          .gte("fecha_pago", mes.inicio)
          .lte("fecha_pago", mes.fin);

        // Convertir todos a PEN
        const totalPagos =
          pagos?.reduce((acc, p) => {
            const monedaCodigo = (p.monedas as any)?.codigo || "PEN";
            const montoPEN = convertToPEN(Number(p.monto), monedaCodigo);
            return acc + montoPEN;
          }, 0) || 0;

        return { mes: mes.mes, ingresos: totalPagos };
      })
    );

    // Obtener datos históricos de citas por mes
    const citasPorMes = await Promise.all(
      historicoMeses.map(async (mes) => {
        const { count } = await supabase
          .from("citas")
          .select("*", { count: "exact", head: true })
          .is("deleted_at", null)
          .gte("fecha_inicio", mes.inicio)
          .lte("fecha_inicio", mes.fin);
        return { mes: mes.mes, citas: count || 0 };
      })
    );

    // 1. Total de pacientes
    const { count: totalPacientes } = await supabase
      .from("pacientes")
      .select("*", { count: "exact", head: true });

    // 2. Pacientes nuevos este mes
    const { count: pacientesNuevos } = await supabase
      .from("pacientes")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth);

    // 3. Pacientes del mes anterior (para calcular crecimiento)
    const { count: pacientesMesAnterior } = await supabase
      .from("pacientes")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth)
      .lte("created_at", endOfLastMonth);

    // 4. Total de citas
    const { count: totalCitas } = await supabase
      .from("citas")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null);

    // 5. Citas por estado
    const { data: citasPorEstado } = await supabase
      .from("citas")
      .select("estado")
      .is("deleted_at", null);

    const estadosCitas = {
      programada: 0,
      confirmada: 0,
      cancelada: 0,
      completada: 0,
      noAsistio: 0,
    };

    citasPorEstado?.forEach((cita) => {
      switch (cita.estado) {
        case "Programada":
          estadosCitas.programada++;
          break;
        case "Confirmada":
          estadosCitas.confirmada++;
          break;
        case "Cancelada":
          estadosCitas.cancelada++;
          break;
        case "Completada":
          estadosCitas.completada++;
          break;
        case "No Asistió":
          estadosCitas.noAsistio++;
          break;
      }
    });

    // 6. Citas de esta semana
    const { count: citasSemana } = await supabase
      .from("citas")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .gte("fecha_inicio", startOfWeek);

    // 7. Citas de hoy
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { count: citasHoy } = await supabase
      .from("citas")
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .gte("fecha_inicio", todayStart.toISOString())
      .lte("fecha_inicio", todayEnd.toISOString());

    // 8. Ingresos del mes actual (de pagos) - CONVERTIDOS A PEN
    const { data: pagosMes } = await supabase
      .from("pagos")
      .select("monto, monedas(codigo)")
      .gte("fecha_pago", startOfMonth);

    const ingresosMes =
      pagosMes?.reduce((acc, p) => {
        const monedaCodigo = (p.monedas as any)?.codigo || "PEN";
        const montoPEN = convertToPEN(Number(p.monto), monedaCodigo);
        return acc + montoPEN;
      }, 0) || 0;

    // 9. Ingresos del mes anterior (de pagos) - CONVERTIDOS A PEN
    const { data: pagosAnterior } = await supabase
      .from("pagos")
      .select("monto, monedas(codigo)")
      .gte("fecha_pago", startOfLastMonth)
      .lte("fecha_pago", endOfLastMonth);

    const ingresosMesAnterior =
      pagosAnterior?.reduce((acc, p) => {
        const monedaCodigo = (p.monedas as any)?.codigo || "PEN";
        const montoPEN = convertToPEN(Number(p.monto), monedaCodigo);
        return acc + montoPEN;
      }, 0) || 0;

    // 10. Presupuestos/Tratamientos por estado (usando tabla presupuestos)
    const { data: presupuestosPorEstado } = await supabase
      .from("presupuestos")
      .select("estado, costo_total, total_pagado, saldo_pendiente");

    const estadosPresupuestos = {
      porCobrar: 0, // Estado inicial - sin pagos
      parcial: 0, // Con pagos parciales
      pagado: 0, // Totalmente pagado
      cancelado: 0, // Cancelado
    };

    let valorTotalPresupuestos = 0;
    let valorCobrado = 0;
    let valorPendiente = 0;

    presupuestosPorEstado?.forEach((presupuesto) => {
      const costoTotal = Number(presupuesto.costo_total) || 0;
      const totalPagado = Number(presupuesto.total_pagado) || 0;

      valorTotalPresupuestos += costoTotal;
      valorCobrado += totalPagado;
      valorPendiente += Number(presupuesto.saldo_pendiente) || 0;

      switch (presupuesto.estado) {
        case "Por Cobrar":
          estadosPresupuestos.porCobrar++;
          break;
        case "Parcial":
          estadosPresupuestos.parcial++;
          break;
        case "Pagado":
          estadosPresupuestos.pagado++;
          break;
        case "Cancelado":
          estadosPresupuestos.cancelado++;
          break;
      }
    });

    // 11. Total de personal activo
    const { count: totalPersonal } = await supabase
      .from("personal")
      .select("*", { count: "exact", head: true })
      .eq("activo", true);

    // 12. Procedimientos más realizados (últimos 30 días) - desde presupuesto_items
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: procedimientosPopulares } = await supabase
      .from("presupuesto_items")
      .select(
        `
        procedimiento_id,
        nombre_procedimiento,
        cantidad,
        created_at
      `
      )
      .gte("created_at", thirtyDaysAgo.toISOString())
      .not("procedimiento_id", "is", null);

    // Contar procedimientos
    const conteoProc: Record<string, { nombre: string; count: number }> = {};
    procedimientosPopulares?.forEach((item) => {
      const procId = item.procedimiento_id;
      if (procId) {
        if (!conteoProc[procId]) {
          conteoProc[procId] = {
            nombre: item.nombre_procedimiento || "Sin nombre",
            count: 0,
          };
        }
        conteoProc[procId].count += item.cantidad || 1;
      }
    });

    const topProcedimientos = Object.values(conteoProc)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 13. Tasa de asistencia (citas completadas / citas no canceladas)
    const citasNoCancel = totalCitas ? totalCitas - estadosCitas.cancelada : 0;
    const tasaAsistencia =
      citasNoCancel > 0
        ? Math.round((estadosCitas.completada / citasNoCancel) * 100)
        : 0;

    // 14. Próximas citas (siguiente semana)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const { data: proximasCitas } = await supabase
      .from("citas")
      .select(
        `
        id,
        fecha_inicio,
        motivo,
        estado,
        pacientes(nombres, apellidos),
        personal(nombres, apellidos)
      `
      )
      .is("deleted_at", null)
      .gte("fecha_inicio", new Date().toISOString())
      .lte("fecha_inicio", nextWeek.toISOString())
      .order("fecha_inicio", { ascending: true })
      .limit(10);

    // Calcular crecimiento porcentual
    const crecimientoPacientes =
      pacientesMesAnterior && pacientesMesAnterior > 0
        ? Math.round(
            (((pacientesNuevos || 0) - pacientesMesAnterior) /
              pacientesMesAnterior) *
              100
          )
        : pacientesNuevos || 0 > 0
        ? 100
        : 0;

    const crecimientoIngresos =
      ingresosMesAnterior > 0
        ? Math.round(
            ((ingresosMes - ingresosMesAnterior) / ingresosMesAnterior) * 100
          )
        : ingresosMes > 0
        ? 100
        : 0;

    return NextResponse.json({
      pacientes: {
        total: totalPacientes || 0,
        nuevosEsteMes: pacientesNuevos || 0,
        crecimiento: crecimientoPacientes,
        historico: pacientesPorMes,
      },
      citas: {
        total: totalCitas || 0,
        hoy: citasHoy || 0,
        semana: citasSemana || 0,
        porEstado: estadosCitas,
        tasaAsistencia,
        proximas: proximasCitas || [],
        historico: citasPorMes,
      },
      finanzas: {
        ingresosMes,
        ingresosMesAnterior,
        crecimiento: crecimientoIngresos,
        historico: ingresosPorMes,
      },
      tratamientos: {
        total: presupuestosPorEstado?.length || 0,
        porEstado: estadosPresupuestos,
        valorTotal: valorTotalPresupuestos,
        valorCobrado: valorCobrado,
        valorPendiente: valorPendiente,
        topProcedimientos,
      },
      personal: {
        totalActivo: totalPersonal || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching KPI data:", error);
    return NextResponse.json(
      { error: "Error al obtener métricas KPI" },
      { status: 500 }
    );
  }
}
