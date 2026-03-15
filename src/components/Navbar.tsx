'use client';

import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';
import { CartDrawer } from './CartDrawer';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useCartStore(state => state.items);
  const pathname = usePathname();

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-3 pt-3">
        <div className="luxury-shell max-w-7xl mx-auto rounded-[1.75rem] border border-white/50 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-3">
                <div className="gold-ring relative flex h-10 w-10 items-center justify-center rounded-full bg-charcoal text-ivory shadow-lg">
                  <div className="h-4 w-4 rounded-full border border-white/50 bg-[radial-gradient(circle_at_30%_30%,#fff8,transparent_35%),linear-gradient(135deg,#e9dcc8,#b79d7a)]" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.42em] text-muted-foreground">Maison d'Optique</p>
                  <p className="font-serif text-[1.45rem] tracking-[0.18em] text-charcoal">NADARI</p>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-charcoal/8 bg-white/55 p-2">
              {[
                { label: 'Eyeglasses', href: '/shop?category=optical' },
                { label: 'Sunglasses', href: '/shop?category=sunglasses' },
                { label: 'Lenses', href: '/shop?category=lenses' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-[13px] uppercase tracking-[0.22em] transition-all duration-300",
                    pathname === link.href
                      ? "bg-charcoal text-ivory shadow-lg"
                      : "text-muted-foreground hover:bg-white hover:text-charcoal"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="ml-2 rounded-full border border-charcoal/10 bg-gradient-to-r from-[#1b1513] to-[#3a2b24] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.24em] text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Book Concierge
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-3">
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/75 text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
                <Search className="h-4 w-4" />
              </button>
              <Link href="/profile" className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/75 text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg sm:flex">
                <User className="h-4 w-4" />
              </Link>
              <button 
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/75 text-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-4 w-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#c9a35e] to-[#8e6c34] text-[10px] font-bold text-white shadow-lg">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                  </span>
                )}
              </button>
              
              <button 
                className="ml-2 text-foreground md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="luxury-shell mx-auto mt-3 max-w-7xl rounded-[1.5rem] md:hidden">
            <div className="space-y-1 px-3 py-3">
              {[
                { label: 'Eyeglasses', href: '/shop?category=optical' },
                { label: 'Sunglasses', href: '/shop?category=sunglasses' },
                { label: 'Lenses', href: '/shop?category=lenses' },
                { label: 'Book Concierge', href: '/book' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground transition hover:bg-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
}
