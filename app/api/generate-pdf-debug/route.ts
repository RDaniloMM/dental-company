import { NextResponse, type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const text = await request.text();
    const len = text.length;
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch {}
    const keys = parsed && typeof parsed === 'object' ? Object.keys(parsed) : [];
    return NextResponse.json({ ok: true, size: len, keys, preview: text.slice(0, 200) });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'unknown' }, { status: 500 });
  }
}
