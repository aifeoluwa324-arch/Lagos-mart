'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Package, X } from 'lucide-react'
import { toast } from 'sonner'

export function ProductsClient() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', sku: '', description: '', price: '', quantity: '', minStock: '10', categoryId: '', supplierId: '' })
  const [suppliers, setSuppliers] = useState<any[]>([])

  const load = () => {
    setLoading(true)
    fetch(`/api/products?search=${search}`).then(r => r.json()).then(d => setProducts(d ?? [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load(); fetch('/api/suppliers').then(r=>r.json()).then(d=>setSuppliers(d??[])).catch(()=>{}) }, [])
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t) }, [search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing ? `/api/products/${editing.id}` : '/api/products'
    const method = editing ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { toast.success(editing ? 'Product updated' : 'Product added'); setShowForm(false); setEditing(null); setForm({ name: '', sku: '', description: '', price: '', quantity: '', minStock: '10', categoryId: '', supplierId: '' }); load() }
    else { const d = await res.json(); toast.error(d?.error || 'Failed') }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Product deleted'); load() }
  }

  const startEdit = (p: any) => {
    setEditing(p)
    setForm({ name: p.name, sku: p.sku, description: p.description || '', price: String(p.price), quantity: String(p.quantity), minStock: String(p.minStock), categoryId: p.categoryId || '', supplierId: p.supplierId || '' })
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-display font-bold tracking-tight">Products</h1><p className="text-muted-foreground">Manage your product inventory</p></div>
        <button onClick={() => { setEditing(null); setForm({ name: '', sku: '', description: '', price: '', quantity: '', minStock: '10', categoryId: '', supplierId: '' }); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm">
          <Plus className="h-4 w-4" />Add Product
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Search products..." />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl shadow-lg border border-border p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg">{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required /></div>
                <div><label className="text-sm font-medium">SKU</label><input value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required /></div>
              </div>
              <div><label className="text-sm font-medium">Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" rows={2} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm font-medium">Price (₦)</label><input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required /></div>
                <div><label className="text-sm font-medium">Quantity</label><input type="number" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required /></div>
                <div><label className="text-sm font-medium">Min Stock</label><input type="number" value={form.minStock} onChange={e=>setForm({...form,minStock:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              </div>
              <div><label className="text-sm font-medium">Supplier</label><select value={form.supplierId} onChange={e=>setForm({...form,supplierId:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select supplier</option>
                {(suppliers??[]).map((s:any)=><option key={s?.id} value={s?.id}>{s?.name}</option>)}
              </select></div>
              <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">{editing ? 'Update' : 'Add'} Product</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">SKU</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Price</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Stock</th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</td></tr> :
              (products??[]).length === 0 ? <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No products found</td></tr> :
              (products??[]).map((p:any) => {
                const status = (p?.quantity??0) === 0 ? 'Out of stock' : (p?.quantity??0) <= (p?.minStock??10) ? 'Low stock' : 'Available'
                return (
                  <tr key={p?.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{p?.name}</td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{p?.sku}</td>
                    <td className="px-4 py-3 text-right font-mono">₦{(p?.price??0)?.toLocaleString?.('en-NG')}</td>
                    <td className="px-4 py-3 text-center font-mono">{p?.quantity??0}</td>
                    <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${status==='Available'?'bg-green-100 text-green-700':status==='Low stock'?'bg-orange-100 text-orange-700':'bg-red-100 text-red-700'}`}>{status}</span></td>
                    <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                      <button onClick={()=>startEdit(p)} className="p-1.5 rounded hover:bg-muted"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                      <button onClick={()=>handleDelete(p?.id)} className="p-1.5 rounded hover:bg-destructive/10"><Trash2 className="h-4 w-4 text-destructive" /></button>
                    </div></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
