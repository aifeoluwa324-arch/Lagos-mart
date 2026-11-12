'use client'

import { useState, useEffect } from 'react'
import { Package, TrendingUp, AlertTriangle, ShoppingCart } from 'lucide-react'
import dynamic from 'next/dynamic'

const SalesChart = dynamic(() => import('./sales-chart'), { ssr: false, loading: () => <div className="h-64 bg-muted animate-pulse rounded-lg" /> })

export function DashboardClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(d => setData(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Total Products', value: data?.totalProducts ?? 0, icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Available Stock', value: data?.availableStock ?? 0, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Low Stock Items', value: data?.lowStockItems ?? 0, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: "Today's Sales", value: `₦${(data?.todaySales ?? 0)?.toLocaleString?.('en-NG')}`, icon: ShoppingCart, color: 'text-destructive', bg: 'bg-destructive/10' },
  ]

  if (loading) return <div className="space-y-4"><div className="h-8 w-48 bg-muted animate-pulse rounded" /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i=><div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />)}</div></div>

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-display font-bold tracking-tight">Dashboard</h1><p className="text-muted-foreground">Track and manage inventory, sales, and transactions</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => {
          const Icon = c.icon
          return (<div key={c.label} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`inline-flex p-2 rounded-lg ${c.bg} mb-3`}><Icon className={`h-5 w-5 ${c.color}`} /></div>
            <p className="text-2xl font-bold font-mono">{typeof c.value === 'number' ? c.value?.toLocaleString?.('en-NG') : c.value}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>)
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Recent Stock Activities</h3>
            <a href="/stock" className="text-sm text-primary hover:underline">View All</a>
          </div>
          <table className="w-full text-sm"><thead><tr className="border-b border-border">
            <th className="text-left py-2 text-muted-foreground font-medium">Product</th>
            <th className="text-center py-2 text-muted-foreground font-medium">Qty</th>
            <th className="text-right py-2 text-muted-foreground font-medium">Status</th>
          </tr></thead><tbody>
            {(data?.recentActivities ?? []).map((a: any, i: number) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="py-2.5">{a?.name ?? ''}</td>
                <td className="py-2.5 text-center font-mono">{a?.quantity ?? 0}</td>
                <td className="py-2.5 text-right"><span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  a?.status === 'Available' ? 'bg-green-100 text-green-700' : a?.status === 'Low stock' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                }`}>{a?.status ?? ''}</span></td>
              </tr>
            ))}
          </tbody></table>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-display font-semibold mb-4">Sales Overview</h3>
          <SalesChart data={data?.stockMovements ?? []} />
        </div>
      </div>
    </div>
  )
}
