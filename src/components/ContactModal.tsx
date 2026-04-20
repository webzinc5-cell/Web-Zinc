import { motion, AnimatePresence } from "motion/react";
import { Mail, MessageCircle, Phone, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("9091063123 / 9641553429");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] rounded-[20px] p-8 flex flex-col items-center text-center outline-none border border-primary/30 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <h2 className="text-3xl font-[900] text-white mb-2 tracking-tight">Get in Touch</h2>
            <p className="text-zinc-400 text-[14px] font-medium mb-8 leading-relaxed">
              Choose your preferred way to start your project with WebZinc.
            </p>
            
            <div className="w-full flex flex-col gap-4">
              {/* WhatsApp */}
              <div className="bg-[#050505] border border-primary/20 rounded-xl p-6 flex flex-col gap-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.1)]">
                <div className="flex items-center justify-center gap-2 text-zinc-300">
                  <MessageCircle size={18} className="text-primary" />
                  <span className="font-bold tracking-wide">+91 9641553429</span>
                </div>
                <button 
                  onClick={() => window.open('https://wa.me/919641553429', '_blank', 'noopener,noreferrer')}
                  className="w-full py-4 rounded-lg bg-primary/10 border border-primary text-primary font-bold tracking-widest uppercase text-sm hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse hover:animate-none"
                >
                  Chat Now
                </button>
              </div>

              {/* Email */}
              <div className="bg-[#050505] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 text-zinc-300">
                  <Mail size={18} className="text-zinc-400" />
                  <span className="font-bold tracking-wide">webzinc5@gmail.com</span>
                </div>
                <a 
                  href="mailto:webzinc5@gmail.com"
                  className="flex items-center justify-center w-full py-4 rounded-lg bg-white/5 border border-white/10 text-white font-bold tracking-widest uppercase text-sm hover:bg-white/10 transition-all"
                >
                  Send Email
                </a>
              </div>

              {/* Mobile */}
              <div className="bg-[#050505] border border-white/10 rounded-xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 text-zinc-300">
                  <Phone size={18} className="text-zinc-400" />
                  <span className="font-bold tracking-wide">9091063123 / 9641553429</span>
                </div>
                <button 
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-lg bg-white/5 border border-white/10 text-white font-bold tracking-widest uppercase text-sm hover:bg-white/10 transition-all"
                >
                  {copied ? <><Check size={16} className="text-primary" /> Copied</> : <><Copy size={16} /> Copy Number</>}
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="mt-8 w-full py-4 rounded-lg border border-zinc-700 bg-transparent text-zinc-400 text-sm font-bold tracking-[0.5px] uppercase transition-all duration-300 hover:border-white hover:text-white"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
