export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: 'desc' }, include: { _count: { select: { products: true } } } })
  return NextResponse.json(suppliers)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const supplier = await prisma.supplier.create({ data: { name: body.name, email: body.email || null, phone: body.phone || null, address: body.address || null } })
  return NextResponse.json(supplier)
}
