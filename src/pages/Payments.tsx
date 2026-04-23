import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, ShieldCheck, Copy, Check, Info } from "lucide-react";
import { useState } from "react";

export function PaymentsPage({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen pt-16 md:pt-24 pb-12 transition-colors duration-300 ${isLight ? 'bg-[#F8FAFC]' : 'bg-[#000000] text-white'}`}>
      <div className="mx-auto w-full max-w-[92%] md:max-w-4xl px-2 md:px-6">
        {/* Navigation Header */}
        <div className="mb-4 md:mb-8 flex items-center justify-between">
          <button 
            onClick={() => window.location.hash = '#/'}
            className={`flex items-center gap-2 transition-colors text-[11px] md:text-[13px] font-bold tracking-widest uppercase cursor-pointer ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}
          >
            <ArrowLeft size={16} />
            Home
          </button>
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] md:text-xs tracking-widest uppercase bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <ShieldCheck size={14} />
            Verified Terminal
          </div>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-6 md:gap-8"
        >
          {/* Two-Column Grid for Gateways */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* BOX 1: Bank Transfer */}
            <motion.div 
              variants={itemVariants}
              className={`rounded-2xl border p-4 md:p-6 transition-all duration-300 flex flex-col ${
                isLight 
                  ? 'bg-white border-[#E2E8F0] shadow-xl' 
                  : 'bg-zinc-950/80 border-primary/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <ShieldCheck size={16} className="text-primary" />
                </div>
                <span className={`text-xs md:text-sm font-black uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>Bank Transfer</span>
              </div>

              <div className="space-y-4 flex-1">
                {[
                  { label: 'Bank Name', value: 'Canara Bank', id: 'bank' },
                  { label: 'Account Holder', value: 'Indra Tantubay', id: 'holder' },
                  { label: 'Account Number', value: '110037366980', id: 'acc' },
                  { label: 'IFSC Code', value: 'CNRB0019529', id: 'ifsc' },
                  { label: 'Mobile Number', value: '+91 9641553429', id: 'mobile' }
                ].map((detail) => (
                  <div key={detail.id} className="flex flex-col gap-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>{detail.label}</span>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-extrabold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>{detail.value}</span>
                      {(detail.id === 'acc' || detail.id === 'ifsc' || detail.id === 'mobile') && (
                        <button 
                          onClick={() => handleCopy(detail.value, detail.id)}
                          className={`p-1.5 rounded hover:bg-primary/10 transition-colors ${isLight ? 'text-slate-300 hover:text-primary' : 'text-zinc-600 hover:text-primary'}`}
                        >
                          {copiedField === detail.id ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* BOX 2: UPI Payment */}
            <motion.div 
              variants={itemVariants}
              className={`rounded-2xl border p-4 md:p-6 transition-all duration-300 flex flex-col items-center text-center ${
                isLight 
                  ? 'bg-white border-[#E2E8F0] shadow-xl' 
                  : 'bg-zinc-950/80 border-primary/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
              }`}
            >
              <div className="flex items-center gap-2 mb-6 w-full justify-center md:justify-start">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <CheckCircle2 size={16} className="text-primary" />
                </div>
                <span className={`text-xs md:text-sm font-black uppercase tracking-widest ${isLight ? 'text-slate-900' : 'text-white'}`}>UPI Gateway</span>
              </div>

              <div className="flex flex-col items-center gap-6 w-full">
                <div className="w-[150px] md:w-[180px] aspect-square rounded-xl bg-white p-2 shadow-sm border border-primary/10 transition-transform hover:scale-[1.02]">
                  <img 
                    src="https://i.postimg.cc/d0Mgg5gd/Screenshot-2026-04-20-20-26-29-08.jpg" 
                    alt="Merchant QR" 
                    className="w-full h-full object-cover rounded-lg" 
                  />
                </div>

                <div className="w-full space-y-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>SCAN OR PAY TO UPI ID</span>
                  <div className={`flex items-center justify-center gap-3 p-3 rounded-xl border text-sm font-bold transition-all ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/50 border-white/10 text-white'
                  }`}>
                    <span className="truncate">tantubayatindra2@okicici</span>
                    <button 
                      onClick={() => handleCopy('tantubayatindra2@okicici', 'upi')}
                      className="shrink-0 hover:text-primary transition-colors p-1"
                    >
                      {copiedField === 'upi' ? <Check size={16} strokeWidth={3} className="text-primary" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Action Button Section */}
          <motion.div variants={itemVariants} className="w-full space-y-6">
            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              isLight ? 'bg-indigo-50 border-indigo-100' : 'bg-primary/5 border border-primary/10'
            }`}>
               <Info size={20} className="text-primary shrink-0" />
               <p className={`text-xs md:text-sm font-medium leading-relaxed ${isLight ? 'text-indigo-900' : 'text-zinc-300'}`}>
                 Verification process: After completing the transfer, click the button below to send your payment screenshot via WhatsApp.
               </p>
            </div>

            <button 
              onClick={() => {
                const message = encodeURIComponent("Hello WebZinc, I have completed the payment and I'm sending the screenshot for verification.");
                window.open(`https://wa.me/919641553429?text=${message}`, '_blank');
              }}
              className={`flex items-center justify-center gap-3 w-full py-4 md:py-6 rounded-2xl text-xs md:text-sm font-black uppercase tracking-[3px] transition-all ${
                isLight 
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg' 
                  : 'bg-primary text-black hover:scale-[1.01] active:scale-[0.98] shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.7)]'
              }`}
            >
              Confirm Payment (WhatsApp)
              <CheckCircle2 size={20} />
            </button>
          </motion.div>

          {/* Security Footer Details */}
          <div className="flex flex-col items-center gap-2 text-center px-4">
             <div className="flex items-center gap-4">
                <div className={`h-[1px] w-12 md:w-20 ${isLight ? 'bg-slate-200' : 'bg-zinc-800'}`} />
                <span className={`text-[9px] font-black uppercase tracking-[3px] ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>Verified Node</span>
                <div className={`h-[1px] w-12 md:w-20 ${isLight ? 'bg-slate-200' : 'bg-zinc-800'}`} />
             </div>
             <p className={`text-[10px] md:text-xs font-semibold leading-relaxed max-w-lg ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>
               All transactions are processed through encrypted gateways. 
               <br className="hidden md:block" /> 
               WebZinc infrastructure deployment begins instantly upon verification.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
