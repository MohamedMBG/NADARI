import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory py-16 border-t border-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold tracking-tighter">NADARI</h3>
          <p className="text-sm text-sand leading-relaxed">
            Crafting clarity through luxury. Rabat's premier destination for exclusive eyewear and personalized optical care.
          </p>
        </div>
        <div>
          <h4 className="font-semibold uppercase text-sm tracking-widest mb-6 border-b border-sand/20 pb-2">Collection</h4>
          <ul className="space-y-3 text-sm text-sand">
            <li><Link href="/shop?category=Eyeglasses" className="hover:text-ivory transition">Men's Optical</Link></li>
            <li><Link href="/shop?category=Eyeglasses" className="hover:text-ivory transition">Women's Optical</Link></li>
            <li><Link href="/shop?category=Sunglasses" className="hover:text-ivory transition">Sunglasses</Link></li>
            <li><Link href="/shop?brand=Exclusive" className="hover:text-ivory transition">Limited Editions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold uppercase text-sm tracking-widest mb-6 border-b border-sand/20 pb-2">Support</h4>
          <ul className="space-y-3 text-sm text-sand">
            <li><Link href="/book" className="hover:text-ivory transition">Book Eye Exam</Link></li>
            <li><Link href="/shipping" className="hover:text-ivory transition">Shipping & Returns</Link></li>
            <li><Link href="/guide" className="hover:text-ivory transition">Frame Fitting Guide</Link></li>
            <li><button className="hover:text-ivory transition">Contact Concierge</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold uppercase text-sm tracking-widest mb-6 border-b border-sand/20 pb-2">Visit Us</h4>
          <address className="text-sm text-sand not-italic leading-relaxed">
            14 Avenue Annakhil,<br />
            Hay Riad, Rabat<br />
            Morocco<br /><br />
            Mon-Sat: 10am - 8pm
          </address>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-sand/20 flex flex-col md:flex-row justify-between text-xs text-sand">
        <p>&copy; {new Date().getFullYear()} NADARI Eyewear. All rights reserved.</p>
        <div className="space-x-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-ivory transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-ivory transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
