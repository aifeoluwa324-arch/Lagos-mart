export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sales = await prisma.sale.findMany({
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json(sales)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const items = body.items ?? []
  if (items.length === 0) return NextResponse.json({ error: 'No items' }, { status: 400 })

  let total = 0
  const ops: any[] = []
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } })
    if (!product) return NextResponse.json({ error: `Product not found` }, { status: 404 })
    if (product.quantity < (item.quantity ?? 0)) return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })
    total += product.price * (item.quantity ?? 0)
    ops.push({ productId: item.productId, quantity: item.quantity, price: product.price })
  }

  const sale = await prisma.sale.create({
    data: {
      total,
      customerName: body.customerName || null,
      items: { create: ops },
    },
    include: { items: true },
  })

  // Decrease stock
  for (const item of ops) {
    await prisma.product.update({ where: { id: item.productId }, data: { quantity: { decrement: item.quantity } } })
  }

  return NextResponse.json(sale)
}
