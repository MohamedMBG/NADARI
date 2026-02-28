'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Check, Shield, Truck, CreditCard, Clock, RotateCcw } from 'lucide-react';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { SmartLensRecommender } from '@/components/SmartLensRecommender';
import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function ProductDetails() {
  const { slug } = useParams();
  const { addItem, updateQuantity, items } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [prescription, setPrescription] = useState<string>('Frame Only (No Prescription)');
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/products/${slug}`);
        return res.data;
      } catch (err) {
        // Fallback mockup
        return {
          id: '1', slug: 'black-2en1-unisexe', name: 'Black (2en1) Unisexe', price: 500, category: 'Lunettes Optique / Solaire',
          description: 'Design ultra-moderne 2 en 1. Taille du modèle : 47 mm (C) – 20 mm (E) – 140 mm (A). Ce produit vient avec un clip solaire magnétique (2 en 1). 100% protection contre les UV, avec verres polarisés incassables.',
          images: [
            'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80'
          ],
          variants: [
            { id: 'v1', size: 'Standard', color: 'Black', stock: 10, priceOverride: null },
            { id: 'v2', size: 'Standard', color: 'Brown', stock: 15, priceOverride: null },
            { id: 'v3', size: 'Standard', color: 'Clear', stock: 5, priceOverride: null },
            { id: 'v4', size: 'Standard', color: 'Blue', stock: 8, priceOverride: null },
          ]
        };
      }
    }
  });

  const reserveMutation = useMutation({
    mutationFn: async (data: any) => {
      return axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/reservations`, data);
    },
    onSuccess: () => {
      toast.success('Reservation Confirmed', {
        description: 'We will hold your frame in-store for 24 hours. A confirmation WhatsApp has been drafted!',
      });
      // Mock WhatsApp integration
      const text = encodeURIComponent(`Hi NADARI, I just reserved the ${product.name} (Size: ${selectedSize}, Color: ${selectedColor}) for an in-store fitting.`);
      window.open(`https://wa.me/+212600000000?text=${text}`, '_blank');
    }
  });

  if (isLoading || !product) {
    return <div className="min-h-screen bg-ivory flex items-center justify-center font-serif text-2xl animate-pulse">Loading NADARI...</div>;
  }

  const sizes = Array.from(new Set(product.variants.map((v: any) => v.size).filter(Boolean)));
  const colors = Array.from(new Set(product.variants.map((v: any) => v.color).filter(Boolean)));
  
  // Try to find the matching variant
  const selectedVariant = product.variants.find((v: any) => 
    (v.size === selectedSize || (!v.size && !selectedSize)) && 
    (v.color === selectedColor || (!v.color && !selectedColor))
  );

  const price = selectedVariant?.priceOverride ? Number(selectedVariant.priceOverride) : Number(product.price);
  const stock = selectedVariant?.stock ?? product.variants.reduce((a: number, b: any) => a + b.stock, 0);

  const handleAddToCart = () => {
    if ((sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor)) {
      toast.error('Please select size and color');
      return;
    }
    
    addItem({
      cartItemId: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price,
      quantity: 1,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      prescription,
    });
    
    toast.success('Added to Shopping Bag');
  };

  const handleReserve = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select options to reserve');
      return;
    }
    reserveMutation.mutate({
      productId: product.id,
      phone: '0600000000', // Usually collected via a quick modal, mocked for simplicity
    });
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 flex-grow w-full">
        {/* Gallery */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
          <motion.div variants={fadeUp} className="relative aspect-square bg-sand/10 rounded-sm overflow-hidden border border-sand/30">
            <span className="absolute top-4 left-4 bg-white shadow-sm border border-sand/50 text-charcoal text-[10px] uppercase font-bold tracking-[0.2em] px-3 py-1.5 z-10">
               New Arrival
            </span>
            <Image src={product.images[0]} alt={product.name} fill className="object-cover hover:scale-105 transition duration-1000" priority />
          </motion.div>
          
          <motion.div variants={staggerContainer} className="grid grid-cols-4 gap-4">
            {product.images.map((img: string, i: number) => (
              <motion.div variants={fadeUp} key={i} className="relative aspect-square bg-sand/10 rounded-sm border border-sand/30 overflow-hidden cursor-pointer hover:border-charcoal transition duration-500">
                <Image src={img} alt="" fill className="object-cover" />
              </motion.div>
            ))}
            <motion.div variants={fadeUp} className="relative aspect-square bg-[#F6F1EB] rounded-sm border border-sand/30 flex items-center justify-center flex-col cursor-pointer hover:border-charcoal transition text-charcoal/50 hover:text-charcoal duration-500">
              <RotateCcw className="w-5 h-5 mb-2" />
              <span className="text-[9px] uppercase font-bold tracking-[0.2em]">View 360&deg;</span>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-6 pt-12 border-t border-sand/40 mt-12 text-[10px] uppercase tracking-[0.15em] font-bold">
            <div>
              <span className="block text-muted-foreground mb-1.5">Material</span>
              <span className="text-charcoal text-xs font-semibold">Japanese Titanium</span>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1.5">Craftsmanship</span>
              <span className="text-charcoal text-xs font-semibold">Hand-forged in Sabae</span>
            </div>
            <div>
              <span className="block text-muted-foreground mb-1.5">Weight Profile</span>
              <span className="text-charcoal text-xs font-semibold">Ultra-Light (14g)</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Details List */}
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col">
          <motion.div variants={fadeUp} className="flex justify-between items-start mb-6">
            <h1 className="text-4xl lg:text-5xl font-serif font-medium leading-tight text-charcoal pr-4">{product.name}</h1>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-serif font-semibold mb-2 text-charcoal">{price.toLocaleString()} <span className="text-sm tracking-widest uppercase text-muted-foreground">MAD</span></p>
              {stock > 0 ? (
                <span className="text-green-600 font-bold uppercase tracking-[0.15em] text-[10px] flex items-center justify-end gap-1.5 opacity-80"><Check className="w-3 h-3" /> In Stock</span>
              ) : (
                <span className="text-red-500 font-bold uppercase tracking-[0.15em] text-[10px] opacity-80">Out of Stock</span>
              )}
            </div>
          </motion.div>
          
          <motion.div variants={fadeUp}>
            <p className="text-charcoal/40 text-[10px] font-bold mb-6 tracking-[0.2em] uppercase">The 18k Plated Collection</p>
            <p className="text-muted-foreground leading-relaxed text-lg font-light mb-12">{product.description}</p>
          </motion.div>
          
          {/* Options */}
          {colors.length > 0 && (
            <motion.div variants={fadeUp} className="mb-8">
              <div className="flex justify-between mb-4 text-[10px] font-bold tracking-[0.2em] text-charcoal/50 uppercase">
                 <span>Select Finish</span>
              </div>
              <div className="flex gap-4">
                {colors.map((c: any) => (
                  <button 
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`h-11 w-11 rounded-full border-2 transition-all p-1 outline-none ${selectedColor === c ? 'border-charcoal scale-110 shadow-lg' : 'border-transparent hover:border-sand'}`}
                    title={c}
                  >
                    <span className={`block w-full h-full rounded-full ${c === 'Gold' ? 'bg-[#D4AF37]' : c === 'Silver' ? 'bg-[#C0C0C0]' : 'bg-[#0F0F0F]'}`} />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {sizes.length > 0 && (
            <motion.div variants={fadeUp} className="mb-10">
              <div className="flex justify-between items-end mb-4 text-[10px] font-bold tracking-[0.2em] text-charcoal/50 uppercase">
                <span>Select Size</span>
                <Link href="#" className="border-b border-sand/50 text-charcoal hover:opacity-70 transition pb-0.5">Size Guide</Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {sizes.map((s: any) => (
                  <Button 
                    key={s} 
                    variant="outline" 
                    className={`h-14 rounded-none border-sand hover:bg-charcoal hover:text-ivory transition-all uppercase tracking-widest text-xs font-semibold ${selectedSize === s ? 'bg-charcoal text-ivory border-charcoal outline-none ring-2 ring-charcoal/20 ring-offset-2' : 'text-charcoal bg-white'}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mb-12">
            <div className="flex justify-between items-center mb-4 text-[10px] font-bold tracking-[0.2em] text-charcoal/50 uppercase">
              <span className="block">Optical Prescription</span>
              <SmartLensRecommender onRecommendation={setPrescription} />
            </div>
            <Select value={prescription} onValueChange={setPrescription}>
              <SelectTrigger className="w-full h-14 rounded-none border-sand text-charcoal shadow-sm">
                <SelectValue placeholder="Select type" className="text-sm font-semibold tracking-wide" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Frame Only (No Prescription)" className="h-10">Frame Only <span className="text-muted-foreground ml-2">(No extra cost)</span></SelectItem>
                <SelectItem value="Single Vision (+ 500 MAD)" className="h-10">Single Vision <span className="text-muted-foreground ml-2">(+ 500 MAD)</span></SelectItem>
                <SelectItem value="Blue Light Filter (+ 800 MAD)" className="h-10">Blue Light Filter <span className="text-muted-foreground ml-2">(+ 800 MAD)</span></SelectItem>
                <SelectItem value="Photochromic Transitions (+ 1,200 MAD)" className="h-10">Transitions&reg; <span className="text-muted-foreground ml-2">(+ 1,200 MAD)</span></SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4 mb-12 w-full mt-auto">
            <Button 
              disabled={stock === 0} 
              onClick={handleAddToCart}
              className="w-full h-16 bg-charcoal text-ivory hover:bg-black uppercase tracking-[0.2em] font-bold text-xs rounded-none shadow-2xl disabled:bg-muted disabled:text-muted-foreground flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
            >
              Add to Shopping Bag
            </Button>
            <Button 
              variant="outline"
              disabled={stock === 0 || reserveMutation.isPending}
              onClick={handleReserve}
              className="w-full h-16 border-charcoal bg-transparent text-charcoal hover:bg-charcoal hover:text-ivory uppercase tracking-[0.2em] font-bold text-xs rounded-none flex items-center justify-center gap-3 transition-all"
            >
              <Clock className="w-4 h-4" />
              Reserve In-Store Fitting
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeUp} className="bg-[#F9F8F6] p-8 rounded-none border border-sand/40 space-y-6">
            <div className="flex gap-5 items-start">
              <Truck className="w-5 h-5 mt-0.5 text-charcoal/50" />
              <div>
                <h4 className="text-xs font-bold text-charcoal tracking-[0.1em] uppercase">Complimentary Delivery</h4>
                <p className="text-sm text-muted-foreground mt-1.5 font-light">Securely shipped within Rabat &amp; Casablanca within 24 hours.</p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-sand/30" />
            <div className="flex gap-5 items-start">
              <CreditCard className="w-5 h-5 mt-0.5 text-charcoal/50" />
              <div>
                <h4 className="text-xs font-bold text-charcoal tracking-[0.1em] uppercase">Cash on Delivery</h4>
                <p className="text-sm text-muted-foreground mt-1.5 font-light">Experience the frame first. Pay only upon complete satisfaction.</p>
              </div>
            </div>
            <div className="w-full h-[1px] bg-sand/30" />
            <div className="flex gap-5 items-start">
              <Shield className="w-5 h-5 mt-0.5 text-charcoal/50" />
              <div>
                <h4 className="text-xs font-bold text-charcoal tracking-[0.1em] uppercase">Boutique Warranty</h4>
                <p className="text-sm text-muted-foreground mt-1.5 font-light">Two years of comprehensive coverage against any defects.</p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </main>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
