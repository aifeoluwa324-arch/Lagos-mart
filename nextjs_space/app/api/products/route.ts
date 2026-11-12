export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const products = await prisma.product.findMany({
    where: search ? { name: { contains: search, mode: 'insensitive' } } : {},
    include: { category: true, supplier: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const product = await prisma.product.create({
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
