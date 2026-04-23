import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, ShieldCheck, Copy, Check } from "lucide-react";
import { useState } from "react";

export function PaymentsPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const glowStyle = {
    border: '1px solid rgba(34, 211, 238, 0.2)',
    boxShadow: '0 0 15px rgba(34, 211, 238, 0.1)'
  };

  const hoverGlowStyle = {
    boxShadow: '0 0 25px rgba(34, 211, 238, 0.4)'
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 pb-12 md:pb-24 px-6 md:px-12 w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full mb-4">
        <button 
          onClick={() => window.location.hash = '#/'}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[13px] font-bold tracking-widest uppercase cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="text-center w-full mb-6"
      >
        <h1 className="text-4xl md:text-5xl font-[900] tracking-tighter uppercase mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)] text-white">
          Secure Payment
        </h1>
        <p className="text-zinc-400 text-lg font-medium tracking-wide max-w-2xl mx-auto">
          Complete your transaction using one of our verified banking gateways below.
        </p>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8"
      >
        {/* Bank Transfer Section */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col p-8 rounded-[20px] bg-[#050505] transition-all duration-500"
          style={glowStyle}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = hoverGlowStyle.boxShadow}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = glowStyle.boxShadow}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Bank Transfer</h2>
          </div>
          
          <div className="space-y-5 flex-1">
            {[
              { label: 'Bank Name', value: 'Canara Bank', id: 'bank' },
              { label: 'Account Holder', value: 'Indra Tantubay', id: 'name' },
              { label: 'Account Number', value: '110037366980', id: 'acc' },
              { label: 'IFSC Code', value: 'CNRB0019529', id: 'ifsc' },
              { label: 'Mobile', value: '9641553429', id: 'phone' }
            ].map((detail) => (
              <div key={detail.id} className="flex flex-col gap-1 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-500">{detail.label}</span>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-200 font-medium text-[15px]">{detail.value}</span>
                  <button 
                    onClick={() => handleCopy(detail.value, detail.id)}
                    className="p-1.5 rounded-md hover:bg-white/5 transition-colors text-zinc-400 hover:text-primary"
                    title="Copy to clipboard"
                  >
                    {copiedField === detail.id ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* UPI Section */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col p-8 rounded-[20px] bg-[#050505] transition-all duration-500"
          style={glowStyle}
          onMouseOver={(e) => e.currentTarget.style.boxShadow = hoverGlowStyle.boxShadow}
          onMouseOut={(e) => e.currentTarget.style.boxShadow = glowStyle.boxShadow}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              <CheckCircle2 size={20} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">UPI Payment</h2>
          </div>
          
          <div className="flex flex-col items-center justify-center flex-1 py-4">
            {/* QR Code Graphic */}
            <div className="w-40 h-40 rounded-lg flex items-center justify-center mb-6 overflow-hidden relative group drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] border border-primary/20">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src="https://i.postimg.cc/d0Mgg5gd/Screenshot-2026-04-20-20-26-29-08.jpg" 
                alt="UPI QR Code" 
                className="w-full h-full object-cover rounded-[8px]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="w-full flex flex-col gap-1 pt-4 border-t border-white/5 text-center px-4">
              <span className="text-[11px] font-bold tracking-widest uppercase text-zinc-500 mb-1">Scan or Pay to UPI ID</span>
              <div className="flex items-center justify-center gap-3 bg-zinc-900/50 py-3 px-4 rounded-lg border border-white/5">
                <span className="text-zinc-200 font-medium text-[14px]">tantubayatindra2@okicici</span>
                <button 
                  onClick={() => handleCopy('tantubayatindra2@okicici', 'upi')}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors text-zinc-400 hover:text-primary"
                  title="Copy UPI ID"
                >
                  {copiedField === 'upi' ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Security & Action Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="w-full mt-6 flex flex-col items-center"
      >
        <div className="bg-primary/5 border border-primary/20 rounded-[15px] p-6 w-full text-center mb-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <p className="text-zinc-300 text-[13px] leading-relaxed flex flex-col sm:flex-row items-center justify-center gap-2">
            <ShieldCheck size={16} className="text-primary hidden sm:block" />
            <span className="font-semibold text-white">Security Notice:</span> All payments are processed through encrypted banking channels. WebZinc does not store your banking credentials.
          </p>
        </div>

        <a 
          href="mailto:webzinc5@gmail.com?subject=Payment%20Screenshot&body=Please%20attach%20your%20transaction%20screenshot%20here."
          className="flex w-full md:w-auto md:min-w-[320px] items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-8 py-5 text-[15px] font-bold tracking-[1px] text-primary transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] cursor-pointer uppercase"
        >
          Confirm Payment (Send Screenshot) <CheckCircle2 size={20} />
        </a>
      </motion.div>
    </div>
  );
}
