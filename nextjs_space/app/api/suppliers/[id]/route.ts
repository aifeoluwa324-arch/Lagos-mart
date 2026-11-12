export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const supplier = await prisma.supplier.update({ where: { id }, data: { name: body.name, email: body.email || null, phone: body.phone || null, address: body.address || null } })
  return NextResponse.json(supplier)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.supplier.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
