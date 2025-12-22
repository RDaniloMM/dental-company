import { NextResponse, type NextRequest } from 'next/server';
import { generateFichaPDF, generatePresupuestoPDF } from '@/lib/pdf-generator';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function sanitizeFichaPayload(payload: any) {
  const clone = JSON.parse(JSON.stringify(payload || {}));
  // Limitar longitud de imagen base64 si es muy grande
  if (clone?.odontograma?.imagen_base64 && typeof clone.odontograma.imagen_base64 === 'string') {
    const len = clone.odontograma.imagen_base64.length;
    if (len > 150_000) {
      clone.odontograma.imagen_base64 = undefined;
      clone.odontograma.existe = clone.odontograma.existe ?? true;
    }
  }
  // Limitar seguimientos a 50 entradas
  if (Array.isArray(clone?.seguimientos) && clone.seguimientos.length > 50) {
    clone.seguimientos = clone.seguimientos.slice(0, 50);
  }
  return clone;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const tipoReporte = payload?.tipo_reporte || 'ficha';

    if (tipoReporte === 'presupuesto') {
      const buf = generatePresupuestoPDF(payload);
      return new NextResponse(buf, { status: 200, headers: { 'Content-Type': 'application/pdf' } });
    }

    const sanitized = sanitizeFichaPayload(payload);
    const buf = generateFichaPDF(sanitized);
    const nombre = `${sanitized?.filiacion?.nombres || 'PACIENTE'}_${sanitized?.filiacion?.apellidos || ''}`.replace(/\s+/g, '_');
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Ficha_${nombre}.pdf"`
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'pdf2-failed', details: e?.message || 'unknown' }, { status: 500 });
  }
}
