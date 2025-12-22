import { NextResponse, type NextRequest } from 'next/server';
import { generateFichaPDF, generatePresupuestoPDF } from '@/lib/pdf-generator';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

function sanitizeFichaPayload(payload: any) {
  const clone = JSON.parse(JSON.stringify(payload || {}));
  // Si la imagen base64 es muy grande, la removemos para evitar timeouts/errores
  if (clone?.odontograma?.imagen_base64 && typeof clone.odontograma.imagen_base64 === 'string') {
    const len = clone.odontograma.imagen_base64.length;
    if (len > 150_000) {
      clone.odontograma.imagen_base64 = undefined;
      clone.odontograma.existe = clone.odontograma.existe ?? true;
    }
  }
  // Limitar seguimientos a 50 entradas para PDFs muy grandes
  if (Array.isArray(clone?.seguimientos) && clone.seguimientos.length > 50) {
    clone.seguimientos = clone.seguimientos.slice(0, 50);
  }
  return clone;
}

export async function POST(request: NextRequest) {
  console.log('[PDF] route hit at', new Date().toISOString(), 'url:', request.url);
  try {
    const payload = await request.json();
    const tipoReporte = payload?.tipo_reporte || 'ficha';

    let pdfBuffer: ArrayBuffer;
    let fileName = 'reporte.pdf';

    if (tipoReporte === 'presupuesto') {
      pdfBuffer = generatePresupuestoPDF(payload);
      const correlativo = payload.correlativo ? String(payload.correlativo).padStart(3, "0") : "XXX";
      const nombrePaciente = (payload.paciente_nombre || 'reporte').replace(/ /g, '_');
      fileName = `Presupuesto_${correlativo}_${nombrePaciente}.pdf`;
    } else {
      const sanitized = sanitizeFichaPayload(payload);
      pdfBuffer = generateFichaPDF(sanitized);
      const nombres = sanitized?.filiacion?.nombres || 'PACIENTE';
      const apellidos = sanitized?.filiacion?.apellidos || '';
      const patientName = `${nombres}_${apellidos}`.replace(/\s+/g, '_');
      fileName = `${patientName || 'ficha_odontologica'}.pdf`;
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[PDF] Handler error:', errorMessage);
    return new NextResponse(
      JSON.stringify({ error: 'Error generating PDF', details: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
