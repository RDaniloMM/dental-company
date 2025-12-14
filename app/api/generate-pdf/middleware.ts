import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Permitir OPTIONS y POST para esta ruta
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Allow': 'POST, OPTIONS',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Continuar con POST
  return NextResponse.next();
}

export const config = {
  matcher: '/api/generate-pdf',
};
