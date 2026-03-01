'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCartStore } from '@/store/cart';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Shield, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Name is too short'),
  phone: z.string().regex(/^(?:\+212|0)[5-7]\d{8}$/, 'Valid Moroccan phone number required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(10, 'Full address is required'),
  notes: z.string().optional(),
});

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      city: '',
      address: '',
      notes: '',
    },
  });

  const orderMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        customerName: data.fullName,
        customerPhone: data.phone,
        customerCity: data.city,
        customerAddress: data.address,
        customerNotes: data.notes,
        payment: 'COD',
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || null,
          quantity: i.quantity,
          price: i.price,
        })),
      };
      const res = await axios.post(`${API_BASE_URL}/orders`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success('Order Placed Successfully');
      clearCart();
      router.push(`/order/${data.id}?orderNo=${data.orderNo}`);
    },
    onError: () => {
      toast.error('Failed to create order, please try again.');
    }
  });

  function onSubmit(values: z.infer<typeof checkoutSchema>) {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    orderMutation.mutate(values);
  }

  const subtotal = getCartTotal();

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 flex-grow w-full">
        {/* Left Side: Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h1 className="text-3xl font-serif font-semibold mb-2 text-charcoal tracking-wide">Secure Checkout</h1>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className="text-charcoal bg-sand/30 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest">COD Available</span>
              Cash on Delivery available for all orders.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-white p-8 border border-sand/30 shadow-sm rounded-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest text-charcoal mb-6 border-b border-sand/20 pb-4">Contact Information</h2>
                <div className="space-y-6">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                      <FormControl><Input placeholder="Enter your full name" className="h-12 border-sand/50 rounded-none focus-visible:ring-charcoal/20" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number (WhatsApp preferred)</FormLabel>
                      <FormControl><Input placeholder="+212 6XX-XXXXXX" className="h-12 border-sand/50 rounded-none focus-visible:ring-charcoal/20" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="bg-white p-8 border border-sand/30 shadow-sm rounded-sm">
                <h2 className="text-sm font-bold uppercase tracking-widest text-charcoal mb-6 border-b border-sand/20 pb-4">Delivery Details</h2>
                <div className="space-y-6">
                  <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">City</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-sand/50 rounded-none focus-visible:ring-charcoal/20">
                            <SelectValue placeholder="Select your city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Rabat">Rabat (24-48h)</SelectItem>
                          <SelectItem value="Sale">Salé (24-48h)</SelectItem>
                          <SelectItem value="Temara">Témara (24-48h)</SelectItem>
                          <SelectItem value="Casablanca">Casablanca (48-72h)</SelectItem>
                          <SelectItem value="Other">Other Cities (48-72h)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Address</FormLabel>
                      <FormControl><Input placeholder="Street address, Apartment, Suite, etc." className="h-12 border-sand/50 rounded-none focus-visible:ring-charcoal/20" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Delivery Notes (Optional)</FormLabel>
                      <FormControl><Input placeholder="Any special instructions for the courier?" className="h-12 border-sand/50 rounded-none focus-visible:ring-charcoal/20" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="bg-white p-6 border border-charcoal/10 shadow-sm rounded-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-sand/20 rounded flex items-center justify-center"><CreditCard className="w-5 h-5 text-charcoal" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-charcoal">Payment Method</h3>
                    <p className="text-xs text-muted-foreground">Cash on Delivery (COD)</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-4 border-charcoal bg-white flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-charcoal" />
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 bg-white p-8 border border-sand/30 shadow-2xl rounded-sm">
            <h2 className="font-serif text-2xl mb-8 border-b border-sand/20 pb-4">Order Summary</h2>
            
            <div className="space-y-6 mb-8 max-h-96 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-[#F6F1EB] rounded overflow-hidden p-2 flex-shrink-0 border border-sand/20">
                    <Image src={item.image} alt={item.name} fill className="object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-sm tracking-wide">{item.name}</h4>
                      <span className="font-semibold text-sm">{item.price.toLocaleString()} MAD</span>
                    </div>
                    {item.color && <p className="text-xs text-muted-foreground mt-1">{item.color}</p>}
                    <p className="text-xs text-muted-foreground mt-1">Qty {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-sand/20 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping (Standard)</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between border-t border-sand/30 pt-4 mt-4 font-serif text-2xl font-semibold">
                <span>Total</span>
                <span>{subtotal.toLocaleString()} MAD</span>
              </div>
              <p className="text-[10px] text-muted-foreground text-right mt-1 uppercase tracking-widest">Pay with cash upon delivery</p>
            </div>

            <Button 
              className="w-full h-14 bg-charcoal text-ivory hover:bg-black uppercase tracking-widest font-semibold mt-10"
              onClick={form.handleSubmit(onSubmit)}
              disabled={orderMutation.isPending}
            >
              {orderMutation.isPending ? 'Processing...' : 'Confirm Order \u2192'}
            </Button>

            <div className="flex justify-between items-center mt-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">
               <div className="flex flex-col items-center gap-2"><Shield className="w-5 h-5" /> SECURE</div>
               <div className="flex flex-col items-center gap-2"><Truck className="w-5 h-5" /> FAST DELIVERY</div>
               <div className="flex flex-col items-center gap-2"><RefreshCw className="w-5 h-5" /> EASY RETURN</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
