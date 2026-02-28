'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, ShoppingCart, Calendar, Clock, Settings, LogOut, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const queryClient = useQueryClient();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/login`, { email, password });
      setToken(res.data.access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
      toast.success('Logged in successfully');
    } catch (err) {
      toast.error('Invalid credentials');
    }
  };

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/admin/dashboard`)).data,
    enabled: !!token,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => (await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders`)).data,
    enabled: !!token && activeTab === 'orders',
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: () => {
      toast.error('Failed to update order status');
    }
  });

  if (!token) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded shadow-2xl w-full max-w-md">
          <h1 className="font-serif text-3xl font-bold text-center mb-8">NADARI Admin</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <Input 
              type="email" 
              placeholder="Admin Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="h-12 border-sand" 
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="h-12 border-sand" 
            />
            <Button type="submit" className="w-full h-12 bg-charcoal">Login to Dashboard</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-ivory flex flex-col fixed h-full z-10">
        <div className="p-8 border-b border-ivory/10">
          <h2 className="font-serif text-2xl font-bold tracking-widest">NADARI</h2>
          <p className="text-xs text-sand/70 mt-1 uppercase tracking-widest">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'orders', icon: ShoppingCart, label: 'Orders' },
            { id: 'bookings', icon: Calendar, label: 'Bookings' },
            { id: 'holds', icon: Clock, label: 'Reservations' },
            { id: 'products', icon: Package, label: 'Products' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm transition-colors ${activeTab === tab.id ? 'bg-ivory text-charcoal font-semibold' : 'text-ivory/70 hover:bg-ivory/10 hover:text-ivory'}`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-ivory/10">
          <button onClick={() => {
            setToken('');
            delete axios.defaults.headers.common['Authorization'];
          }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Orders', value: stats?.totalOrders || 0 },
            { label: 'Pending Bookings', value: stats?.pendingBookings || 0 },
            { label: 'Active Holds', value: stats?.activeReservations || 0 },
            { label: 'Revenue (MAD)', value: stats?.revenue?.toLocaleString() || '0' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded border border-sand/30 shadow-sm border-l-4 border-l-charcoal">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{s.label}</span>
              <p className="text-3xl font-serif mt-2 text-charcoal">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="bg-white rounded border border-sand/30 p-8 min-h-[500px] shadow-sm">
          {activeTab === 'orders' && (
            <div>
              <h3 className="font-serif text-2xl font-bold mb-6">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-sand/10">
                    <tr>
                      <th className="px-6 py-4">Order No</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Total</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o: any) => (
                      <tr key={o.id} className="border-b border-sand/20 hover:bg-sand/5">
                        <td className="px-6 py-4 font-semibold text-charcoal">{o.orderNo}</td>
                        <td className="px-6 py-4">{o.customerName}</td>
                        <td className="px-6 py-4">{(Number(o.total) || 0).toLocaleString()} MAD</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                           <select 
                             className="text-xs border p-1 rounded bg-white text-muted-foreground"
                             value={o.status}
                             onChange={(e) => updateOrderStatus.mutate({ id: o.id, status: e.target.value })}
                           >
                             <option value="CONFIRMED">Confirm</option>
                             <option value="PREPARING">Prepare</option>
                             <option value="SHIPPING">Ship</option>
                             <option value="DELIVERED">Deliver</option>
                           </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'bookings' && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-32">
               <Calendar className="w-12 h-12 mb-4 text-sand" />
               <p className="font-serif text-xl">Bookings Management (Demo Structure)</p>
               <p className="text-sm">Connects to /bookings GET API endpoint.</p>
             </div>
          )}
          
          {activeTab === 'holds' && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-32">
               <Clock className="w-12 h-12 mb-4 text-sand" />
               <p className="font-serif text-xl">24H Reservations Hold List</p>
               <p className="text-sm">Cron Job will expire these automatically.</p>
             </div>
          )}

          {activeTab === 'products' && (
             <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-32">
               <Package className="w-12 h-12 mb-4 text-sand" />
               <p className="font-serif text-xl">Product Catalog Management</p>
               <p className="text-sm">Integration with Prisma product tracking.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
