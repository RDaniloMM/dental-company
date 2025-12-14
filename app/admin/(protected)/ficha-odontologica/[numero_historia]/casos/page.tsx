import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CasosList from "@/components/casos/CasosList";
import { type ComponentProps } from "react";
import { convertToPEN } from "@/lib/currency-converter";

interface CasosPageProps {
  params: Promise<{ numero_historia: string }>;
}

interface CitaRow {
  fecha_inicio: string;
}

interface PersonalRow {
  nombre_completo: string | null;
  rol: string | null;
}

interface DiagnosticoRow {
  id: string;
  nombre: string;
}

interface PresupuestoRow {
  id: string;
  costo_total: number;
  total_pagado: number;
  estado: string;
  monedas: { codigo: string; simbolo: string } | null;
}

interface SeguimientoRow {
  id: string;
  fecha: string;
  titulo: string;
}

interface CasoRow {
  id: string;
  nombre_caso: string;
  diagnostico_preliminar: string | null;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_cierre: string | null;
  estado: string | null;
  medico_id: string | null;
  personal: PersonalRow | null;
  citas: CitaRow[];
  diagnosticos: DiagnosticoRow[];
  presupuestos: PresupuestoRow[];
  seguimientos: SeguimientoRow[];
}

type CasosListProps = ComponentProps<typeof CasosList>;

export default async function CasosPage({
  params: paramsPromise,
}: CasosPageProps) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: paciente, error: pacienteError } = await supabase
    .from("pacientes")
    .select("id, numero_historia")
    .eq("numero_historia", params.numero_historia)
    .single();

  if (pacienteError || !paciente) {
    return (
      <div className='p-6 text-center text-red-500'>
        No se pudo encontrar al paciente o su historial.
      </div>
    );
  }

  let historiaId: string | null = null;

  const { data: historiaExistente, error: historiaError } = await supabase
    .from("historias_clinicas")
    .select("id")
    .eq("paciente_id", paciente.id)
    .single();

  if (historiaError && historiaError.code === "PGRST116") {
    const { data: newHistoria, error: createError } = await supabase
      .from("historias_clinicas")
      .insert({ paciente_id: paciente.id })
      .select("id")
      .single();

    if (createError) {
      return (
        <div className='p-6 text-center text-red-500'>
          Error al crear la historia clínica del paciente.
        </div>
      );
    }
    historiaId = newHistoria?.id ?? null;
  } else if (historiaError) {
    return (
      <div className='p-6 text-center text-red-500'>
        Error al cargar la historia clínica del paciente.
      </div>
    );
  } else {
    historiaId = historiaExistente?.id ?? null;
  }

  if (!historiaId) {
    return (
      <div className='p-6 text-center text-red-500'>
        No se pudo obtener la historia clínica del paciente.
      </div>
    );
  }

  const { data: casosRaw, error: casosError } = await supabase
    .from("casos_clinicos")
    .select(
      `id, nombre_caso, diagnostico_preliminar, descripcion, fecha_inicio, fecha_cierre, estado,
       citas(fecha_inicio, odontologo_id, personal:odontologo_id(nombre_completo, rol))`
    )
    .eq("historia_id", historiaId)
    .is("deleted_at", null)
    .order("fecha_inicio", { ascending: false });

  if (casosError) {
    console.error("Error en query de casos:", casosError);
    return (
      <div className='p-6 text-center text-red-500'>
        Error al cargar los casos clínicos.
      </div>
    );
  }

  let diagnosticosMap = new Map<string, DiagnosticoRow[]>();
  let presupuestosMap = new Map<string, PresupuestoRow[]>();
  let seguimientosMap = new Map<string, SeguimientoRow[]>();

  if (casosRaw && casosRaw.length > 0) {
    const casoIds = ((casosRaw as unknown[]) || []).map((c: unknown) => (c as Record<string, unknown>).id);
    const { data: diagnosticosData } = await supabase
      .from("diagnosticos")
      .select("id, nombre, caso_id")
      .in("caso_id", casoIds);
    if (diagnosticosData) {
      diagnosticosData.forEach((d) => {
        const casoId = d.caso_id as string;
        if (!diagnosticosMap.has(casoId)) {
          diagnosticosMap.set(casoId, []);
        }
        diagnosticosMap.get(casoId)!.push({ id: d.id as string, nombre: d.nombre as string });
      });
    }

    const { data: presupuestosData } = await supabase
      .from("presupuestos")
      .select("id, caso_id, costo_total, total_pagado, estado, moneda_id, monedas(codigo, simbolo)")
      .in("caso_id", casoIds)
      .is("deleted_at", null);

    const presupuestoIds = presupuestosData?.map((p: Record<string, unknown>) => p.id as string) || [];

    const { data: pagosData } = presupuestoIds.length > 0
      ? await supabase
          .from("pagos")
          .select("presupuesto_id, monto")
          .in("presupuesto_id", presupuestoIds)
          .is("deleted_at", null)
      : { data: null };

    const pagosPorPresupuesto = new Map<string, number>();
    (pagosData || []).forEach((pago) => {
      const presupuestoId = pago.presupuesto_id as string;
      if (!presupuestoId) return;
      const monto = (pago.monto as number) || 0;
      pagosPorPresupuesto.set(
        presupuestoId,
        (pagosPorPresupuesto.get(presupuestoId) || 0) + monto
      );
    });

    if (presupuestosData) {
      presupuestosData.forEach((p) => {
        const casoId = p.caso_id as string;
        const presupuestoId = p.id as string;
        if (!presupuestosMap.has(casoId)) {
          presupuestosMap.set(casoId, []);
        }
        presupuestosMap.get(casoId)!.push({
          id: presupuestoId,
          costo_total: (p.costo_total as number) || 0,
          total_pagado: pagosPorPresupuesto.get(presupuestoId) ?? (p.total_pagado as number) ?? 0,
          estado: p.estado as string,
          monedas: (p.monedas as unknown as { codigo: string; simbolo: string }),
        });
      });
    }

    const { data: seguimientosData } = await supabase
      .from("seguimientos")
      .select("id, caso_id, fecha, titulo")
      .in("caso_id", casoIds)
      .is("deleted_at", null);
    if (seguimientosData) {
      seguimientosData.forEach((s) => {
        const casoId = s.caso_id as string;
        if (!seguimientosMap.has(casoId)) {
          seguimientosMap.set(casoId, []);
        }
        seguimientosMap.get(casoId)!.push({ id: s.id as string, fecha: s.fecha as string, titulo: s.titulo as string });
      });
    }
  }

  const casos = casosRaw as unknown as CasoRow[];

  const casosConDetalles = casos.map((caso) => {
    const citas = (caso.citas as CitaRow[] | undefined); 
    const ultimaCita = citas && citas.length > 0
      ? citas.reduce(
          (maxDate: string | null, cita: CitaRow) => {
            if (!maxDate) return cita.fecha_inicio;
            return new Date(cita.fecha_inicio) > new Date(maxDate)
              ? cita.fecha_inicio
              : maxDate;
          },
          null
        )
      : null;

    const seguimientos = seguimientosMap.get(caso.id) || [];
    const ultimoSeguimiento = seguimientos.length > 0
      ? seguimientos.reduce((maxDate: SeguimientoRow | null, seg) => {
          if (!maxDate) return seg;
          return new Date(seg.fecha) > new Date(maxDate.fecha) ? seg : maxDate;
        }, null)
      : null;

    const diagnosticos = diagnosticosMap.get(caso.id) || [];
    const presupuestos = presupuestosMap.get(caso.id) || [];
    
    const presupuestosPorMoneda = new Map<string, { total: number; pagado: number; estado: string; moneda?: Record<string, unknown> }>();
    presupuestos.forEach((p) => {
      const monedaCodigo = p.monedas?.codigo || 'PEN';
      if (!presupuestosPorMoneda.has(monedaCodigo)) {
        presupuestosPorMoneda.set(monedaCodigo, {
          total: 0,
          pagado: 0,
          estado: p.estado,
          moneda: p.monedas,
        });
      }
      const current = presupuestosPorMoneda.get(monedaCodigo)!;
      current.total += p.costo_total || 0;
      current.pagado += p.total_pagado || 0;
    });

    let totalPresupuestoGlobal = 0;
    let totalPagadoGlobal = 0;

    presupuestosPorMoneda.forEach((datos, monedaCodigo) => {
      const totalEnPEN = convertToPEN(datos.total, monedaCodigo);
      const pagadoEnPEN = convertToPEN(datos.pagado, monedaCodigo);

      totalPresupuestoGlobal += totalEnPEN;
      totalPagadoGlobal += pagadoEnPEN;
    });
    
    const porcentajePago = totalPresupuestoGlobal > 0 ? Math.round((totalPagadoGlobal / totalPresupuestoGlobal) * 100) : 0;
    
    const monedaPrincipal = presupuestos[0]?.monedas;
    const presupuestosPrincipal = presupuestosPorMoneda.get(monedaPrincipal?.codigo || 'PEN') || {
      total: 0,
      pagado: 0,
      estado: 'Por Cobrar',
      moneda: monedaPrincipal,
    };
    
    const totalPresupuesto = presupuestosPrincipal.total;
    const totalPagado = presupuestosPrincipal.pagado;
    
    let estadoPago = presupuestosPrincipal.estado;
    if (presupuestos.length > 1) {
      const todosIguales = presupuestos.every(p => p.estado === presupuestos[0].estado);
      if (!todosIguales) {
        estadoPago = 'Mixto';
      }
    }

    const monedas = Array.from(presupuestosPorMoneda.entries()).map(([codigo, data]) => ({
      codigo: codigo,
      simbolo: data.moneda?.simbolo || (codigo === 'PEN' ? 'S/' : codigo === 'USD' ? '$' : codigo === 'CLP' ? 'CLP$' : codigo),
      total: data.total,
      pagado: data.pagado,
    }));

    const descripcion = (caso.descripcion as string) || 'Sin descripción';
    let profesional: PersonalRow | null = null;
    if (citas && citas.length > 0 && (citas[0] as unknown as Record<string, unknown>).personal) {
      profesional = (citas[0] as unknown as Record<string, unknown>).personal as PersonalRow;
    }
    
    return {
      id: caso.id as string,
      nombre_caso: caso.nombre_caso as string,
      diagnostico_preliminar: (caso.diagnostico_preliminar as string) || '',
      descripcion: descripcion,
      fecha_inicio: caso.fecha_inicio as string,
      fecha_cierre: caso.fecha_cierre as string,
      estado: (caso.estado || 'Abierto') as "Abierto" | "En progreso" | "Cerrado",
      ultima_cita: ultimaCita,
      profesional: profesional?.nombre_completo || 'No asignado',
      rol_profesional: profesional?.rol || '',
      ultimo_seguimiento: ultimoSeguimiento,
      total_presupuesto: totalPresupuesto,
      total_pagado: totalPagado,
      porcentaje_pago: porcentajePago,
      estado_pago: estadoPago,
      moneda: monedaPrincipal,
      monedas: monedas,
      diagnosticos_count: diagnosticos.length,
      presupuestos_count: presupuestos.length,
      seguimientos_count: seguimientos.length,
    };
  });

  return (
    <div className='w-full max-w-none'>
      <CasosList
        casos={casosConDetalles as CasosListProps["casos"]}
        historiaId={historiaId}
        numeroHistoria={paciente.numero_historia}
      />
    </div>
  );
}