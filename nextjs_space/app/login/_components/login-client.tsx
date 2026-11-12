'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Package, Mail, Lock } from 'lucide-react'

export function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.replace('/dashboard')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-blue-900" />
        <div className="relative z-10 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Package className="h-12 w-12 text-primary-foreground" />
            <h1 className="text-3xl font-display font-bold text-primary-foreground tracking-tight">LAGOS MART</h1>
          </div>
          <h2 className="text-xl font-semibold text-primary-foreground/90 mb-4">Stock Management System</h2>
          <p className="text-primary-foreground/70 mb-8">Track and manage inventory, sales, and transactions for Lagos Mart Supermarket, Ikeja, Lagos.</p>
          <div className="relative w-full aspect-square max-w-sm mx-auto">
            <Image
              src="https://cdn.abacus.ai/images/dc40eef3-ffba-4dd0-8f21-5282d3d1afdd.png"
              alt="Warehouse and inventory management illustration showing boxes, forklifts, and tracking systems"
              fill
              className="object-contain rounded-lg"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-display font-bold text-foreground">LAGOS MART</span>
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground tracking-tight mb-2">Welcome Back</h2>
          <p className="text-muted-foreground mb-8">Please login to your account</p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-input" />
                Remember me
              </label>
              <button type="button" className="text-sm text-primary hover:underline">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#e8862a] hover:bg-[#d07825] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">Don&apos;t have an account? <a href="/signup" className="text-primary hover:underline font-medium">Sign up</a></p>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><span className="font-medium">Admin:</span> admin@lagosmart.com / Admin123</p>
              <p><span className="font-medium">Manager:</span> manager@lagosmart.com / Manager123</p>
              <p><span className="font-medium">Officer:</span> officer@lagosmart.com / Officer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
