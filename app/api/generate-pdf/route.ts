import { NextResponse } from 'next/server';
import { generateFichaPDF, generatePresupuestoPDF } from '@/lib/pdf-generator';

// Configuración para Vercel - sin maxDuration que causa problemas
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
  console.log('=================== PDF GENERATION START ===================');
  console.log('[PDF] POST request received at:', new Date().toISOString());
  console.log('[PDF] Request URL:', request.url);
  console.log('[PDF] Request method:', request.method);
  console.log('[PDF] Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    console.log('[PDF] Attempting to parse JSON payload...');
    const payload = await request.json();
    console.log('[PDF] Payload parsed successfully');
    console.log('[PDF] Payload keys:', Object.keys(payload));
    console.log('[PDF] Payload details:', { 
      tipo: payload.tipo_reporte, 
      numero_historia: payload.numero_historia,
      hasFiliacion: !!payload.filiacion,
      hasOdontograma: !!payload.odontograma,
      hasSeguimientos: !!payload.seguimientos
    });
    
    const tipoReporte = payload.tipo_reporte || 'ficha';
    console.log(`[PDF] Report type determined: ${tipoReporte}`);
    console.log(`[PDF] Starting ${tipoReporte} report generation for HC: ${payload.numero_historia}`);
    
    let pdfBuffer: ArrayBuffer;
    let fileName: string;
    
    try {
      if (tipoReporte === 'presupuesto') {
        console.log('[PDF] Route: Generating PRESUPUESTO PDF');
        console.log('[PDF] Presupuesto payload:', {
          correlativo: payload.correlativo,
          paciente_nombre: payload.paciente_nombre,
          itemsCount: payload.items?.length || 0
        });
        pdfBuffer = generatePresupuestoPDF(payload);
        const correlativo = payload.correlativo ? String(payload.correlativo).padStart(3, "0") : "XXX";
        const nombrePaciente = (payload.paciente_nombre || 'reporte').replace(/ /g, '_');
        fileName = `Presupuesto_${correlativo}_${nombrePaciente}.pdf`;
      } else {
        console.log('[PDF] Route: Generating FICHA PDF');
        console.log('[PDF] Ficha payload structure:', {
          hasFiliacion: !!payload.filiacion,
          filiacionKeys: payload.filiacion ? Object.keys(payload.filiacion) : [],
          hasAntecedentes: !!payload.antecedentes,
          antecedentesKeys: payload.antecedentes ? Object.keys(payload.antecedentes) : [],
          hasOdontograma: !!payload.odontograma,
          odontogramaExists: payload.odontograma?.existe,
          hasSeguimientos: !!payload.seguimientos,
          seguimientosCount: Array.isArray(payload.seguimientos) ? payload.seguimientos.length : 0
        });
        console.log('[PDF] Calling generateFichaPDF...');
        pdfBuffer = generateFichaPDF(payload);
        console.log('[PDF] generateFichaPDF completed, buffer size:', pdfBuffer.byteLength);
        const patientName = `${payload.filiacion?.nombres}_${payload.filiacion?.apellidos}`.replace(/ /g, '_') || 'ficha_odontologica';
        fileName = `${patientName}.pdf`;
        console.log('[PDF] File name set to:', fileName);
      }
      console.log('[PDF] PDF generation completed successfully');
      console.log('[PDF] Buffer size:', pdfBuffer.byteLength, 'bytes');
    } catch (genError) {
      console.error(`[PDF] Error generating ${tipoReporte} PDF:`, genError);
      const details = genError instanceof Error ? genError.message : 'Error desconocido en generación';
      throw new Error(`Error en generación de ${tipoReporte}: ${details}`);
    }

    console.log('[PDF] Preparing response...');
    console.log('[PDF] Response headers:', {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.byteLength
    });
    
    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Access-Control-Allow-Origin': '*',
      },
    });
    
    console.log('[PDF] Response created successfully');
    console.log('=================== PDF GENERATION END (SUCCESS) ===================');
    return response;
  } catch (error) {
    console.error('=================== PDF GENERATION ERROR ===================');
    console.error('[PDF] Error in POST handler:', error);
    console.error('[PDF] Error type:', error?.constructor?.name);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('[PDF] Error message:', errorMessage);
    console.error('[PDF] Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    console.error('=================== PDF GENERATION END (ERROR) ===================');
    
    return new NextResponse(JSON.stringify({ 
      error: 'Error generating PDF', 
      details: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
    });
  }
}
