'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Users, X, Shield } from 'lucide-react'
import { toast } from 'sonner'

export function UsersClient() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'STOCK_OFFICER' })

  const load = () => { setLoading(true); fetch('/api/users').then(r=>r.json()).then(d=>setUsers(d??[])).catch(()=>{}).finally(()=>setLoading(false)) }
  useEffect(load, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editing ? `/api/users/${editing.id}` : '/api/users'
    const body = editing && !form.password ? { name: form.name, email: form.email, role: form.role } : form
    const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { toast.success(editing ? 'User updated' : 'User created'); setShowForm(false); setEditing(null); setForm({ name: '', email: '', password: '', role: 'STOCK_OFFICER' }); load() }
    else { const d = await res.json(); toast.error(d?.error || 'Failed') }
  }

  const handleDelete = async (id: string) => { if (!confirm('Delete this user?')) return; const r = await fetch(`/api/users/${id}`, { method: 'DELETE' }); if (r.ok) { toast.success('Deleted'); load() } }

  const roleColors: any = { ADMIN: 'bg-red-100 text-red-700', STORE_MANAGER: 'bg-blue-100 text-blue-700', STOCK_OFFICER: 'bg-green-100 text-green-700' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div><h1 className="text-2xl font-display font-bold tracking-tight">User Management</h1><p className="text-muted-foreground">Manage system access and roles</p></div>
        <button onClick={() => { setEditing(null); setForm({ name: '', email: '', password: '', role: 'STOCK_OFFICER' }); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm"><Plus className="h-4 w-4" />Add User</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl shadow-lg border border-border p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-display font-semibold text-lg">{editing ? 'Edit' : 'Add'} User</h3><button onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-sm font-medium">Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" required /></div>
              <div><label className="text-sm font-medium">Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" required /></div>
              <div><label className="text-sm font-medium">Password {editing ? '(leave blank to keep)' : ''}</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm" {...(editing ? {} : { required: true })} minLength={6} /></div>
              <div><label className="text-sm font-medium">Role</label><select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-sm">
                <option value="ADMIN">Administrator</option>
                <option value="STORE_MANAGER">Store Manager</option>
                <option value="STOCK_OFFICER">Stock Officer</option>
              </select></div>
              <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium">{editing ? 'Update' : 'Create'} User</button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-muted/50 border-b border-border">
          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
          <th className="text-center px-4 py-3 font-medium text-muted-foreground">Role</th>
          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
        </tr></thead><tbody>
          {loading ? <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</td></tr> :
          (users??[]).map((u:any) => (
            <tr key={u?.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{u?.name}</td>
              <td className="px-4 py-3 text-muted-foreground">{u?.email}</td>
              <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors?.[u?.role] ?? 'bg-gray-100 text-gray-700'}`}>{u?.role?.replace?.('_', ' ') ?? ''}</span></td>
              <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-1">
                <button onClick={()=>{setEditing(u);setForm({name:u.name||'',email:u.email||'',password:'',role:u.role||'STOCK_OFFICER'});setShowForm(true)}} className="p-1.5 rounded hover:bg-muted"><Edit className="h-4 w-4 text-muted-foreground" /></button>
                <button onClick={()=>handleDelete(u?.id)} className="p-1.5 rounded hover:bg-destructive/10"><Trash2 className="h-4 w-4 text-destructive" /></button>
              </div></td>
            </tr>
          ))}
        </tbody></table></div>
      </div>
    </div>
  )
}
