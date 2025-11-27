import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
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

    // Obtener datos históricos de ingresos por mes
    const ingresosPorMes = await Promise.all(
      historicoMeses.map(async (mes) => {
        const { data } = await supabase
          .from("transacciones_financieras")
          .select("monto")
          .gte("fecha_transaccion", mes.inicio)
          .lte("fecha_transaccion", mes.fin);
        const total = data?.reduce((acc, t) => acc + Number(t.monto), 0) || 0;
        return { mes: mes.mes, ingresos: total };
      })
    );

    // Obtener datos históricos de citas por mes
    const citasPorMes = await Promise.all(
      historicoMeses.map(async (mes) => {
        const { count } = await supabase
          .from("citas")
          .select("*", { count: "exact", head: true })
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
      .select("*", { count: "exact", head: true });

    // 5. Citas por estado
    const { data: citasPorEstado } = await supabase
      .from("citas")
      .select("estado");

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
      .gte("fecha_inicio", startOfWeek);

    // 7. Citas de hoy
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { count: citasHoy } = await supabase
      .from("citas")
      .select("*", { count: "exact", head: true })
      .gte("fecha_inicio", todayStart.toISOString())
      .lte("fecha_inicio", todayEnd.toISOString());

    // 8. Ingresos del mes actual
    const { data: transaccionesMes } = await supabase
      .from("transacciones_financieras")
      .select("monto")
      .gte("fecha_transaccion", startOfMonth);

    const ingresosMes =
      transaccionesMes?.reduce((acc, t) => acc + Number(t.monto), 0) || 0;

    // 9. Ingresos del mes anterior
    const { data: transaccionesAnterior } = await supabase
      .from("transacciones_financieras")
      .select("monto")
      .gte("fecha_transaccion", startOfLastMonth)
      .lte("fecha_transaccion", endOfLastMonth);

    const ingresosMesAnterior =
      transaccionesAnterior?.reduce((acc, t) => acc + Number(t.monto), 0) || 0;

    // 10. Planes de tratamiento por estado
    const { data: planesPorEstado } = await supabase
      .from("planes_procedimiento")
      .select("estado, costo_total");

    const estadosPlanes = {
      pendiente: 0,
      enProgreso: 0,
      completado: 0,
      cancelado: 0,
    };

    let valorTotalPlanes = 0;
    let valorPlanesCompletados = 0;

    planesPorEstado?.forEach((plan) => {
      valorTotalPlanes += Number(plan.costo_total) || 0;
      switch (plan.estado) {
        case "Pendiente":
          estadosPlanes.pendiente++;
          break;
        case "En Progreso":
          estadosPlanes.enProgreso++;
          valorPlanesCompletados += Number(plan.costo_total) || 0;
          break;
        case "Completado":
          estadosPlanes.completado++;
          valorPlanesCompletados += Number(plan.costo_total) || 0;
          break;
        case "Cancelado":
          estadosPlanes.cancelado++;
          break;
      }
    });

    // 11. Total de personal activo
    const { count: totalPersonal } = await supabase
      .from("personal")
      .select("*", { count: "exact", head: true })
      .eq("activo", true);

    // 12. Procedimientos más realizados (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: procedimientosPopulares } = await supabase
      .from("transacciones_financieras")
      .select(
        `
        procedimiento_id,
        procedimientos(nombre)
      `
      )
      .gte("fecha_transaccion", thirtyDaysAgo.toISOString());

    // Contar procedimientos
    const conteoProc: Record<string, { nombre: string; count: number }> = {};
    procedimientosPopulares?.forEach((t) => {
      const procId = t.procedimiento_id;
      const procedimiento = t.procedimientos as unknown as {
        nombre: string;
      } | null;
      const procNombre = procedimiento?.nombre || "Sin nombre";
      if (!conteoProc[procId]) {
        conteoProc[procId] = { nombre: procNombre, count: 0 };
      }
      conteoProc[procId].count++;
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
        total: planesPorEstado?.length || 0,
        porEstado: estadosPlanes,
        valorTotal: valorTotalPlanes,
        valorCompletado: valorPlanesCompletados,
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
