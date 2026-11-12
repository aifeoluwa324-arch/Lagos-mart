'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Package, Mail, Lock, User } from 'lucide-react'

export function SignupClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Signup failed')
        return
      }
      const result = await signIn('credentials', { redirect: false, email, password })
      if (result?.error) {
        router.push('/login')
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Package className="h-8 w-8 text-primary" />
          <span className="text-xl font-display font-bold">LAGOS MART</span>
        </div>
        <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
          <h2 className="text-2xl font-display font-bold tracking-tight mb-2">Create Account</h2>
          <p className="text-muted-foreground mb-6">Sign up for Lagos Mart Stock Management</p>
          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Your name" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Create a password" required minLength={6} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">Already have an account? <a href="/login" className="text-primary hover:underline font-medium">Login</a></p>
        </div>
      </div>
    </div>
  )
}
