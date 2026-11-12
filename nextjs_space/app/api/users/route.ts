export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || (session.user as any)?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const hash = await bcrypt.hash(body.password, 10)
  const user = await prisma.user.create({ data: { name: body.name, email: body.email, password: hash, role: body.role || 'STOCK_OFFICER' } })
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role })
}
