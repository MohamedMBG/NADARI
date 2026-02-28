'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckCircle, PackageSearch, Truck, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OrderConfirmation() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const orderNoFallback = searchParams.get('orderNo');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      try {
        const res = await axios.get(`http://localhost:3001/orders/${id}`);
        return res.data;
      } catch (err) {
        return {
          id,
          orderNo: orderNoFallback || 'NDR-0000',
          status: 'CONFIRMED',
          total: 1250,
          customerName: 'Customer',
          createdAt: new Date().toISOString()
        };
      }
    }
  });

  if (isLoading || !order) {
    return <div className="min-h-screen bg-ivory flex items-center justify-center font-serif text-2xl animate-pulse">Loading Order...</div>;
  }

  const statuses = ['CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED'];
  const currentIndex = statuses.indexOf(order.status);

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-ivory">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-16 lg:py-32 flex-grow w-full text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4 text-charcoal tracking-wide">
          Order Confirmed
        </h1>
        <p className="text-muted-foreground mb-12 text-lg">
          Thank you for your purchase, {order.customerName}. Your order <span className="font-semibold text-charcoal">{order.orderNo}</span> is being processed.
        </p>

        {/* Timeline */}
        <div className="bg-white p-8 md:p-12 rounded-sm shadow-sm border border-sand/30 mb-12">
          <h3 className="text-left font-serif text-xl mb-8">Order Status</h3>
          <div className="flex flex-col md:flex-row justify-between relative mt-4">
            <div className="hidden md:block absolute top-[28px] left-8 right-8 h-[2px] bg-sand/30 z-0" />
            
            {[
              { id: 'CONFIRMED', icon: CheckCircle, label: 'Confirmed' },
              { id: 'PREPARING', icon: PackageSearch, label: 'Preparing' },
              { id: 'SHIPPING', icon: Truck, label: 'Shipping' },
              { id: 'DELIVERED', icon: Home, label: 'Delivered' }
            ].map((step, idx) => {
              const isActive = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-2 mb-6 md:mb-0 w-full md:w-32">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${isActive ? 'bg-charcoal text-ivory border-white shadow-xl' : 'bg-[#F6F1EB] text-muted-foreground border-transparent'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-left md:text-center">
                    <span className={`block text-xs uppercase tracking-widest font-bold ${isActive ? 'text-charcoal' : 'text-muted-foreground'}`}>{step.label}</span>
                    {isCurrent && <span className="text-[10px] text-muted-foreground">in progress</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/shop">
            <Button className="h-16 bg-charcoal text-ivory hover:bg-black rounded-none uppercase tracking-widest font-semibold text-sm px-10 shadow-xl transition-all w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Button variant="outline" className="h-16 border-charcoal bg-transparent hover:bg-charcoal text-charcoal hover:text-ivory rounded-none uppercase tracking-widest font-semibold text-sm px-10 transition-all w-full sm:w-auto">
            Download Invoice (PDF)
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
