'use client'

import { useState, useEffect } from 'react'
import { Plus, Receipt, X, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function SalesClient() {
  const [sales, setSales] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [items, setItems] = useState<{productId:string,quantity:number}[]>([{productId:'',quantity:1}])

  const load = () => { setLoading(true); Promise.all([fetch('/api/sales').then(r=>r.json()), fetch('/api/products').then(r=>r.json())]).then(([s,p])=>{setSales(s??[]);setProducts(p??[])}).catch(()=>{}).finally(()=>setLoading(false)) }
  useEffect(load, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validItems = items.filter(i=>i.productId && i.quantity > 0)
    if (validItems.length === 0) { toast.error('Add at least one item'); return }
    const res = await fetch('/api/sales', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerName, items: validItems }) })
    if (res.ok) { toast.success('Sale recorded'); setShowForm(false); setItems([{productId:'',quantity:1}]); setCustomerName(''); load() }
    else { const d = await res.json(); toast.error(d?.error || 'Failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-display font-bold tracking-tight">Sales</h1><p className="text-muted-foreground">Record and view sales transactions</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm"><Plus className="h-4 w-4" />New Sale</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl shadow-lg border border-border p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-display font-semibold text-lg">Record Sale</h3><button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-sm font-medium">Customer Name (optional)</label><input value={customerName} onChange={e=>setCustomerName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" /></div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Items</label>
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <select value={item.productId} onChange={e=>{const n=[...items];n[idx]={...n[idx],productId:e.target.value};setItems(n)}} className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" required>
                      <option value="">Select product</option>
                      {(products??[]).map((p:any)=><option key={p?.id} value={p?.id}>{p?.name} (₦{(p?.price??0)?.toLocaleString?.('en-NG')}) - Qty: {p?.quantity??0}</option>)}
                    </select>
                    <input type="number" min="1" value={item.quantity} onChange={e=>{const n=[...items];n[idx]={...n[idx],quantity:parseInt(e.target.value)||1};setItems(n)}} className="w-20 px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                    {items.length > 1 && <button type="button" onClick={()=>setItems(items.filter((_,i)=>i!==idx))} className="p-2 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4" /></button>}
                  </div>
                ))}
                <button type="button" onClick={()=>setItems([...items,{productId:'',quantity:1}])} className="text-sm text-primary hover:underline">+ Add item</button>
              </div>
              <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium">Record Sale</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-muted/50 border-b border-border">
          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Sale ID</th>
          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Items</th>
          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Total</th>
          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Date</th>
        </tr></thead><tbody>
          {loading ? <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</td></tr> :
          (sales??[]).length===0 ? <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No sales yet</td></tr> :
          (sales??[]).map((s:any) => (
            <tr key={s?.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="px-4 py-3 font-mono text-xs">{s?.id?.slice?.(0,8) ?? ''}</td>
              <td className="px-4 py-3">{s?.customerName || 'Walk-in'}</td>
              <td className="px-4 py-3 text-muted-foreground">{(s?.items??[]).map((i:any)=>`${i?.product?.name??''} x${i?.quantity??0}`).join(', ')}</td>
              <td className="px-4 py-3 text-right font-mono">₦{(s?.total??0)?.toLocaleString?.('en-NG')}</td>
              <td className="px-4 py-3 text-right text-xs text-muted-foreground">{s?.createdAt ? new Date(s.createdAt).toLocaleDateString('en-NG') : ''}</td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
    </div>
  )
}
