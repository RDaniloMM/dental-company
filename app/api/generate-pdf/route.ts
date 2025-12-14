import { NextResponse } from 'next/server';
import { generateFichaPDF, generatePresupuestoPDF } from '@/lib/pdf-generator';

// Ensure this route is always dynamic and compatible in production
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const tipoReporte = payload.tipo_reporte || 'ficha';
    
    console.log(`[PDF] Generating ${tipoReporte} report`, { numero_historia: payload.numero_historia });
    
    let pdfBuffer: ArrayBuffer;
    let fileName: string;
    
    try {
      if (tipoReporte === 'presupuesto') {
        pdfBuffer = generatePresupuestoPDF(payload);
        const correlativo = payload.correlativo ? String(payload.correlativo).padStart(3, "0") : "XXX";
        const nombrePaciente = (payload.paciente_nombre || 'reporte').replace(/ /g, '_');
        fileName = `Presupuesto_${correlativo}_${nombrePaciente}.pdf`;
      } else {
        pdfBuffer = generateFichaPDF(payload);
        const patientName = `${payload.filiacion?.nombres}_${payload.filiacion?.apellidos}`.replace(/ /g, '_') || 'ficha_odontologica';
        fileName = `${patientName}.pdf`;
      }
    } catch (genError) {
      console.error(`[PDF] Error generating ${tipoReporte} PDF:`, genError);
      const details = genError instanceof Error ? genError.message : 'Error desconocido en generación';
      throw new Error(`Error en generación de ${tipoReporte}: ${details}`);
    }

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[PDF] Error in POST:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('[PDF] Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return new NextResponse(JSON.stringify({ error: 'Error generating PDF', details: errorMessage }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
