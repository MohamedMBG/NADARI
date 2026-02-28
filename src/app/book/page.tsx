'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';

import { Shield, Truck, CreditCard, Clock, Eye, User, Sparkles } from 'lucide-react';

const services = [
  { id: 'eye-exam', title: 'Eye Exam', desc: 'Comprehensive check-up', min: 30, price: '200 MAD', icon: <Eye className="w-6 h-6" /> },
  { id: 'frame-styling', title: 'Frame Styling', desc: 'Expert style consultation', min: 45, price: 'Free', icon: <User className="w-6 h-6" /> },
  { id: 'contact-lenses', title: 'Contact Lenses', desc: 'Fitting & trial session', min: 40, price: '150 MAD', icon: <Sparkles className="w-6 h-6" /> }
];

const availableTimes = ['10:00 AM', '10:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({ fullName: '', phone: '' });

  const bookMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        service: data.service.title,
        date: data.date,
        time: data.time,
        userName: data.fullName,
        userPhone: data.phone,
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/bookings`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Booking Request Sent', {
        description: 'We will contact you shortly to confirm your appointment.',
      });
      setStep(4); // Success step
    },
    onError: () => {
      toast.error('Failed to book appointment, please try again.');
    }
  });

  const handleNext = () => {
    if (step === 1 && selectedService) setStep(2);
    else if (step === 2 && selectedTime) setStep(3);
    else if (step === 3 && formData.fullName && formData.phone) {
      bookMutation.mutate({
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        fullName: formData.fullName,
        phone: formData.phone
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col bg-[#F9F8F6]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 flex-grow w-full">
        {/* Left Side: Booking Wizard */}
        <div className="lg:col-span-8 flex flex-col items-start w-full">
          {step < 4 ? (
            <>
              <div className="mb-12">
                <span className="bg-sand/30 text-charcoal px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest mb-4 inline-block">In-Store Service</span>
                <h1 className="text-4xl lg:text-5xl font-serif font-medium mb-4 text-charcoal tracking-wide leading-tight">
                  Book Your Visit<br/>in Agdal
                </h1>
                <p className="text-muted-foreground text-lg">
                  Experience our premium eye care and styling services in person at our flagship Rabat location.
                </p>
              </div>

              <div className="w-full space-y-12">
                {/* Step 1 */}
                <div className={`transition-all duration-300 ${step < 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                  <h3 className="font-serif text-2xl mb-6 flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-charcoal text-ivory' : 'bg-sand text-charcoal'}`}>1</span>
                    Choose a Service
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {services.map((s) => (
                      <button 
                        key={s.id}
                        onClick={() => { setSelectedService(s); setStep(1); }}
                        className={`p-6 text-left border rounded-xl bg-white transition hover:border-charcoal/50 hover:shadow-lg ${selectedService?.id === s.id ? 'border-2 border-charcoal shadow-xl scale-[1.02]' : 'border-sand/40'}`}
                      >
                        <span className="text-2xl mb-4 block">{s.icon}</span>
                        <h4 className="font-bold text-charcoal text-lg">{s.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 mb-8">{s.desc}</p>
                        <div className="flex justify-between items-center text-sm font-semibold mt-auto border-t border-sand/20 pt-4">
                          <span className="text-muted-foreground">{s.min} min</span>
                          <span className={s.price === 'Free' ? 'text-green-600' : 'text-charcoal'}>{s.price}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`transition-all duration-300 ${step < 2 ? 'opacity-30 pointer-events-none cursor-not-allowed hidden' : ''}`}>
                  <h3 className="font-serif text-2xl mb-6 flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-charcoal text-ivory' : 'bg-sand text-charcoal'}`}>2</span>
                    Select Date & Time
                  </h3>
                  <div className="bg-white p-8 rounded-xl border border-sand/30 flex flex-col sm:flex-row gap-12">
                    <div className="flex-1">
                       <h4 className="text-sm font-bold uppercase tracking-widest text-charcoal mb-6 text-center">
                         {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                       </h4>
                       {/* Mock Calendar visually similar to reference */}
                       <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-2">
                         {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="text-muted-foreground">{d}</span>)}
                       </div>
                       <div className="grid grid-cols-7 gap-2 text-center text-sm">
                         {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                           const day = i + 1;
                           const isSelected = day === selectedDate.getDate();
                           return (
                             <button 
                               key={day} 
                               onClick={() => {
                                 const newDate = new Date(selectedDate);
                                 newDate.setDate(day);
                                 setSelectedDate(newDate);
                               }}
                               className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition ${isSelected ? 'bg-charcoal text-ivory font-bold shadow-md' : 'hover:bg-sand/20'}`}
                             >
                               {day}
                             </button>
                           )
                         })}
                       </div>
                    </div>
                    
                    <div className="w-px bg-sand/30 hidden sm:block" />
                    
                    <div className="flex-1 space-y-6">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 block">Morning</span>
                        <div className="grid grid-cols-2 gap-3">
                          {availableTimes.slice(0, 2).map((time) => (
                            <button 
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-3 px-4 border rounded relative text-sm font-medium transition ${selectedTime === time ? 'border-charcoal bg-charcoal text-ivory shadow-lg' : 'border-sand/50 text-charcoal hover:border-charcoal/50 bg-white'}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 block">Afternoon</span>
                        <div className="grid grid-cols-2 gap-3">
                          {availableTimes.slice(2).map((time) => (
                            <button 
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-3 px-4 border rounded relative text-sm font-medium transition ${selectedTime === time ? 'border-charcoal bg-charcoal text-ivory shadow-lg' : 'border-sand/50 text-charcoal hover:border-charcoal/50 bg-white'}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`transition-all duration-300 ${step < 3 ? 'opacity-30 pointer-events-none cursor-not-allowed hidden' : ''}`}>
                  <h3 className="font-serif text-2xl mb-6 flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-charcoal text-ivory' : 'bg-sand text-charcoal'}`}>3</span>
                    Your Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-white p-8 rounded-xl border border-sand/30">
                    <div className="space-y-2">
                       <Label className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
                       <Input 
                         value={formData.fullName} 
                         onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                         placeholder="John Doe" 
                         className="h-12 border-sand/50 focus-visible:ring-charcoal/20" 
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs uppercase tracking-widest text-muted-foreground">Phone Number</Label>
                       <Input 
                         value={formData.phone} 
                         onChange={(e) => setFormData({...formData, phone: e.target.value})}
                         placeholder="+212 600 000 000" 
                         className="h-12 border-sand/50 focus-visible:ring-charcoal/20" 
                       />
                    </div>
                  </div>
                </div>
              </div>

              {step < 4 && (
                <div className="mt-12 flex justify-end w-full">
                  <Button 
                    className="h-14 bg-charcoal text-ivory hover:bg-black rounded px-12 text-sm uppercase tracking-widest font-bold shadow-xl flex items-center gap-3 transition"
                    onClick={handleNext}
                    disabled={bookMutation.isPending || (step === 3 && (!formData.fullName || !formData.phone))}
                  >
                    {step === 3 ? (bookMutation.isPending ? 'Processing...' : 'Confirm Booking') : 'Next Step'}
                    {step < 3 && <span>&rarr;</span>}
                    {step === 3 && !bookMutation.isPending && <span>&rarr;</span>}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-32 text-center bg-white border border-sand/30 rounded-xl shadow-sm">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="font-serif text-4xl mb-4 text-charcoal">Booking Requested</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">Thank you! Your request for an in-store {selectedService?.title} has been received. Our concierge will contact you on WhatsApp to confirm.</p>
              <Button onClick={() => window.location.href = '/'} className="h-14 bg-charcoal text-ivory px-10 uppercase tracking-widest text-sm font-bold">
                Return to Home
              </Button>
            </div>
          )}
        </div>

        {/* Right Side: Summary Panel */}
        <div className="lg:col-span-4 relative w-full lg:sticky lg:top-28 self-start">
          <div className="bg-white rounded-xl overflow-hidden border border-sand/50 shadow-2xl">
            <div className="relative h-48 bg-[#D3DED9] w-full">
               <Image src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" alt="Map" fill className="object-cover opacity-60 mix-blend-multiply" />
               <div className="absolute inset-x-0 bottom-4 text-center">
                 <span className="bg-charcoal text-ivory px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 w-max mx-auto">
                   <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> Agdal, Rabat
                 </span>
               </div>
            </div>
            
            <div className="p-8 pb-6 border-b border-sand/20">
              <h3 className="font-serif text-2xl font-bold mb-2">NADARI Agdal</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                68 Avenue Fal Ould Oumeir, Rabat<br/>
                Open Mon-Sat, 10am - 8pm
              </p>
              <button className="text-xs font-bold uppercase tracking-widest text-charcoal border-b border-charcoal mt-6 pb-1 inline-block hover:text-charcoal/70 transition">
                Get Directions
              </button>
            </div>

            <div className="p-8 bg-[#FDFBF9]">
              <h4 className="font-bold text-charcoal mb-6 text-lg font-serif">Booking Summary</h4>
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between items-center text-muted-foreground border-b border-sand/30 pb-3">
                  <span>Service</span>
                  <span className="font-medium text-charcoal">{selectedService ? selectedService.title : '—'}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground border-b border-sand/30 pb-3">
                  <span>Date</span>
                  <span className="font-medium text-charcoal">{selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground border-b border-sand/30 pb-3">
                  <span>Time</span>
                  <span className="font-medium text-charcoal">{selectedTime || '—'}</span>
                </div>
                 <div className="flex justify-between items-center text-charcoal font-semibold text-lg pt-2 border-b border-charcoal pb-4 mb-4">
                  <span>Total to pay</span>
                  <span>{selectedService ? selectedService.price : '—'}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed text-center mb-6 px-4">
                Payment is collected in-store after your appointment.
              </p>
              <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground">Need help? <span className="text-charcoal cursor-pointer border-b border-charcoal hover:opacity-70">Contact us</span></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
