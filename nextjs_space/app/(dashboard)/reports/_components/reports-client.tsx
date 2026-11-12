'use client'

import { useState, useEffect } from 'react'
import { FileText, AlertTriangle, XCircle, TrendingUp, Printer } from 'lucide-react'

export function ReportsClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('low')

  useEffect(() => { fetch('/api/reports').then(r=>r.json()).then(d=>setData(d)).catch(()=>{}).finally(()=>setLoading(false)) }, [])

  if (loading) return <div className="h-64 bg-muted animate-pulse rounded-xl" />

  const tabs = [
    { id: 'low', label: 'Low Stock', icon: AlertTriangle, count: data?.lowStock?.length ?? 0 },
    { id: 'out', label: 'Out of Stock', icon: XCircle, count: data?.outOfStock?.length ?? 0 },
    { id: 'movements', label: 'Stock Movements', icon: TrendingUp, count: data?.movements?.length ?? 0 },
    { id: 'sales', label: 'Sales Report', icon: FileText, count: data?.sales?.length ?? 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-display font-bold tracking-tight">Stock Reports</h1><p className="text-muted-foreground">View summary reports and analytics</p></div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm"><Printer className="h-4 w-4" />Print Report</button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => {
          const Icon = t.icon
          return <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab===t.id?'bg-primary text-primary-foreground':'bg-card border border-border text-muted-foreground hover:bg-muted'}`}>
            <Icon className="h-4 w-4" />{t.label} ({t.count})
          </button>
        })}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-muted/50 border-b border-border">
          {tab === 'low' || tab === 'out' ? <><th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">SKU</th><th className="text-center px-4 py-3 font-medium text-muted-foreground">Current Stock</th><th className="text-center px-4 py-3 font-medium text-muted-foreground">Min Stock</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Price</th></> :
          tab === 'movements' ? <><th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th><th className="text-center px-4 py-3 font-medium text-muted-foreground">Type</th><th className="text-center px-4 py-3 font-medium text-muted-foreground">Qty</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Date</th></> :
          <><th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Items</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Date</th></>}
        </tr></thead><tbody>
          {tab === 'low' && (data?.lowStock??[]).map((p:any) => (
            <tr key={p?.id} className="border-b border-border/50"><td className="px-4 py-3">{p?.name}</td><td className="px-4 py-3 font-mono text-muted-foreground">{p?.sku}</td><td className="px-4 py-3 text-center font-mono text-orange-600">{p?.quantity}</td><td className="px-4 py-3 text-center font-mono">{p?.minStock}</td><td className="px-4 py-3 text-right font-mono">₦{(p?.price??0)?.toLocaleString?.('en-NG')}</td></tr>
          ))}
          {tab === 'out' && (data?.outOfStock??[]).map((p:any) => (
            <tr key={p?.id} className="border-b border-border/50"><td className="px-4 py-3">{p?.name}</td><td className="px-4 py-3 font-mono text-muted-foreground">{p?.sku}</td><td className="px-4 py-3 text-center font-mono text-red-600">0</td><td className="px-4 py-3 text-center font-mono">{p?.minStock}</td><td className="px-4 py-3 text-right font-mono">₦{(p?.price??0)?.toLocaleString?.('en-NG')}</td></tr>
          ))}
          {tab === 'movements' && (data?.movements??[]).map((m:any) => (
            <tr key={m?.id} className="border-b border-border/50"><td className="px-4 py-3">{m?.product?.name??''}</td><td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${m?.type==='STOCK_IN'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{m?.type==='STOCK_IN'?'In':'Out'}</span></td><td className="px-4 py-3 text-center font-mono">{m?.quantity}</td><td className="px-4 py-3 text-right text-xs text-muted-foreground">{m?.createdAt ? new Date(m.createdAt).toLocaleDateString('en-NG') : ''}</td></tr>
          ))}
          {tab === 'sales' && (data?.sales??[]).map((s:any) => (
            <tr key={s?.id} className="border-b border-border/50"><td className="px-4 py-3">{s?.customerName||'Walk-in'}</td><td className="px-4 py-3 text-muted-foreground">{(s?.items??[]).map((i:any)=>i?.product?.name).filter(Boolean).join(', ')}</td><td className="px-4 py-3 text-right font-mono">₦{(s?.total??0)?.toLocaleString?.('en-NG')}</td><td className="px-4 py-3 text-right text-xs text-muted-foreground">{s?.createdAt ? new Date(s.createdAt).toLocaleDateString('en-NG') : ''}</td></tr>
          ))}
        </tbody></table></div>
        {tab === 'sales' && <div className="px-4 py-3 border-t border-border bg-muted/30 text-right"><span className="text-sm font-medium">Total Sales: </span><span className="font-mono font-bold">₦{(data?.totalSalesValue??0)?.toLocaleString?.('en-NG')}</span></div>}
      </div>
    </div>
  )
}
