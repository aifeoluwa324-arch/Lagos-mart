export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hash, name: name || email.split('@')[0], role: role || 'STOCK_OFFICER' },
    })
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
  } catch (error: any) {
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}
