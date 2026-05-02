import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingContactButtons() {
  return (
    <div className="fixed bottom-6 right-4 z-[88] flex flex-col gap-3 md:right-6">
      <a
        href="tel:+917200059453"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl shadow-slate-400/30 transition hover:scale-105"
        aria-label="Call MK ShopZone"
        title="Call now"
      >
        <Phone className="h-6 w-6" />
      </a>
      <a
        href="https://wa.me/917200059453?text=Hi%20MK%20ShopZone!%20I%20need%20help%20with%20digital%20marketing."
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-green-500/30 transition hover:scale-110 animate-whatsapp-pulse"
        aria-label="Chat on WhatsApp"
        title="WhatsApp us"
      >
        <MessageCircle className="h-8 w-8" />
      </a>
    </div>
  );
}
