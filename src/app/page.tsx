'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight, Star, ShieldCheck, Gem } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col pt-24">
      <Navbar />
      
      {/* Hero Section */}
      <section className="luxury-shell relative mx-4 mb-10 mt-2 flex h-[88vh] items-center justify-center overflow-hidden rounded-[2rem] shadow-2xl">
        <Image 
          src="https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80" 
          alt="NADARI Hero" 
          fill 
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_28%)]" />
        <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm" />
        <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 blur-sm" />
        
        <motion.div 
          className="relative z-10 text-center text-ivory max-w-4xl px-6 flex flex-col items-center"
          initial="hidden" animate="visible" variants={staggerContainer}
        >
          <motion.span variants={fadeUp} className="inline-block py-1.5 px-5 border border-ivory/50 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md bg-white/10">
            Morocco's Premier Optical Destination
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-serif font-bold italic mb-6 drop-shadow-2xl leading-tight">
            Vision, <br className="md:hidden" />Refined.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-2xl font-light mb-12 drop-shadow-md text-ivory/90 max-w-2xl mx-auto leading-relaxed">
            Experience the epitome of luxury eyewear. Curated frames and precision optics sourced from the world's most prestigious artisans.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button className="bg-white text-charcoal hover:bg-sand hover:text-charcoal rounded-none px-12 py-7 text-xs uppercase tracking-[0.15em] font-bold w-full sm:w-auto transition-all duration-500 shadow-xl">
                Explore Collection
              </Button>
            </Link>
            <Link href="/book" className="w-full sm:w-auto">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-charcoal bg-transparent backdrop-blur-sm rounded-none px-12 py-7 text-xs uppercase tracking-[0.15em] font-bold w-full sm:w-auto transition-all duration-500">
                Book Concierge
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Collection */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
        >
          <div className="max-w-xl">
             <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-[1px] bg-charcoal"></div>
               <span className="text-charcoal font-bold tracking-[0.2em] uppercase text-xs">Curated Selection</span>
             </div>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight">Frames that define<br/>your signature look.</h2>
          </div>
          <Link href="/shop" className="group flex items-center gap-3 text-charcoal text-sm font-bold tracking-widest uppercase hover:opacity-70 transition-opacity">
            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </motion.div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {/* Mock Product Cards */}
          {[
            { slug: 'black-2en1-unisexe', name: 'Black (2en1) Unisexe', price: '500 MAD', tag: 'New Arrival', img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&q=80', desc: 'Clip solaire magnétique (2 en 1)' },
            { slug: 'mow-2en1-unisexe', name: 'Mow (2en1) Unisexe', price: '500 MAD', tag: null, img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80', desc: 'Verres polarisés protection 100%' },
            { slug: 'gozel-2en1-femmes', name: 'Gozel (2en1) Femmes', price: '500 MAD', tag: 'Bestseller', img: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80', desc: 'Finesse, légèreté et protection' },
          ].map((item, i) => (
            <motion.div variants={fadeUp} key={i}>
              <Link href={`/product/${item.slug}`} className="group cursor-pointer block">
                <div className="relative aspect-[4/5] bg-sand/10 border border-sand/30 mb-6 overflow-hidden transition-all duration-700 hover:shadow-2xl">
                  {item.tag && <span className="absolute top-4 left-4 bg-charcoal text-ivory text-[9px] uppercase tracking-widest px-3 py-1.5 font-bold z-10">{item.tag}</span>}
                  <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition duration-1000 ease-in-out mix-blend-multiply opacity-90 group-hover:opacity-100" />
                </div>
                <div className="flex justify-between items-start pr-2">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-charcoal">{item.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1.5 font-light">{item.desc}</p>
                  </div>
                  <span className="font-semibold text-charcoal tracking-wide">{item.price}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Standard Section */}
      <section className="relative mt-12 overflow-hidden rounded-[2rem] bg-charcoal text-ivory py-32">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent opacity-50 pointer-events-none" />
        <div className="absolute inset-0 luxury-grid opacity-10" />
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 italic">The NADARI Standard</h2>
            <p className="text-ivory/70 max-w-2xl mx-auto mb-24 text-lg font-light leading-relaxed">
              Where technical precision meets aesthetic excellence. Our commitment to your vision goes far beyond just frames.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12"
          >
            {[
              { title: 'Prescription Perfect', desc: 'State-of-the-art diagnostic equipment ensuring your lenses are crafted with flawless accuracy.', icon: ShieldCheck },
              { title: 'Global Luxury', desc: 'An exclusive, hand-picked selection of international premium eyewear brands, curated for the Moroccan elite.', icon: Gem },
              { title: 'Bespoke Advisory', desc: 'Expert stylists and opticians who dedicate time to understand your lifestyle and unique facial architecture.', icon: Star },
            ].map((s, i) => (
              <motion.div variants={fadeUp} key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-lg">
                  <s.icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif text-2xl font-medium mb-4">{s.title}</h3>
                <p className="text-sm text-ivory/60 leading-relaxed font-light">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-32 px-4 max-w-4xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <span className="text-gold text-8xl font-serif mb-4 block leading-none opacity-50">"</span>
          <blockquote className="text-3xl md:text-5xl font-serif italic font-light leading-snug text-charcoal mb-16">
            The attention to detail at NADARI is unmatched. From the moment you walk into the Agdal boutique, you feel the difference. My new Tom Ford frames are absolutely flawless.
          </blockquote>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mb-5 relative border-2 border-sand p-1">
               <div className="w-full h-full relative rounded-full overflow-hidden">
                 <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" alt="Customer" fill className="object-cover" />
               </div>
            </div>
            <span className="font-bold text-sm tracking-[0.2em] uppercase text-charcoal">Sofia Benjelloun</span>
            <span className="text-xs text-muted-foreground mt-2 tracking-widest uppercase">Verified Client</span>
          </div>
        </motion.div>
      </section>

      {/* Boutique Map */}
      <section className="luxury-shell mx-4 mb-8 flex h-auto flex-col overflow-hidden rounded-[2rem] md:h-[700px] md:flex-row">
        <div className="w-full md:w-1/2 bg-[#F6F1EB]/90 text-charcoal p-12 md:p-24 flex flex-col justify-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-md mx-auto w-full">
            <h2 className="font-serif text-5xl mb-12 italic">Visit the<br/>Boutique</h2>
            
            <div className="space-y-10 border-l border-charcoal/20 pl-8">
              <div>
                <h4 className="text-charcoal/50 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">Location</h4>
                <p className="leading-relaxed font-light text-xl">14 Avenue de France,<br/>Agdal, Rabat 10090<br/>Morocco</p>
              </div>
              
              <div>
                <h4 className="text-charcoal/50 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">Hours</h4>
                <p className="leading-relaxed font-light text-lg">Mon - Sat: 10:00 AM - 8:00 PM<br/><span className="text-muted-foreground">Sunday: Closed</span></p>
              </div>

              <div>
                <h4 className="text-charcoal/50 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">Direct Line</h4>
                <p className="font-light text-lg">+212 537 12 34 56<br/>contact@nadari.ma</p>
              </div>
            </div>
            
            <Button className="mt-16 bg-[#25D366] text-white hover:bg-[#128C7E] w-max font-bold py-7 px-10 flex gap-3 text-sm items-center font-sans tracking-[0.15em] uppercase rounded-none shadow-xl transition-all hover:scale-105">
               WhatsApp Concierge
            </Button>
          </motion.div>
        </div>
        <div className="w-full md:w-1/2 relative min-h-[500px]">
           <Image src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" alt="Map" fill className="object-cover grayscale hover:grayscale-0 transition duration-1000" />
           <div className="absolute inset-0 bg-charcoal/10" />
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="bg-white text-charcoal p-5 rounded-full shadow-2xl animate-bounce border border-sand">
                <MapPin className="w-8 h-8" />
             </div>
           </div>
        </div>
      </section>

      <Footer />
      <WhatsAppWidget />
    </main>
  );
}
