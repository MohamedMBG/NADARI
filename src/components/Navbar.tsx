'use client';

import Link from 'next/link';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-sans text-[22px] tracking-tight font-extrabold flex items-center gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center -rotate-45">
                  <div className="w-5 h-6 bg-charcoal rounded-full border-t-4 border-white shadow-sm" />
                </div>
                NADARI
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {[
                { label: 'Eyeglasses', href: '/shop?category=optical' },
                { label: 'Sunglasses', href: '/shop?category=sunglasses' },
                { label: 'Lenses', href: '/shop?category=lenses' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[15px] font-medium transition-colors hover:text-charcoal",
                    pathname === link.href ? "text-charcoal border-b-2 border-charcoal pb-1" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/book"
                className="text-[15px] font-bold text-charcoal transition-colors hover:opacity-70"
              >
                Book Appointment
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-3">
              <button className="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center text-foreground hover:bg-gray-200 transition">
                <Search className="h-4 w-4" />
              </button>
              <Link href="/admin" className="w-10 h-10 rounded-full bg-[#f3f4f6] hidden sm:flex items-center justify-center text-foreground hover:bg-gray-200 transition">
                <User className="h-4 w-4" />
              </Link>
              <button 
                className="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center text-foreground hover:bg-gray-200 transition relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-4 w-4" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-charcoal text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                  </span>
                )}
              </button>
              
              <button 
                className="md:hidden text-foreground ml-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {[
                { label: 'Eyeglasses', href: '/shop?category=optical' },
                { label: 'Sunglasses', href: '/shop?category=sunglasses' },
                { label: 'Lenses', href: '/shop?category=lenses' },
                { label: 'Book Appointment', href: '/book' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted"
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
