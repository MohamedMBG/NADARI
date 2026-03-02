'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_BASE_URL } from '@/lib/api';
import Link from 'next/link';

export default function ProfilePage() {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Hydration avoidance + simple persistence for demo
  useEffect(() => {
    const t = localStorage.getItem('nadari_customer_token');
    if (t) {
      setToken(t);
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    }
  }, []);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => axios.get(`${API_BASE_URL}/auth/me`).then(r => r.data),
    enabled: !!token,
  });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => axios.get(`${API_BASE_URL}/orders/my-orders`).then(r => r.data),
    enabled: !!user,
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const payload = isRegistering ? { email, password, name } : { email, password };
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      const t = res.data.access_token;
      setToken(t);
      localStorage.setItem('nadari_customer_token', t);
      axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      toast.success(isRegistering ? 'Account created!' : 'Logged in successfully!');
    } catch {
      toast.error('Authentication failed. Please check credentials or email already exists.');
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('nadari_customer_token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out');
  };

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-20 px-4">
        <div className="w-full max-w-md bg-white p-8 border border-sand/30 shadow-sm rounded">
          <h1 className="font-serif text-3xl mb-6 text-center">{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
          <form onSubmit={handleAuth} className="space-y-4">
            {isRegistering && (
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input required value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full h-12 bg-charcoal text-ivory rounded-none uppercase tracking-widest text-xs">
              {isRegistering ? 'Register' : 'Sign In'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => setIsRegistering(!isRegistering)} className="text-charcoal font-semibold underline">
              {isRegistering ? 'Sign In' : 'Register Now'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-4xl mb-2">My Account</h1>
          <p className="text-muted-foreground">Welcome back, {user?.email}</p>
        </div>
        <Button onClick={logout} variant="outline" className="border-charcoal text-charcoal rounded-none">Sign Out</Button>
      </div>

      <div className="bg-white border border-sand/30 rounded p-6 shadow-sm">
        <h2 className="font-serif text-2xl mb-6">Order History</h2>
        {isLoading ? (
          <p className="text-muted-foreground">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-sand/5 rounded">
            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
            <Link href="/shop" className="text-sm font-semibold underline text-charcoal">Continue Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="border border-sand/30 p-4 rounded bg-sand/5">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-4 pb-4 border-b border-sand/30">
                  <div>
                    <h3 className="font-semibold">{order.orderNo}</h3>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{Number(order.total).toLocaleString()} MAD</p>
                    <span className="text-xs uppercase font-bold tracking-widest text-blue-600 bg-blue-50 px-2 py-1 inline-block mt-1 rounded">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.product?.name || 'Product'} {item.variant?.color ? `(${item.variant.color})` : ''}</span>
                      <span>{Number(item.price * item.quantity).toLocaleString()} MAD</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
