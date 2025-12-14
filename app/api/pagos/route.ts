import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const casoId = request.nextUrl.searchParams.get("caso_id")

    if (!casoId) {
      return NextResponse.json({ error: "caso_id is required" }, { status: 400 })
    }

    // Obtener pagos del caso (a través de presupuestos)
    const { data, error } = await supabase
      .from("pagos")
      .select("id, monto, moneda_id, monedas(codigo), presupuestos(caso_id)")
      .eq("presupuestos.caso_id", casoId)
      .is("deleted_at", null)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching pagos" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { error } = await supabase
      .from('pagos')
      .update({ 
        deleted_at: new Date().toISOString(),
        deleted_by: user.id 
      })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Pago eliminado exitosamente' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar pago' },
      { status: 500 }
    )
  }
}