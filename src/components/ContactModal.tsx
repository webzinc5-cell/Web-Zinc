import { motion, AnimatePresence } from "motion/react";
import { Mail, MessageCircle, Phone, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] p-4 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-md pointer-events-auto"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            className="absolute top-[50%] left-[50%] pointer-events-auto w-[95%] max-w-none md:max-w-md bg-[#0a0a0a] rounded-[20px] p-4 md:p-8 flex flex-col items-center text-center outline-none border border-primary/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] max-h-[85vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-[900] text-white mb-2 tracking-tight">Get in Touch</h2>
            <p className="text-zinc-400 text-[14px] font-medium mb-8 leading-relaxed">
              Choose your preferred way to start your project with WebZinc.
            </p>
            
            <div className="w-full flex flex-col gap-4">
              {/* WhatsApp */}
              <div className="bg-[#050505] border border-primary/30 rounded-xl p-6 flex flex-col gap-4 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <div className="flex items-center justify-center gap-2 text-zinc-300">
                  <MessageCircle size={18} className="text-primary" />
                  <span className="font-bold tracking-wide">WhatsApp: +91 9641553429</span>
                </div>
                <button 
                  onClick={() => window.open('https://wa.me/919641553429', '_blank', 'noopener,noreferrer')}
                  className="w-full py-4 rounded-lg bg-primary/10 border border-primary/40 text-primary font-bold tracking-widest uppercase text-sm hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] cursor-pointer"
                >
                  Chat Now
                </button>
              </div>

              {/* Email */}
              <div className="bg-[#050505] border border-primary/30 rounded-xl p-6 flex flex-col gap-4 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <div className="flex items-center justify-center gap-2 text-zinc-300">
                  <Mail size={18} className="text-primary" />
                  <span className="font-bold tracking-wide">webzinc5@gmail.com</span>
                </div>
                <a 
                  href="mailto:webzinc5@gmail.com"
                  className="flex items-center justify-center w-full py-4 rounded-lg bg-primary/10 border border-primary/40 text-primary font-bold tracking-widest uppercase text-sm hover:bg-primary hover:text-black transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] cursor-pointer"
                >
                  Send Email
                </a>
              </div>

              {/* Mobile */}
              <div className="bg-[#050505] border border-primary/30 rounded-xl p-6 flex flex-col gap-4 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                <div className="flex items-center justify-center gap-2 text-zinc-300 mb-1">
                  <Phone size={18} className="text-primary" />
                  <span className="font-bold tracking-wide">Mobile Numbers</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Line 1", number: "9091063123", id: "line1" },
                    { label: "Line 2", number: "9641553429", id: "line2" }
                  ].map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0 bg-black/50 border border-white/10 rounded-lg p-3 sm:p-2 sm:pl-4">
                      <span className="text-zinc-300 font-bold tracking-wide text-[13px] flex flex-col sm:flex-row items-center gap-1 sm:gap-0">
                        {item.label}: <span className="text-white ml-0 sm:ml-1">{item.number}</span>
                      </span>
                      <button 
                        onClick={() => handleCopy(item.number, item.id)}
                        className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/40 text-primary font-bold tracking-widest uppercase text-[11px] hover:bg-primary hover:text-black transition-all shadow-[0_0_10px_rgba(34,211,238,0.1)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-pointer group"
                      >
                        {copiedField === item.id ? <><Check size={14} className="group-hover:text-black" /> Copied</> : <><Copy size={14} /> Copy</>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="mt-8 w-full py-4 rounded-lg border border-primary bg-primary text-black text-sm font-bold tracking-[0.5px] uppercase transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-pointer"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
