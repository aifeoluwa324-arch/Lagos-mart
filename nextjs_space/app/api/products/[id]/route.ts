export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      sku: body.sku,
      description: body.description || null,
      price: parseFloat(body.price) || 0,
      quantity: parseInt(body.quantity) || 0,
      minStock: parseInt(body.minStock) || 10,
      categoryId: body.categoryId || null,
      supplierId: body.supplierId || null,
    },
  })
  return NextResponse.json(product)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
