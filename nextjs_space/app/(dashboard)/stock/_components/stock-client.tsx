'use client'

import { useState, useEffect } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Plus, X } from 'lucide-react'
import { toast } from 'sonner'

export function StockClient() {
  const [movements, setMovements] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ productId: '', type: 'STOCK_IN', quantity: '', note: '' })

  const load = () => {
    setLoading(true)
    Promise.all([fetch('/api/stock').then(r=>r.json()), fetch('/api/products').then(r=>r.json())])
      .then(([m, p]) => { setMovements(m ?? []); setProducts(p ?? []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/stock', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success(`Stock ${form.type === 'STOCK_IN' ? 'added' : 'removed'} successfully`); setShowForm(false); setForm({ productId: '', type: 'STOCK_IN', quantity: '', note: '' }); load() }
    else { const d = await res.json(); toast.error(d?.error || 'Failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-display font-bold tracking-tight">Stock Management</h1><p className="text-muted-foreground">Record stock in and stock out movements</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm">
          <Plus className="h-4 w-4" />New Movement
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl shadow-lg border border-border p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg">Record Stock Movement</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-sm font-medium">Product</label><select value={form.productId} onChange={e=>setForm({...form,productId:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" required>
                <option value="">Select product</option>
                {(products??[]).map((p:any)=><option key={p?.id} value={p?.id}>{p?.name} (Stock: {p?.quantity??0})</option>)}
              </select></div>
              <div><label className="text-sm font-medium">Type</label>
                <div className="flex gap-2 mt-1">
                  <button type="button" onClick={()=>setForm({...form,type:'STOCK_IN'})} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${form.type==='STOCK_IN'?'bg-green-600 text-white border-green-600':'border-input'}`}>Stock In</button>
                  <button type="button" onClick={()=>setForm({...form,type:'STOCK_OUT'})} className={`flex-1 py-2 rounded-lg text-sm font-medium border ${form.type==='STOCK_OUT'?'bg-red-600 text-white border-red-600':'border-input'}`}>Stock Out</button>
                </div>
              </div>
              <div><label className="text-sm font-medium">Quantity</label><input type="number" min="1" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" required /></div>
              <div><label className="text-sm font-medium">Note</label><input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="Optional note" /></div>
              <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">Record Movement</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-muted/50 border-b border-border">
          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
          <th className="text-center px-4 py-3 font-medium text-muted-foreground">Type</th>
          <th className="text-center px-4 py-3 font-medium text-muted-foreground">Qty</th>
          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Note</th>
          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Date</th>
        </tr></thead><tbody>
          {loading ? <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</td></tr> :
          (movements??[]).length===0 ? <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No movements yet</td></tr> :
          (movements??[]).map((m:any) => (
            <tr key={m?.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{m?.product?.name ?? ''}</td>
              <td className="px-4 py-3 text-center"><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${m?.type==='STOCK_IN'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>
                {m?.type==='STOCK_IN'?<ArrowUp className="h-3 w-3"/>:<ArrowDown className="h-3 w-3"/>}{m?.type==='STOCK_IN'?'In':'Out'}
              </span></td>
              <td className="px-4 py-3 text-center font-mono">{m?.quantity??0}</td>
              <td className="px-4 py-3 text-muted-foreground">{m?.note || '-'}</td>
              <td className="px-4 py-3 text-right text-muted-foreground text-xs">{m?.createdAt ? new Date(m.createdAt).toLocaleDateString('en-NG') : ''}</td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
    </div>
  )
}
