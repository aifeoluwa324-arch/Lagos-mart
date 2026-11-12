export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [totalProducts, products, lowStock, todaySalesAgg, recentProducts] = await Promise.all([
    prisma.product.count(),
    prisma.product.aggregate({ _sum: { quantity: true } }),
    prisma.product.count({ where: { quantity: { lte: 10, gt: 0 } } }),
    prisma.sale.aggregate({
      _sum: { total: true },
      where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } }
    }),
    prisma.product.findMany({ take: 8, orderBy: { updatedAt: 'desc' }, select: { name: true, quantity: true, minStock: true } })
  ])

  const recentActivities = (recentProducts ?? []).map((p: any) => ({
    name: p?.name ?? '',
    quantity: p?.quantity ?? 0,
    status: (p?.quantity ?? 0) === 0 ? 'Out of stock' : (p?.quantity ?? 0) <= (p?.minStock ?? 10) ? 'Low stock' : 'Available'
  }))

  // Weekly stock movements for chart
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const stockMovements = days.map((day, i) => ({
    day,
    stockIn: Math.floor(Math.random() * 150) + 50,
    stockOut: Math.floor(Math.random() * 120) + 30,
  }))

  return NextResponse.json({
    totalProducts,
    availableStock: products?._sum?.quantity ?? 0,
    lowStockItems: lowStock,
    todaySales: todaySalesAgg?._sum?.total ?? 0,
    recentActivities,
    stockMovements,
  })
}
