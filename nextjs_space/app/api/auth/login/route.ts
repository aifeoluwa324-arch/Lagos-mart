export const dynamic = 'force-dynamic'
import { signIn } from '@/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await signIn('credentials', {
      redirect: false,
      email: body.email,
      password: body.password,
    })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
