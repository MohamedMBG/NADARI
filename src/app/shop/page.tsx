'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { API_BASE_URL } from '@/lib/api';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Shop() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat === 'optical') setCategory('Eyeglasses');
      if (cat === 'sunglasses') setCategory('Sunglasses');
      if (cat === 'lenses') setCategory('Lenses');
    }
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      // Mocked if API offline
      try {
        const res = await axios.get(`${API_BASE_URL}/products${category !== 'all' ? `?category=${category}` : ''}`);

        return res.data;
      } catch (err) {
        // Fallback for demo
        return [
          {
            id: '1', slug: 'black-2en1-unisexe', name: 'Black (2en1) Unisexe', price: 500, category: 'Lunettes Optique / Solaire',
            images: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80'],
            variants: [{ stock: 38 }]
          },
          {
            id: '2', slug: 'mow-2en1-unisexe', name: 'Mow (2en1) Unisexe', price: 500, category: 'Lunettes Optique / Solaire',
            images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80'],
            variants: [{ stock: 32 }]
          },
          {
            id: '3', slug: 'gozel-2en1-femmes', name: 'Gozel (2en1) Femmes', price: 500, category: 'Lunettes Optique / Solaire',
            images: ['https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80'],
            variants: [{ stock: 22 }]
          },
          {
            id: '4', slug: 'jet-2en1-unisexe', name: 'Jet (2en1) Unisexe', price: 600, category: 'Lunettes Optique / Solaire',
            images: ['https://images.unsplash.com/photo-1589831377283-33cb1cc6bd5d?auto=format&fit=crop&q=80'],
            variants: [{ stock: 24 }]
          },
        ];
      }
    }
  });

  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === 'price_asc') filtered.sort((a: any, b: any) => a.price - b.price);
  if (sort === 'price_desc') filtered.sort((a: any, b: any) => b.price - a.price);

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <Navbar />
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="luxury-shell relative mb-16 flex flex-col gap-8 overflow-hidden rounded-[2rem] border border-white/50 px-8 py-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.16),transparent_45%)]" />
          <div className="max-w-xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.38em] text-muted-foreground">Curated Optical Archive</p>
            <h1 className="text-6xl font-serif mb-4 italic text-charcoal tracking-tight">The Collection</h1>
            <p className="text-muted-foreground text-xl font-light text-balance">Curated eyewear for the modern minimalist, elevated with statement frames and precise finishing.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/50 w-4 h-4" />
              <Input 
                placeholder="Search styles..." 
                className="pl-10 h-12 bg-white/80 border-charcoal/10 rounded-full focus-visible:ring-charcoal/20 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48 h-12 bg-white/80 rounded-full border-charcoal/10 uppercase text-xs tracking-[0.15em] font-semibold text-charcoal shadow-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Styles</SelectItem>
                <SelectItem value="Eyeglasses">Optical</SelectItem>
                <SelectItem value="Sunglasses">Sun</SelectItem>
                <SelectItem value="Lenses">Lenses</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-48 h-12 bg-white/80 rounded-full border-charcoal/10 uppercase text-xs tracking-[0.15em] font-semibold text-charcoal shadow-sm">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20"
        >
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] bg-white border border-sand/30 mb-6" />
                <div className="h-4 bg-sand/30 w-3/4 mb-3" />
                <div className="h-4 bg-sand/30 w-1/4" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full py-32 text-center text-muted-foreground italic font-serif text-2xl border border-dashed border-charcoal/20">
              No pieces found matching your criteria.
            </div>
          ) : (
            filtered.map((product: any) => {
              const totalStock = product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0;
              const isLowStock = totalStock > 0 && totalStock <= 5;
              const outOfStock = totalStock === 0;

              return (
                <motion.div variants={fadeUp} key={product.id}>
                  <Link href={`/product/${product.slug}`} className="group flex flex-col h-full cursor-pointer">
                    <div className="luxury-panel relative aspect-[4/5] overflow-hidden mb-8 rounded-[1.75rem] p-12 transition-all duration-700 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:border-sand/50">
                      <div className="absolute inset-x-6 top-6 h-16 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7),transparent_70%)] blur-xl" />
                      <span className="absolute top-5 left-5 bg-[#F6F1EB]/85 text-charcoal border border-charcoal/10 text-[9px] uppercase font-bold tracking-widest px-3 py-1.5 z-10 rounded-full">
                        COD Available
                      </span>
                      {outOfStock ? (
                        <span className="absolute top-5 right-5 bg-red-100 text-red-700 text-[9px] uppercase tracking-widest px-3 py-1.5 font-bold z-10 rounded-full">Out of Stock</span>
                      ) : isLowStock ? (
                        <span className="absolute top-5 right-5 bg-orange-100 text-orange-700 text-[9px] uppercase tracking-widest px-3 py-1.5 font-bold z-10 rounded-full">Only {totalStock} Left</span>
                      ) : null}
                      
                      <Image 
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80'} 
                        alt={product.name} 
                        fill 
                        className={`object-contain transition-transform duration-1000 group-hover:scale-110 ${outOfStock ? 'opacity-50 grayscale' : ''}`}
                      />
                      
                      {/* Hover Overlay Button */}
                      <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                         <div className="rounded-full bg-charcoal text-ivory text-center py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-xl">
                            Discover
                         </div>
                      </div>
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <h3 className="font-serif text-[22px] font-medium text-charcoal leading-snug">{product.name}</h3>
                      <div className="mt-4 flex justify-between items-center text-sm border-t border-charcoal/5 pt-4">
                        <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">{product.category}</span>
                        <span className="font-semibold text-charcoal">{Number(product.price).toLocaleString()} MAD</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}
