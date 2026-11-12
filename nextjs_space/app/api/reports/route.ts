export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [products, sales, movements] = await Promise.all([
    prisma.product.findMany({ include: { category: true }, orderBy: { quantity: 'asc' } }),
    prisma.sale.findMany({ include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.stockMovement.findMany({ include: { product: true }, orderBy: { createdAt: 'desc' }, take: 50 }),
  ])

  const lowStock = (products ?? []).filter((p: any) => (p?.quantity ?? 0) <= (p?.minStock ?? 10) && (p?.quantity ?? 0) > 0)
  const outOfStock = (products ?? []).filter((p: any) => (p?.quantity ?? 0) === 0)
  const totalSalesValue = (sales ?? []).reduce((sum: number, s: any) => sum + (s?.total ?? 0), 0)

  return NextResponse.json({ products, lowStock, outOfStock, sales, movements, totalSalesValue })
}
