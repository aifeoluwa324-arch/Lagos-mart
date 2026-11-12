'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Truck, X } from 'lucide-react'
import { toast } from 'sonner'

export function SuppliersClient() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })

  const load = () => { setLoading(true); fetch('/api/suppliers').then(r=>r.json()).then(d=>setSuppliers(d??[])).catch(()=>{}).finally(()=>setLoading(false)) }
  useEffect(load, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing ? `/api/suppliers/${editing.id}` : '/api/suppliers'
    const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success(editing ? 'Supplier updated' : 'Supplier added'); setShowForm(false); setEditing(null); setForm({ name: '', email: '', phone: '', address: '' }); load() }
    else toast.error('Failed')
  }

  const handleDelete = async (id: string) => { if (!confirm('Delete?')) return; const r = await fetch(`/api/suppliers/${id}`, { method: 'DELETE' }); if (r.ok) { toast.success('Deleted'); load() } }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-display font-bold tracking-tight">Suppliers</h1><p className="text-muted-foreground">Manage your product suppliers</p></div>
        <button onClick={() => { setEditing(null); setForm({ name: '', email: '', phone: '', address: '' }); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm"><Plus className="h-4 w-4" />Add Supplier</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl shadow-lg border border-border p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-display font-semibold text-lg">{editing ? 'Edit' : 'Add'} Supplier</h3><button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-sm font-medium">Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" required /></div>
              <div><label className="text-sm font-medium">Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" /></div>
              <div><label className="text-sm font-medium">Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" /></div>
              <div><label className="text-sm font-medium">Address</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" /></div>
              <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium">{editing ? 'Update' : 'Add'} Supplier</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? [1,2,3].map(i=><div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />) :
        (suppliers??[]).length===0 ? <p className="text-muted-foreground col-span-full text-center py-8">No suppliers yet</p> :
        (suppliers??[]).map((s:any) => (
          <div key={s?.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3"><div className="p-2 bg-primary/10 rounded-lg"><Truck className="h-5 w-5 text-primary" /></div><div><p className="font-medium">{s?.name}</p><p className="text-xs text-muted-foreground">{s?._count?.products ?? 0} products</p></div></div>
              <div className="flex gap-1"><button onClick={()=>{setEditing(s);setForm({name:s.name,email:s.email||'',phone:s.phone||'',address:s.address||''});setShowForm(true)}} className="p-1.5 rounded hover:bg-muted"><Edit className="h-4 w-4 text-muted-foreground" /></button><button onClick={()=>handleDelete(s?.id)} className="p-1.5 rounded hover:bg-destructive/10"><Trash2 className="h-4 w-4 text-destructive" /></button></div>
            </div>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              {s?.email && <p>{s.email}</p>}
              {s?.phone && <p>{s.phone}</p>}
              {s?.address && <p>{s.address}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
