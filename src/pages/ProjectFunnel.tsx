import React, { useState, FormEvent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { ArrowLeft, Rocket, ChevronDown, CheckCircle2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

function CustomDropdown({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-zinc-800 bg-[#000] p-4 text-white transition-all shadow-none focus-within:border-primary focus-within:shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:border-zinc-700"
      >
        <span>{value}</span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-zinc-500"}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-primary bg-[rgba(0,0,0,0.8)] backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.15)]"
          >
            <div className="max-h-60 overflow-y-auto w-full py-2 flex flex-col">
              {options.map((option) => (
                <div
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full cursor-pointer px-4 py-3 text-sm transition-all hover:bg-primary/20 hover:text-primary hover:shadow-[0_0_10px_rgba(34,211,238,0.3)_inset] ${value === option ? "text-primary bg-primary/10" : "text-zinc-300"}`}
                >
                  {option}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProjectFunnel({ userProjects = [], setUserProjects }: any) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'fill-form' | 'review' | 'verify'>('fill-form');
  const [formData, setFormData] = useState({
    title: "",
    category: "Tech / Startup",
    contactNumber: "",
    about: "",
    goal: "Lead Generation",
    instructions: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRedirectPopup, setShowRedirectPopup] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    setStep('review');
  };

  const getWhatsAppUrl = (data: any) => {
    const message = `🚀 *New WebZinc Order!* 🚀

*Website Name:* ${data.title}
*Category:* ${data.category}
*Contact Number:* +91 ${data.contactNumber}
*About:* ${data.about}
*Instructions:* ${data.instructions || 'None'}`;
    
    const encodedMessage = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=919641553429&text=${encodedMessage}`;
  };

  const handleOrderSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to order a web build.");
      return;
    }
      
    setIsSubmitting(true);

    try {
      const newOrderInfo = {
        userId: user.uid,
        name: formData.title,
        category: formData.category,
        contactNumber: `+91 ${formData.contactNumber}`,
        about: formData.about,
        status: "Awaiting WhatsApp",
        isVerified: false,
        timestamp: serverTimestamp(),
        id: Date.now().toString(),
        title: formData.title,
        progress: 0,
        date: new Date().toISOString().split('T')[0],
        goal: formData.goal,
        instructions: formData.instructions
      };

      const docRef = await addDoc(collection(db, "projects"), newOrderInfo);
      
      const savedDoc = { ...newOrderInfo, docId: docRef.id };
      setOrderData(savedDoc);

      setShowRedirectPopup(true);

      timeoutRef.current = setTimeout(() => {
        setShowRedirectPopup(false);
        setStep('verify');
        setIsSubmitting(false);
      }, 2000);

    } catch (error) {
      alert(`Error processing your order: ${(error as Error).message}`);
      setIsSubmitting(false);
    }
  };

  const handleVerifyConfirm = async () => {
    if (!orderData?.docId) return;
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "projects", orderData.docId), {
        isVerified: true,
        status: "Pending Review"
      });
      
      if (setUserProjects) {
        setUserProjects([...userProjects, { ...orderData, isVerified: true, status: "Pending Review" }]);
      }
      navigate("/profile");
    } catch (error) {
      alert("Error confirming your submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#000] text-white pt-24 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(34,211,238,0.05)_0%,transparent_60%)] z-0 pointer-events-none" />
      
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mx-auto w-full max-w-3xl relative z-10 z-10 pb-24">
        
        <button 
          onClick={() => step === 'review' ? setStep('fill-form') : navigate("/")}
          className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[13px] font-bold tracking-widest uppercase"
        >
          <ArrowLeft size={16} />
          {step === 'review' ? "Edit Details" : "Back to Home"}
        </button>

        {step === 'fill-form' ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-[-1px] leading-tight flex flex-wrap max-w-full">
                  Let's launch something brilliant.
                </h1>
                <p className="mt-2 text-sm text-zinc-400 max-w-xl">
                  Provide us with the foundational details of your upcoming website. This helps us blueprint a luminescent digital strategy tailored exactly to your brand.
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Step 1 of 2</span>
                <div className="mt-2 flex gap-1">
                  <div className="h-1 w-8 rounded-full bg-primary shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                  <div className="h-1 w-8 rounded-full bg-zinc-800" />
                </div>
              </div>
            </div>
            
            <form onSubmit={handleNext} className="space-y-6 rounded-2xl border border-zinc-800 bg-[#0a0a0a]/50 p-6 sm:p-8 backdrop-blur-xl">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Website/Brand Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="Acme Corp"
                  className="w-full h-14 rounded-xl border border-zinc-800 bg-[#000] px-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)_inset]" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <CustomDropdown 
                  label="Business Category"
                  options={["E-commerce", "Portfolio", "Real Estate", "Healthcare", "Education", "Tech / Startup"]}
                  value={formData.category}
                  onChange={(val) => setFormData({...formData, category: val})}
                />
                
                <CustomDropdown 
                  label="Primary Goal"
                  options={["Lead Generation", "E-commerce Sales", "Portfolio / Branding"]}
                  value={formData.goal}
                  onChange={(val) => setFormData({...formData, goal: val})}
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Contact Number</label>
                <input 
                  required
                  type="text"
                  value={formData.contactNumber ? `+91 ${formData.contactNumber}` : "+91 "}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.startsWith("+91 ")) {
                      const digits = val.substring(4).replace(/\D/g, '').substring(0, 10);
                      setFormData({...formData, contactNumber: digits});
                    } else if (val === "+91") {
                      setFormData({...formData, contactNumber: ""});
                    }
                  }}
                  pattern="^\+91 [0-9]{10}$"
                  title="Please enter a valid 10-digit phone number."
                  className="w-full h-14 rounded-xl border border-zinc-800 bg-[#000] px-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)_inset]" 
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">About the Business</label>
                <textarea 
                  required
                  rows={4} 
                  value={formData.about} 
                  onChange={e => setFormData({...formData, about: e.target.value})} 
                  placeholder="What is your core offering and who is your target audience?"
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)_inset]" 
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Special Instructions (Optional)</label>
                <textarea 
                  rows={3} 
                  value={formData.instructions} 
                  onChange={e => setFormData({...formData, instructions: e.target.value})} 
                  placeholder="Any particular neon aesthetic requests?"
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)_inset]" 
                />
              </div>

              <div className="pt-4 border-t border-zinc-900">
                <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-black transition-all hover:bg-white shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-[1.02] uppercase tracking-widest text-sm animate-pulse-glow">
                  Continue to Review <ArrowLeft strokeWidth={3} className="rotate-180" size={16} />
                </button>
              </div>
            </form>
          </div>
        ) : step === 'review' ? (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-[-1px] leading-tight flex flex-wrap max-w-full">
                  Review & Confirm Order.
                </h1>
                <p className="mt-2 text-sm text-zinc-400 max-w-xl">
                  Please verify your project details before we lock it into the matrix. You can track process live via your dashboard.
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Step 2 of 2</span>
                <div className="mt-2 flex gap-1">
                  <div className="h-1 w-8 rounded-full bg-zinc-800 cursor-pointer" onClick={() => setStep('fill-form')} />
                  <div className="h-1 w-8 rounded-full bg-primary shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                </div>
              </div>
            </div>
            
            <div className="space-y-6 rounded-2xl border border-zinc-800 bg-[#0a0a0a]/50 p-6 sm:p-8 backdrop-blur-xl">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-zinc-900 pb-8">
                 <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[2px] text-zinc-600 mb-2">Website Name</h4>
                   <p className="text-white font-medium text-lg">{formData.title}</p>
                 </div>
                 <div>
                   <h4 className="text-[10px] font-bold uppercase tracking-[2px] text-zinc-600 mb-2">Primary Goal</h4>
                   <p className="text-white font-medium text-lg">{formData.goal}</p>
                 </div>
               </div>
               
                <div className="border-b border-zinc-900 pb-8 mt-6">
                 <h4 className="text-[10px] font-bold uppercase tracking-[2px] text-zinc-600 mb-2">Contact Number</h4>
                 <p className="text-zinc-300 text-sm leading-relaxed">+91 {formData.contactNumber}</p>
               </div>
               
               <div className="border-b border-zinc-900 pb-8 mt-6">
                 <h4 className="text-[10px] font-bold uppercase tracking-[2px] text-zinc-600 mb-2">Business Description</h4>
                 <p className="text-zinc-300 text-sm leading-relaxed">{formData.about}</p>
               </div>

               {formData.instructions && (
                 <div className="pb-4">
                   <h4 className="text-[10px] font-bold uppercase tracking-[2px] text-zinc-600 mb-2">Special Instructions</h4>
                   <p className="text-zinc-300 text-sm leading-relaxed">{formData.instructions}</p>
                 </div>
               )}

               <div className="pt-8">
                  <button 
                    onClick={handleOrderSubmit}
                    disabled={isSubmitting} 
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-5 font-bold text-black transition-all hover:bg-white disabled:opacity-50 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-[1.02] uppercase tracking-widest text-[15px]"
                  >
                    {isSubmitting ? "Saving..." : (
                      <>
                        Confirm & Order Website <Rocket size={20} className="ml-2" />
                      </>
                    )}
                  </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 max-w-2xl mx-auto text-center mt-12">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-primary/20 border border-primary flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.3)]">
                <MessageCircle size={32} className="text-primary" />
              </div>
            </div>
            
            <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-[-1px] leading-tight">
              One Last Step!
            </h1>
            <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
              Your order is drafted but <span className="text-white font-bold">inactive</span>. 
              To activate your project and alert our engineering team, you must send us the setup message on WhatsApp.
            </p>

            <div className="mt-12 space-y-4">
              <a 
                href={getWhatsAppUrl(orderData)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#25D366] px-8 py-5 font-bold text-black transition-all hover:bg-white shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-[1.02] uppercase tracking-widest text-[15px]"
              >
                1. SEND WHATSAPP MESSAGE <MessageCircle size={20} />
              </a>
              
              <button 
                onClick={handleVerifyConfirm}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-transparent px-8 py-5 font-bold text-zinc-400 transition-all hover:bg-zinc-900 hover:text-white disabled:opacity-50 uppercase tracking-widest text-[15px]"
              >
                {isSubmitting ? "Activating..." : (
                  <>
                    2. I HAVE SENT THE MESSAGE <CheckCircle2 size={20} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showRedirectPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex max-w-sm flex-col items-center text-center rounded-2xl border border-primary bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(34,211,238,0.5)]"
            >
              <div className="relative flex h-16 w-16 items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                <div className="absolute inset-2 rounded-full border-r-2 border-primary opacity-50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                <Rocket className="text-primary animate-pulse" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Drafting Order...</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Securing your spot in the queue.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
