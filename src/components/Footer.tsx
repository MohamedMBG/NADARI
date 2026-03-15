import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-charcoal/10 bg-[linear-gradient(180deg,#201715_0%,#120e0d_100%)] text-ivory">
      <div className="absolute inset-0 opacity-20">
        <div className="luxury-grid h-full w-full bg-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.38em] text-[#d9c8b4]">Nadari Private Optics</p>
            <h2 className="text-balance text-4xl leading-tight text-white md:text-5xl">
              Refined eyewear, precision care, and a quieter kind of luxury.
            </h2>
          </div>
          <Link href="/book" className="inline-flex w-fit rounded-full border border-[#d4af37]/40 bg-[#f6f1eb] px-6 py-3 text-[12px] font-bold uppercase tracking-[0.25em] text-charcoal transition hover:-translate-y-0.5 hover:shadow-xl">
            Book A Private Fitting
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
        <div className="space-y-4">
          <h3 className="font-serif text-3xl tracking-[0.2em] text-white">NADARI</h3>
          <p className="max-w-sm text-sm leading-relaxed text-sand">
            Crafting clarity through luxury. Rabat&apos;s premier destination for exclusive eyewear and personalized optical care.
          </p>
        </div>
        <div>
          <h4 className="mb-6 border-b border-sand/20 pb-2 text-sm font-semibold uppercase tracking-widest">Collection</h4>
          <ul className="space-y-3 text-sm text-sand">
            <li><Link href="/shop?category=Eyeglasses" className="transition hover:text-ivory">Men&apos;s Optical</Link></li>
            <li><Link href="/shop?category=Eyeglasses" className="transition hover:text-ivory">Women&apos;s Optical</Link></li>
            <li><Link href="/shop?category=Sunglasses" className="transition hover:text-ivory">Sunglasses</Link></li>
            <li><Link href="/shop?brand=Exclusive" className="transition hover:text-ivory">Limited Editions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 border-b border-sand/20 pb-2 text-sm font-semibold uppercase tracking-widest">Support</h4>
          <ul className="space-y-3 text-sm text-sand">
            <li><Link href="/book" className="transition hover:text-ivory">Book Eye Exam</Link></li>
            <li><Link href="/shipping" className="transition hover:text-ivory">Shipping & Returns</Link></li>
            <li><Link href="/guide" className="transition hover:text-ivory">Frame Fitting Guide</Link></li>
            <li><button className="transition hover:text-ivory">Contact Concierge</button></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 border-b border-sand/20 pb-2 text-sm font-semibold uppercase tracking-widest">Visit Us</h4>
          <address className="text-sm text-sand not-italic leading-relaxed">
            14 Avenue Annakhil,<br />
            Hay Riad, Rabat<br />
            Morocco<br /><br />
            Mon-Sat: 10am - 8pm
          </address>
        </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mt-16 flex flex-col justify-between border-t border-sand/20 pt-8 text-xs text-sand md:flex-row">
        <p>&copy; {new Date().getFullYear()} NADARI Eyewear. All rights reserved.</p>
        <div className="mt-4 space-x-4 md:mt-0">
          <Link href="/privacy" className="transition hover:text-ivory">Privacy Policy</Link>
          <Link href="/terms" className="transition hover:text-ivory">Terms of Service</Link>
        </div>
      </div>
      </div>
    </footer>
  );
}
