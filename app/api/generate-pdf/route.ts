import { NextResponse } from 'next/server';
import { generateFichaPDF, generatePresupuestoPDF } from '@/lib/pdf-generator';

// Configuración para Vercel
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // Máximo tiempo de ejecución en segundos

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

export async function GET() {
  return new NextResponse(JSON.stringify({ error: 'Método GET no permitido. Use POST.' }), {
    status: 405,
    headers: { 'Allow': 'POST, OPTIONS' },
  });
}

export async function DELETE() {
  return new NextResponse(JSON.stringify({ error: 'Método DELETE no permitido. Use POST.' }), {
    status: 405,
    headers: { 'Allow': 'POST, OPTIONS' },
  });
}

export async function POST(request: Request) {
  try {
    console.log('[PDF] POST request received');
    const payload = await request.json();
    console.log('[PDF] Payload received:', { tipo: payload.tipo_reporte, numero_historia: payload.numero_historia });
    
    const tipoReporte = payload.tipo_reporte || 'ficha';
    
    console.log(`[PDF] Generating ${tipoReporte} report`, { numero_historia: payload.numero_historia });
    
    let pdfBuffer: ArrayBuffer;
    let fileName: string;
    
    try {
      if (tipoReporte === 'presupuesto') {
        console.log('[PDF] Generating presupuesto PDF');
        pdfBuffer = generatePresupuestoPDF(payload);
        const correlativo = payload.correlativo ? String(payload.correlativo).padStart(3, "0") : "XXX";
        const nombrePaciente = (payload.paciente_nombre || 'reporte').replace(/ /g, '_');
        fileName = `Presupuesto_${correlativo}_${nombrePaciente}.pdf`;
      } else {
        console.log('[PDF] Generating ficha PDF');
        pdfBuffer = generateFichaPDF(payload);
        const patientName = `${payload.filiacion?.nombres}_${payload.filiacion?.apellidos}`.replace(/ /g, '_') || 'ficha_odontologica';
        fileName = `${patientName}.pdf`;
      }
      console.log('[PDF] PDF generated successfully');
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
