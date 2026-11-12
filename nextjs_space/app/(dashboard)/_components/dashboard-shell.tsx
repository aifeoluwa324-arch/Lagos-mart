'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  Package, LayoutDashboard, ShoppingCart, ArrowUpDown,
  Truck, Receipt, FileText, Users, Settings, LogOut,
  PanelLeft, Bell, Search
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/products', icon: ShoppingCart },
  { label: 'Stock Management', href: '/stock', icon: ArrowUpDown },
  { label: 'Suppliers', href: '/suppliers', icon: Truck },
  { label: 'Sales', href: '/sales', icon: Receipt },
  { label: 'Stock Reports', href: '/reports', icon: FileText },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardShell({ children, user }: { children: React.ReactNode; user: any }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 p-6 border-b border-border">
            <Package className="h-7 w-7 text-primary" />
            <span className="text-lg font-display font-bold text-foreground">LAGOS MART</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems?.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith?.(item.href + '/')
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}>
                  <Icon className="h-4 w-4" />{item.label}
                </Link>
              )
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <button onClick={() => signOut({ redirectTo: '/login' })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-colors">
              <LogOut className="h-4 w-4" />Logout
            </button>
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card/80 backdrop-blur-md px-4 sm:px-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><PanelLeft className="h-5 w-5" /></button>
          <div className="hidden sm:flex items-center gap-2 flex-1">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Search anything..." />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-muted"><Bell className="h-5 w-5 text-muted-foreground" /></button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase?.() ?? 'U'}
              </div>
              <div className="hidden sm:block"><p className="text-sm font-medium">{user?.name ?? 'User'}</p></div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
