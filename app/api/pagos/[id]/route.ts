import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

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
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Pago eliminado exitosamente' })
  } catch (error) {
    console.error('Error in DELETE /api/pagos/[id]:', error)
    return NextResponse.json(
      { error: 'Error al eliminar pago' },
      { status: 500 }
    )
  }
}
