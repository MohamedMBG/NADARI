'use client';

import { useState } from 'react';
import { MessageCircle, X, ChevronRight, User, Store, Truck, Sparkles } from 'lucide-react';

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP || '+212600000000';

  const actions = [
    { title: 'Style Advice', desc: 'I need help finding frames for my face shape.', icon: <User className="w-5 h-5" /> },
    { title: 'Check Availability', desc: "Is the 'Agdal' frame in stock?", icon: <Store className="w-5 h-5" /> },
    { title: 'Order Status', desc: 'Confirm my Cash on Delivery order.', icon: <Truck className="w-5 h-5" /> },
    { title: 'General Inquiry', desc: 'I have a different question.', icon: <MessageCircle className="w-5 h-5" /> },
  ];

  const handleAction = (desc: string) => {
    const text = encodeURIComponent(desc);
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-xl shadow-2xl w-80 mb-4 border border-sand/50 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="p-6 border-b border-sand/30 bg-ivory/50 flex justify-between items-start">
            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal flex gap-2 items-center">
                NADARI Concierge <Sparkles className="w-5 h-5 text-gold" />
              </h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Welcome to our personalized styling service in Rabat. How can we assist you on WhatsApp today?
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-charcoal transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="divide-y divide-sand/30">
            {actions.map((action, i) => (
              <button 
                key={i} 
                className="w-full text-left p-4 hover:bg-sand/10 transition flex items-center justify-between group"
                onClick={() => handleAction(action.desc)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-sand/30 flex items-center justify-center text-lg">{action.icon}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal group-hover:text-gold transition-colors">{action.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1">{action.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-sand group-hover:text-gold transition-colors" />
              </button>
            ))}
          </div>

          <div className="p-4 bg-ivory/30 border-t border-sand/30 flex justify-center items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online now • Typically replies in 5m
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}
