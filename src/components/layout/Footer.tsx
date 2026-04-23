import { Link } from "react-router-dom";

interface FooterProps {
  onOpenContact?: () => void;
  theme?: 'dark' | 'light';
}

export function Footer({ onOpenContact, theme = 'dark' }: FooterProps) {
  const isLight = theme === 'light';

  return (
    <footer className={`border-t transition-colors duration-300 ${isLight ? 'border-slate-200 bg-white' : 'border-zinc-border bg-black'} py-12`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 sm:flex-row">
        <div className="mb-4 sm:mb-0 text-center sm:text-left">
          <Link to="/" className={`text-xl font-bold tracking-tight transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
            WebZinc
          </Link>
          <p className={`mt-2 text-[10px] md:text-xs transition-colors ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
            © 2026 Web Zinc. Website Building Agency.
          </p>
          <p className={`mt-1 text-[10px] md:text-xs transition-colors ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
            WebZinc | Based in Durgapur, West Bengal | Serving Startups across India.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 mt-4 sm:mt-0 justify-center sm:justify-start">
          <Link to="/payments" className={`text-xs font-medium uppercase tracking-wider transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-500 hover:text-white'}`}>
            Pricing & Payments
          </Link>
          <Link to="/reviews" className={`text-xs font-medium uppercase tracking-wider transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-500 hover:text-white'}`}>
            Reviews
          </Link>
          <button onClick={onOpenContact} className={`text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer bg-transparent border-none p-0 outline-none ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-500 hover:text-white'}`}>
            Contact
          </button>
          <Link to="/privacy-policy" className={`text-xs font-medium uppercase tracking-wider transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-500 hover:text-white'}`}>
            Privacy Policy
          </Link>
          <Link to="/terms-and-conditions" className={`text-xs font-medium uppercase tracking-wider transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-500 hover:text-white'}`}>
            Terms of Service
          </Link>
          <a 
            href="https://wa.me/919641553429" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`text-xs font-medium uppercase tracking-wider flex items-center gap-2 group transition-all ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-500 hover:text-white'}`}
          >
            <MessageCircle size={14} className="group-hover:text-primary transition-colors" />
            WhatsApp
          </a>
          <Link to="/documentation" className={`text-xs font-medium uppercase tracking-wider transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-500 hover:text-white'}`}>
            Documentation
          </Link>
        </div>
      </div>
    </footer>
  );
}

import { MessageCircle } from "lucide-react";
