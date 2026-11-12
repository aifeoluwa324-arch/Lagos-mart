'use client'

import { Settings, User, Bell, Shield } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function SettingsPage() {
  const { data: session } = useSession()
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-display font-bold tracking-tight">Settings</h1><p className="text-muted-foreground">Manage your account and system preferences</p></div>

      <div className="grid gap-6 max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4"><User className="h-5 w-5 text-primary" /><h3 className="font-display font-semibold">Profile</h3></div>
          <div className="space-y-3">
            <div><label className="text-sm text-muted-foreground">Name</label><p className="font-medium">{session?.user?.name ?? 'N/A'}</p></div>
            <div><label className="text-sm text-muted-foreground">Email</label><p className="font-medium">{session?.user?.email ?? 'N/A'}</p></div>
            <div><label className="text-sm text-muted-foreground">Role</label><p className="font-medium">{(session?.user as any)?.role ?? 'N/A'}</p></div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4"><Shield className="h-5 w-5 text-primary" /><h3 className="font-display font-semibold">System Info</h3></div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Lagos Mart Stock Management System v1.0</p>
            <p>Case Study: Lagos Mart Supermarket, Ikeja, Lagos</p>
            <p>Designed for academic final-year project submission</p>
          </div>
        </div>
      </div>
    </div>
  )
}
