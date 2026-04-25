import { useState, FormEvent, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Rocket, ChevronDown, CheckCircle, Send, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

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
  
  const [step, setStep] = useState<1 | 2>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasClickedWhatsApp, setHasClickedWhatsApp] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.contactNumber.length !== 10) {
      alert("Please enter exactly 10 digits for your contact number.");
      return;
    }
    setStep(2);
  };

  const handleConfirmOrder = () => {
    setIsModalOpen(true);
  };

  const handleSendToWhatsApp = () => {
    setHasClickedWhatsApp(true);
    const waLink = `https://wa.me/919641553429?text=${encodeURIComponent(
      `NEW WEBZINC ORDER:\n\nName: ${formData.fullName}\nContact: +91 ${formData.contactNumber}\nCategory: ${formData.category}\nDetails: ${formData.details}\nSpecial Instructions: ${formData.specialInstructions || 'None'}`
    )}`;
    window.open(waLink, "_blank");
  };

  const handleConfirmSent = async () => {
    setIsSubmitting(true);
    try {
      if (!auth.currentUser?.uid) {
        alert("Authentication error: User ID missing. Please log in again.");
        setIsSubmitting(false);
        return;
      }
      
      const orderToSave = {
        ...formData,
        userId: auth.currentUser.uid,
        contactNumber: `+91 ${formData.contactNumber}`,
        status: "pending",
        timestamp: new Date()
      };

      const docRef = await addDoc(collection(db, "orders"), orderToSave);
      console.log("Order saved with ID:", docRef.id);

      setIsSubmitting(false);
      setIsModalOpen(false);
      setSuccess(true);
      
      navigate("/profile");
    } catch (error: any) {
      console.error("DEBUG INFO:", error.code, error.message);
      setIsSubmitting(false);
      alert("There was an error saving your order. Please try again.");
    }
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
          onClick={() => {
            if (step === 2) setStep(1);
            else navigate(-1);
          }}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[13px] font-bold tracking-widest uppercase cursor-pointer"
        >
          <ArrowLeft size={16} />
          {step === 2 ? "Back to Edit" : "Back"}
        </button>

        <div className="mb-8">
          <h1 className="text-[32px] md:text-[48px] font-extrabold tracking-[-1px] leading-tight text-white">
            {step === 1 ? (
              <>Start Your <span className="text-primary drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">Build.</span></>
            ) : (
              <>Order <span className="text-primary drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">Review.</span></>
            )}
          </h1>
          <p className="mt-3 text-sm md:text-base text-zinc-400 font-medium">
            {step === 1 
              ? "Provide the details below to launch your next premium web project with Web Zinc."
              : "Please verify your project details before submitting the order."}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a]/80 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {!success ? (
              step === 1 ? (
                <motion.form 
                  key="step-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleReviewSubmit} 
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
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-zinc-400 font-medium text-sm">+91</span>
                        <input 
                          required
                          type="tel" 
                          maxLength={10}
                          value={formData.contactNumber}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData({...formData, contactNumber: val});
                          }}
                          placeholder="9876543210"
                          className="w-full h-12 md:h-14 rounded-xl border border-zinc-800 bg-[#000] pl-12 pr-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)_inset] text-sm" 
                        />
                      </div>
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
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 md:py-5 font-bold text-black transition-all hover:bg-white shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-[1.02] uppercase tracking-widest text-[13px] md:text-[15px] cursor-pointer"
                    >
                      Review Order <ArrowLeft size={18} className="rotate-180" />
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-4 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6">
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-800">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1">Name</p>
                        <p className="text-sm text-white font-medium">{formData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1">Contact</p>
                        <p className="text-sm text-white font-medium">{formData.contactNumber}</p>
                      </div>
                    </div>
                    <div className="pb-4 border-b border-zinc-800">
                      <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1">Category</p>
                      <p className="text-sm text-white font-medium">{formData.category}</p>
                    </div>
                    <div className="pb-4 border-b border-zinc-800">
                      <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1">Details</p>
                      <p className="text-sm text-white font-medium leading-relaxed whitespace-pre-wrap">{formData.details}</p>
                    </div>
                    {formData.specialInstructions && (
                      <div>
                        <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-1">Special Instructions</p>
                        <p className="text-sm text-white font-medium leading-relaxed whitespace-pre-wrap">{formData.specialInstructions}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex flex-col md:flex-row gap-4">
                    <button 
                      onClick={() => setStep(1)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-transparent border border-zinc-700 px-8 py-4 font-bold text-white transition-all hover:bg-zinc-800 uppercase tracking-widest text-[13px] md:text-[15px] cursor-pointer"
                    >
                      <ArrowLeft size={18} /> Edit Details
                    </button>
                    <button 
                      onClick={handleConfirmOrder}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-black transition-all hover:bg-white shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-[1.02] uppercase tracking-widest text-[13px] md:text-[15px] cursor-pointer"
                    >
                      Confirm Order <Rocket size={18} />
                    </button>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="h-20 w-20 rounded-full bg-primary/20 border border-primary flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.4)] mb-6">
                  <CheckCircle size={32} className="text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">Order Finalized!</h3>
                <p className="text-zinc-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
                  Your project is officially queued for review. You can now track its progress directly from your dashboard. Redirecting...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* WHATSAPP CONFIRMATION MODAL */}
      <AnimatePresence>
        {isModalOpen && !success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-primary/50 shadow-[0_0_40px_rgba(34,211,238,0.2)] rounded-3xl p-8 relative overflow-hidden"
            >
              {/* Modal Glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <MessageCircle size={28} className="text-green-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">Send to WhatsApp</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  Almost there. Please send us your order details via WhatsApp so we can connect with you instantly.
                </p>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleSendToWhatsApp}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 px-6 py-4 font-bold text-black transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] cursor-pointer tracking-wide"
                  >
                    <MessageCircle size={18} /> Send Details
                  </button>
                  
                  <button 
                    onClick={handleConfirmSent}
                    disabled={isSubmitting || !hasClickedWhatsApp}
                    className={`group relative overflow-hidden flex w-full items-center justify-center gap-2 rounded-xl bg-transparent border px-6 py-4 font-bold transition-all tracking-wide 
                      ${(!isSubmitting && hasClickedWhatsApp) 
                        ? "border-primary text-primary hover:bg-primary/10 shadow-[0_0_10px_rgba(34,211,238,0.1)_inset] cursor-pointer" 
                        : "border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50"
                      }`}
                  >
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {isSubmitting ? "Finalizing Order..." : (
                      <><CheckCircle size={18} /> Confirm Sent</>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-wider mt-2 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
