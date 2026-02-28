'use client';

import { useCartStore } from '@/store/cart';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-ivory text-charcoal flex flex-col h-full border-l border-sand p-0">
        <SheetHeader className="p-6 border-b border-sand">
          <SheetTitle className="font-serif text-2xl font-normal tracking-wide">Your Shopping Bag</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground mt-12 flex flex-col items-center gap-4">
              <span className="font-serif italic text-xl">Your bag is empty</span>
              <Button variant="outline" className="border-charcoal !text-charcoal hover:bg-charcoal hover:!text-ivory rounded-none uppercase tracking-widest text-xs h-12 px-8" onClick={() => onOpenChange(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 pb-6 border-b border-sand last:border-0">
                <div className="relative w-24 h-24 bg-white flex items-center justify-center rounded">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      {item.color && <p className="text-sm text-muted-foreground">{item.color} {item.size ? `/ Size: ${item.size}` : ''}</p>}
                      {item.prescription && <p className="text-xs text-muted-foreground mt-1">Lens: {item.prescription}</p>}
                    </div>
                    <button onClick={() => removeItem(item.cartItemId)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-sand">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="px-3 py-1 hover:bg-muted" disabled={item.quantity <= 1}>
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="px-3 py-1 hover:bg-muted">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-medium">{item.price.toLocaleString()} MAD</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-sand bg-white space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span className="font-serif">Subtotal</span>
              <span>{getCartTotal().toLocaleString()} MAD</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">Taxes & shipping calculated at checkout.</p>
            <div className="space-y-2">
              <Link href="/checkout" onClick={() => onOpenChange(false)}>
                <Button className="w-full rounded-none bg-charcoal text-ivory hover:bg-charcoal/90 uppercase tracking-widest h-14">
                  Secure Checkout
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
