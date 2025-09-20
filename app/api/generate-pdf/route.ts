import { NextResponse } from 'next/server';
import { generateFichaPDF } from '@/lib/pdf-generator';
import { FormData } from "@/lib/supabase/ficha";

export async function POST(request: Request) {
  try {
    const formData = (await request.json()) as FormData;
    
    const pdfBuffer = generateFichaPDF(formData); 
    const patientName = `${formData.filiacion.nombres}_${formData.filiacion.apellidos}`.replace(/ /g, '_') || 'ficha_odontologica';

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${patientName}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(JSON.stringify({ error: 'Error generating PDF', details: errorMessage }), { status: 500 });
  }
}
