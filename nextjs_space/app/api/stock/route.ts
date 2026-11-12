export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const movements = await prisma.stockMovement.findMany({
    include: { product: { select: { name: true, sku: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return NextResponse.json(movements)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const qty = parseInt(body.quantity) || 0
  if (qty <= 0) return NextResponse.json({ error: 'Quantity must be positive' }, { status: 400 })

  const product = await prisma.product.findUnique({ where: { id: body.productId } })
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  if (body.type === 'STOCK_OUT' && product.quantity < qty) {
    return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
  }

  const [movement] = await prisma.$transaction([
    prisma.stockMovement.create({ data: { productId: body.productId, type: body.type, quantity: qty, note: body.note || null } }),
    prisma.product.update({
      where: { id: body.productId },
      data: { quantity: { [body.type === 'STOCK_IN' ? 'increment' : 'decrement']: qty } },
    }),
  ])
  return NextResponse.json(movement)
}
