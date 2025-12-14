import { NextResponse } from 'next/server';
import { generateFichaPDF, generatePresupuestoPDF } from '@/lib/pdf-generator';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const tipoReporte = payload.tipo_reporte || 'ficha';
    
    let pdfBuffer: ArrayBuffer;
    let fileName: string;
    
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

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: 'Error generating PDF', details: errorMessage }), { status: 500 });
  }
}
