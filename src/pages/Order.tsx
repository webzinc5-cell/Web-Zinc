import { useState, FormEvent, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Rocket, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CATEGORIES = [
  "E-commerce Solutions",
  "Startup Website Design",
  "Professional Portfolio",
  "Business Landing Page",
  "Maintenance & Growth Subscription",
  "Custom Enterprise Build",
  "UI/UX Strategy & Redesign"
];

export function Order() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    category: "Startup Website Design",
    details: "",
    specialInstructions: ""
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      
      // Auto-redirect back to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#000000] text-white pt-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(34,211,238,0.05)_0%,transparent_60%)] z-0 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto w-full max-w-2xl relative z-10 pb-12"
      >
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[13px] font-bold tracking-widest uppercase cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-[32px] md:text-[48px] font-extrabold tracking-[-1px] leading-tight text-white">
            Start Your <span className="text-primary drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">Build.</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-zinc-400 font-medium">
            Provide the details below to launch your next premium web project with Web Zinc.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a]/80 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.form 
                key="order-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      placeholder="John Doe"
                      className="w-full h-12 md:h-14 rounded-xl border border-zinc-800 bg-[#000] px-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)_inset] text-sm" 
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Contact Number</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.contactNumber}
                      onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full h-12 md:h-14 rounded-xl border border-zinc-800 bg-[#000] px-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)_inset] text-sm" 
                    />
                  </div>
                </div>

                <div ref={dropdownRef} className="relative z-50">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Category</label>
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center justify-between w-full h-12 md:h-14 rounded-xl border bg-[#000] px-4 text-white cursor-pointer transition-all ${isDropdownOpen ? 'border-primary ring-1 ring-primary shadow-[0_0_15px_rgba(34,211,238,0.2)_inset]' : 'border-zinc-800 hover:border-zinc-600'} text-sm`}
                  >
                    <span>{formData.category}</span>
                    <ChevronDown size={18} className={`text-zinc-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                  </div>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#000] border border-primary/50 shadow-[0_0_20px_rgba(34,211,238,0.15)] rounded-xl overflow-hidden origin-top z-50"
                      >
                        {CATEGORIES.map((cat, idx) => (
                          <div 
                            key={idx}
                            onClick={() => {
                              setFormData({...formData, category: cat});
                              setIsDropdownOpen(false);
                            }}
                            className={`px-4 py-3 text-sm cursor-pointer transition-colors ${formData.category === cat ? 'bg-primary/20 text-white' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
                          >
                            {cat}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Details</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.details}
                    onChange={e => setFormData({...formData, details: e.target.value})}
                    placeholder="Tell us about your brand, goals, and specific features you need..."
                    className="w-full resize-none rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)_inset] text-sm" 
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">Special Instructions <span className="text-zinc-600 font-normal normal-case">(Optional)</span></label>
                  <textarea 
                    rows={3}
                    value={formData.specialInstructions}
                    onChange={e => setFormData({...formData, specialInstructions: e.target.value})}
                    placeholder="Any specific design references or extra requirements?"
                    className="w-full resize-none rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)_inset] text-sm" 
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 md:py-5 font-bold text-black transition-all hover:bg-white shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-[1.02] uppercase tracking-widest text-[13px] md:text-[15px] disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">Processing...</span>
                    ) : (
                      <>Submit Order <Rocket size={18} /></>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="h-20 w-20 rounded-full bg-primary/20 border border-primary flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.4)] mb-6">
                  <Rocket size={32} className="text-primary animate-bounce" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">Order Confirmed!</h3>
                <p className="text-zinc-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
                  We've received your project details. Our engineering team will review it and get back to you shortly. Redirecting you to the dashboard...
                </p>
                <Link to="/profile">
                  <button className="flex items-center justify-center gap-2 rounded-lg border border-primary bg-primary/10 px-6 py-3 font-bold text-primary transition-all hover:bg-primary hover:text-black uppercase tracking-widest text-[11px] md:text-xs">
                    Go to Dashboard
                  </button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
