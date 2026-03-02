'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { API_BASE_URL } from '@/lib/api';
import {
  Package, ShoppingCart, Calendar, Clock, Settings, LogOut,
  Plus, Trash2, Pencil, Save, Eye,
} from 'lucide-react';

/* ================================================================
   SHARED HELPERS
   ================================================================ */

const statusColor = (status: string) => {
  switch (status) {
    case 'DELIVERED': case 'COMPLETED': case 'COLLECTED': return 'bg-green-100 text-green-700';
    case 'CANCELLED': case 'DECLINED': case 'EXPIRED': return 'bg-red-100 text-red-700';
    case 'SHIPPING': case 'READY_IN_STORE': return 'bg-purple-100 text-purple-700';
    case 'PREPARING': case 'APPROVED': case 'ACTIVE': return 'bg-blue-100 text-blue-700';
    default: return 'bg-yellow-100 text-yellow-700';
  }
};

const fmtDate = (d: string) => {
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); }
  catch { return d; }
};

/* ================================================================
   1. ORDERS TAB
   ================================================================ */
function OrdersTab() {
  const qc = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => axios.get(`${API_BASE_URL}/orders`).then(r => r.data),
  });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      axios.put(`${API_BASE_URL}/orders/${id}/status`, { status }),
    onSuccess: () => { toast.success('Order status updated'); qc.invalidateQueries({ queryKey: ['admin-orders'] }); },
    onError: () => toast.error('Failed to update'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl font-bold">Orders</h3>
        <span className="text-xs text-muted-foreground">{orders.length} total</span>
      </div>
      {isLoading ? <p className="text-muted-foreground animate-pulse">Loading…</p> : (
        <div className="overflow-x-auto rounded border border-sand/30">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase bg-sand/10 text-left">
              <tr>
                <th className="px-4 py-3">Order No</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id} className="border-b border-sand/20 hover:bg-sand/5">
                  <td className="px-4 py-3 font-semibold">{o.orderNo}</td>
                  <td className="px-4 py-3">{o.customerName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.customerPhone}</td>
                  <td className="px-4 py-3">{o.customerCity}</td>
                  <td className="px-4 py-3">{(Number(o.total) || 0).toLocaleString()} MAD</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(o.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      className="text-xs border p-1 rounded bg-white"
                      value={o.status}
                      onChange={e => updateStatus.mutate({ id: o.id, status: e.target.value })}
                    >
                      {['CONFIRMED','PREPARING','SHIPPING','DELIVERED','CANCELLED'].map(s =>
                        <option key={s} value={s}>{s}</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={8} className="text-center py-16 text-muted-foreground italic">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   2. BOOKINGS TAB
   ================================================================ */
function BookingsTab() {
  const qc = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => axios.get(`${API_BASE_URL}/bookings`).then(r => r.data),
  });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      axios.put(`${API_BASE_URL}/bookings/${id}/status`, { status }),
    onSuccess: () => { toast.success('Booking status updated'); qc.invalidateQueries({ queryKey: ['admin-bookings'] }); },
    onError: () => toast.error('Failed to update'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl font-bold">Bookings</h3>
        <span className="text-xs text-muted-foreground">{bookings.length} total</span>
      </div>
      {isLoading ? <p className="text-muted-foreground animate-pulse">Loading…</p> : (
        <div className="overflow-x-auto rounded border border-sand/30">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase bg-sand/10 text-left">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="border-b border-sand/20 hover:bg-sand/5">
                  <td className="px-4 py-3 font-semibold">{b.service}</td>
                  <td className="px-4 py-3">{b.userName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.userPhone}</td>
                  <td className="px-4 py-3">{fmtDate(b.date)}</td>
                  <td className="px-4 py-3">{b.time}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="text-xs border p-1 rounded bg-white"
                      value={b.status}
                      onChange={e => updateStatus.mutate({ id: b.id, status: e.target.value })}
                    >
                      {['PENDING','APPROVED','DECLINED','COMPLETED'].map(s =>
                        <option key={s} value={s}>{s}</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={7} className="text-center py-16 text-muted-foreground italic">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   3. RESERVATIONS TAB
   ================================================================ */
function ReservationsTab() {
  const qc = useQueryClient();
  const { data: holds = [], isLoading } = useQuery({
    queryKey: ['admin-reservations'],
    queryFn: () => axios.get(`${API_BASE_URL}/reservations`).then(r => r.data),
  });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      axios.put(`${API_BASE_URL}/reservations/${id}/status`, { status }),
    onSuccess: () => { toast.success('Reservation updated'); qc.invalidateQueries({ queryKey: ['admin-reservations'] }); },
    onError: () => toast.error('Failed to update'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl font-bold">24 H Reservations</h3>
        <span className="text-xs text-muted-foreground">{holds.length} total</span>
      </div>
      {isLoading ? <p className="text-muted-foreground animate-pulse">Loading…</p> : (
        <div className="overflow-x-auto rounded border border-sand/30">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase bg-sand/10 text-left">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holds.map((h: any) => (
                <tr key={h.id} className="border-b border-sand/20 hover:bg-sand/5">
                  <td className="px-4 py-3 font-semibold">{h.product?.name || h.productId}</td>
                  <td className="px-4 py-3">{h.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${statusColor(h.status)}`}>
                      {h.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(h.expiresAt)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(h.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      className="text-xs border p-1 rounded bg-white"
                      value={h.status}
                      onChange={e => updateStatus.mutate({ id: h.id, status: e.target.value })}
                    >
                      {['ACTIVE','READY_IN_STORE','COLLECTED','EXPIRED'].map(s =>
                        <option key={s} value={s}>{s}</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))}
              {holds.length === 0 && (
                <tr><td colSpan={6} className="text-center py-16 text-muted-foreground italic">No reservations yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   4. PRODUCTS TAB  —  full CRUD with dialog form + variants
   ================================================================ */
const EMPTY_VARIANT = () => ({ sku: '', size: '', color: '', stock: 0 });
const EMPTY_FORM = {
  name: '', slug: '', description: '', category: 'Eyeglasses',
  price: '', brand: '', images: '',
};

function ProductsTab() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [variants, setVariants] = useState([EMPTY_VARIANT()]);
  const [uploading, setUploading] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => axios.get(`${API_BASE_URL}/products`).then(r => r.data),
  });

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_BASE_URL}/upload`, formData);
      setForm(f => ({ ...f, images: f.images ? f.images + '\n' + res.data.url : res.data.url }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const createMut = useMutation({
    mutationFn: (payload: any) => axios.post(`${API_BASE_URL}/products`, payload),
    onSuccess: () => { toast.success('Product created'); qc.invalidateQueries({ queryKey: ['admin-products'] }); setShowForm(false); },
    onError: () => toast.error('Failed to create product'),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, ...payload }: any) => axios.put(`${API_BASE_URL}/products/${id}`, payload),
    onSuccess: () => { toast.success('Product updated'); qc.invalidateQueries({ queryKey: ['admin-products'] }); setShowForm(false); },
    onError: () => toast.error('Failed to update product'),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => axios.delete(`${API_BASE_URL}/products/${id}`),
    onSuccess: () => { toast.success('Product deleted'); qc.invalidateQueries({ queryKey: ['admin-products'] }); },
    onError: () => toast.error('Failed to delete product'),
  });

  const openCreate = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM });
    setVariants([EMPTY_VARIANT()]);
    setShowForm(true);
  };

  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      name: p.name || '', slug: p.slug || '', description: p.description || '',
      category: p.category || 'Eyeglasses', price: String(Number(p.price) || 0),
      brand: p.brand || '', images: (p.images || []).join('\n'),
    });
    setVariants(
      (p.variants || []).map((v: any) => ({
        sku: v.sku || '', size: v.size || '', color: v.color || '', stock: v.stock || 0,
      }))
    );
    setShowForm(true);
  };

  const handleSubmit = () => {
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      name: form.name, slug, description: form.description || undefined,
      category: form.category, price: Number(form.price), brand: form.brand || undefined,
      images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
      variants: variants.filter(v => v.sku),
    };
    if (editId) updateMut.mutate({ id: editId, ...payload });
    else createMut.mutate(payload);
  };

  const setVariantField = (idx: number, field: string, value: any) => {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl font-bold">Products</h3>
        <Button onClick={openCreate} className="bg-charcoal text-ivory h-10 gap-2 text-xs uppercase tracking-widest">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {isLoading ? <p className="text-muted-foreground animate-pulse">Loading…</p> : (
        <div className="overflow-x-auto rounded border border-sand/30">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase bg-sand/10 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Variants</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => {
                const totalStock = (p.variants || []).reduce((s: number, v: any) => s + (v.stock || 0), 0);
                return (
                  <tr key={p.id} className="border-b border-sand/20 hover:bg-sand/5">
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3">{Number(p.price).toLocaleString()} MAD</td>
                    <td className="px-4 py-3">
                      <span className={totalStock === 0 ? 'text-red-600 font-bold' : totalStock < 5 ? 'text-orange-600 font-bold' : ''}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{(p.variants || []).length}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-sand/20" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete "${p.name}"?`)) deleteMut.mutate(p.id); }}
                        className="p-1.5 rounded hover:bg-red-100 text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr><td colSpan={6} className="text-center py-16 text-muted-foreground italic">No products yet. Click "Add Product" to start.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- Product Create / Edit Dialog ---------- */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editId ? 'Edit Product' : 'New Product'}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Black (2en1) Unisexe" className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Slug</Label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Category *</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eyeglasses">Eyeglasses</SelectItem>
                  <SelectItem value="Sunglasses">Sunglasses</SelectItem>
                  <SelectItem value="Lenses">Lenses</SelectItem>
                  <SelectItem value="Lunettes Optique / Solaire">Optique / Solaire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Price (MAD) *</Label>
              <Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="500" className="h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Brand</Label>
              <Input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="EPOPTIQUE" className="h-10" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Description</Label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full border border-sand/50 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/20 resize-none"
                placeholder="Product description…"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <div className="flex justify-between items-end">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Image URLs (one per line)</Label>
                <div className="relative inline-flex">
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={uploadPhoto} disabled={uploading} />
                  <Button variant="outline" size="sm" type="button" className="h-7 text-xs gap-1 border-sand pointer-events-none" disabled={uploading}>
                    <Plus className="w-3 h-3"/> {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              </div>
              <textarea
                value={form.images}
                onChange={e => setForm(f => ({ ...f, images: e.target.value }))}
                rows={2}
                className="w-full border border-sand/50 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/20 resize-none font-mono"
                placeholder="https://images.unsplash.com/…"
              />
            </div>
          </div>

          {/* Variants sub-form */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Variants</Label>
              <button onClick={() => setVariants(v => [...v, EMPTY_VARIANT()])} className="text-xs font-bold text-charcoal flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> Add Row
              </button>
            </div>
            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-[1fr_0.7fr_0.7fr_0.5fr_auto] gap-2 items-center">
                  <Input placeholder="SKU *" value={v.sku} onChange={e => setVariantField(i, 'sku', e.target.value)} className="h-9 text-xs" />
                  <Input placeholder="Size" value={v.size} onChange={e => setVariantField(i, 'size', e.target.value)} className="h-9 text-xs" />
                  <Input placeholder="Color" value={v.color} onChange={e => setVariantField(i, 'color', e.target.value)} className="h-9 text-xs" />
                  <Input type="number" placeholder="Stock" value={v.stock} onChange={e => setVariantField(i, 'stock', Number(e.target.value))} className="h-9 text-xs" />
                  <button onClick={() => setVariants(prev => prev.filter((_, j) => j !== i))} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Remove">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-sand/30">
            <Button variant="outline" onClick={() => setShowForm(false)} className="h-10 px-6">Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.name || !form.price || createMut.isPending || updateMut.isPending}
              className="bg-charcoal text-ivory h-10 px-8 gap-2"
            >
              <Save className="w-4 h-4" /> {editId ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================================================================
   5. SETTINGS TAB
   ================================================================ */
function SettingsTab() {
  const qc = useQueryClient();
  const { data: settings = {} } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => axios.get(`${API_BASE_URL}/admin/settings`).then(r => r.data),
  });
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (Object.keys(settings).length > 0 && Object.keys(form).length === 0) {
      setForm(settings);
    }
  }, [settings]);

  const saveMut = useMutation({
    mutationFn: (data: Record<string, string>) => axios.put(`${API_BASE_URL}/admin/settings`, data),
    onSuccess: () => { toast.success('Settings saved'); qc.invalidateQueries({ queryKey: ['admin-settings'] }); },
    onError: () => toast.error('Failed to save'),
  });

  const updateField = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));
  const addField = () => { const k = prompt('Setting key (e.g. store_phone):'); if (k) setForm(f => ({ ...f, [k]: '' })); };

  const settingsConfig = [
    { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+212600000000' },
    { key: 'store_name', label: 'Store Name', placeholder: 'NADARI Agdal' },
    { key: 'store_address', label: 'Store Address', placeholder: '14 Avenue de France, Agdal, Rabat' },
    { key: 'store_phone', label: 'Store Phone', placeholder: '+212 537 12 34 56' },
    { key: 'store_email', label: 'Store Email', placeholder: 'contact@nadari.ma' },
    { key: 'store_hours', label: 'Opening Hours', placeholder: 'Mon-Sat 10am-8pm' },
  ];

  const allKeys = [...new Set([...settingsConfig.map(c => c.key), ...Object.keys(form)])];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl font-bold">Settings</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addField} className="h-9 text-xs gap-1"><Plus className="w-3 h-3" /> Add Field</Button>
          <Button onClick={() => saveMut.mutate(form)} disabled={saveMut.isPending} className="bg-charcoal text-ivory h-9 text-xs gap-1 px-6">
            <Save className="w-3 h-3" /> Save All
          </Button>
        </div>
      </div>
      <div className="bg-white border border-sand/30 rounded p-6 space-y-5 max-w-2xl">
        {allKeys.map(key => {
          const cfg = settingsConfig.find(c => c.key === key);
          return (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">{cfg?.label || key}</Label>
              <Input
                value={form[key] || ''}
                onChange={e => updateField(key, e.target.value)}
                placeholder={cfg?.placeholder || ''}
                className="h-10"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================
   MAIN DASHBOARD
   ================================================================ */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      setToken(res.data.access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
      toast.success('Logged in successfully');
    } catch {
      toast.error('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setToken('');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out');
  };

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => axios.get(`${API_BASE_URL}/admin/dashboard`).then(r => r.data),
    enabled: !!token,
  });

  /* ---------- LOGIN SCREEN ---------- */
  if (!token) {
    return (
      <div className="min-h-screen bg-[#F6F1EB] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-lg shadow-2xl w-full max-w-md border border-sand/30">
          <h1 className="font-serif text-3xl font-bold text-center mb-2">NADARI</h1>
          <p className="text-center text-muted-foreground text-sm mb-8">Admin Dashboard</p>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Email</Label>
              <Input type="email" placeholder="admin@nadari.ma" value={email} onChange={e => setEmail(e.target.value)} className="h-12 border-sand" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="h-12 border-sand" />
            </div>
            <Button type="submit" className="w-full h-12 bg-charcoal text-ivory uppercase tracking-widest text-sm font-bold">Login</Button>
          </form>
        </div>
      </div>
    );
  }

  /* ---------- DASHBOARD ---------- */
  const tabs = [
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'holds', icon: Clock, label: 'Reservations' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-ivory flex flex-col fixed h-full z-10 shrink-0">
        <div className="p-8 border-b border-ivory/10">
          <h2 className="font-serif text-2xl font-bold tracking-widest">NADARI</h2>
          <p className="text-xs text-sand/70 mt-1 uppercase tracking-widest">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${
                  activeTab === tab.id ? 'bg-ivory text-charcoal font-semibold' : 'text-ivory/70 hover:bg-ivory/10 hover:text-ivory'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-ivory/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Orders', value: stats?.totalOrders || 0 },
            { label: 'Pending Bookings', value: stats?.pendingBookings || 0 },
            { label: 'Active Holds', value: stats?.activeReservations || 0 },
            { label: 'Revenue (MAD)', value: (stats?.revenue || 0).toLocaleString() },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded border border-sand/30 shadow-sm border-l-4 border-l-charcoal">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</span>
              <p className="text-3xl font-serif mt-2 text-charcoal">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded border border-sand/30 p-8 min-h-[500px] shadow-sm">
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'bookings' && <BookingsTab />}
          {activeTab === 'holds' && <ReservationsTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}
