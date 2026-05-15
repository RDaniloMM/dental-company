import { NextResponse } from "next/server";

// Deprecated: invitation consumption is now performed atomically by /api/auth/sign-up.
export async function POST() {
  return NextResponse.json(
    { success: false, error: "Endpoint reemplazado por /api/auth/sign-up" },
    { status: 410 }
  );
}
