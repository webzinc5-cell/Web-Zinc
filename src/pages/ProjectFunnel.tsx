import React, { useState, FormEvent, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { ArrowLeft, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function ProjectFunnel({ userProjects = [], setUserProjects }: any) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'fill-form' | 'review'>('fill-form');
  const [formData, setFormData] = useState({
    title: "",
    category: "Tech",
    about: "",
    goal: "Lead Gen",
    instructions: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
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

  const sendWhatsAppNotification = (data: any) => {
    const message = `🚀 *New WebZinc Order!* 🚀

*Website Name:* ${data.title}
*Category:* ${data.category}
*About:* ${data.about}
*Instructions:* ${data.instructions || 'None'}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919641553429?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
        about: formData.about,
        status: "Pending Review",
        timestamp: serverTimestamp(),
        // Keep these so the Dashboard UI still binds correctly
        id: Date.now().toString(),
        title: formData.title,
        progress: 0,
        date: new Date().toISOString().split('T')[0],
        goal: formData.goal,
        instructions: formData.instructions
      };

      // 1. Save data to Firestore first within the nested user path as per security rules
      await addDoc(collection(db, "users", user.uid, "projects"), newOrderInfo);

      // 2. ONLY update local state mapped to dashboard after database confirms success
      if (setUserProjects) {
        setUserProjects([...userProjects, newOrderInfo]);
      }

      // 3. Trigger Modal and Modal Timout for Redirect (Only happens if addDoc succeeds)
      setShowRedirectModal(true);

      timeoutRef.current = setTimeout(() => {
        sendWhatsAppNotification(newOrderInfo);
        setIsSubmitting(false);
        setShowRedirectModal(false);
        navigate("/profile");
      }, 3000);

    } catch (error) {
      alert(`Error processing your order: ${(error as Error).message}`);
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
            <div>
              <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-[-1px] leading-tight flex flex-wrap max-w-full">
                Let's launch something brilliant.
              </h1>
              <p className="mt-2 text-sm text-zinc-400 max-w-xl">
                Provide us with the foundational details of your upcoming website. This helps us blueprint a luminescent digital strategy tailored exactly to your brand.
              </p>
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
                  className="w-full rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Business Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full rounded-xl border border-zinc-800 bg-[#000] p-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none"
                  >
                    <option value="Tech">Tech / Startup</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Retail">Retail & E-Commerce</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Primary Goal</label>
                  <select 
                    value={formData.goal} 
                    onChange={e => setFormData({...formData, goal: e.target.value})}
                    className="w-full rounded-xl border border-zinc-800 bg-[#000] p-4 text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none"
                  >
                    <option value="Lead Gen">Lead Generation</option>
                    <option value="E-commerce">E-commerce Sales</option>
                    <option value="Portfolio">Portfolio / Branding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">About the Business</label>
                <textarea 
                  required
                  rows={4} 
                  value={formData.about} 
                  onChange={e => setFormData({...formData, about: e.target.value})} 
                  placeholder="What is your core offering and who is your target audience?"
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Special Instructions (Optional)</label>
                <textarea 
                  rows={3} 
                  value={formData.instructions} 
                  onChange={e => setFormData({...formData, instructions: e.target.value})} 
                  placeholder="Any particular neon aesthetic requests?"
                  className="w-full resize-none rounded-xl border border-zinc-800 bg-[#000] p-4 text-white placeholder-zinc-600 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]" 
                />
              </div>

              <div className="pt-4 border-t border-zinc-900">
                <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-black transition-all hover:bg-white shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] hover:scale-[1.02] uppercase tracking-widest text-sm">
                  Continue to Review <ArrowLeft strokeWidth={3} className="rotate-180" size={16} />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-[-1px] leading-tight flex flex-wrap max-w-full">
                Review & Confirm Order.
              </h1>
              <p className="mt-2 text-sm text-zinc-400 max-w-xl">
                Please verify your project details before we lock it into the matrix. You can track process live via your dashboard.
              </p>
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
               
               <div className="border-b border-zinc-900 pb-8">
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
                  {isSubmitting ? "Processing..." : (
                    <>
                      Confirm & Order Website <Rocket size={20} className="ml-2" />
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] uppercase tracking-widest text-zinc-500 mt-4">
                  You will be redirected to WhatsApp to finalize the consultation.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showRedirectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex max-w-sm flex-col items-center text-center rounded-2xl border border-primary/40 bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(34,211,238,0.15)]"
            >
              <div className="relative flex h-16 w-16 items-center justify-center mb-6">
                <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                <div className="absolute inset-2 rounded-full border-r-2 border-primary opacity-50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                <Rocket className="text-primary animate-pulse" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Preparing your order...</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                You will be redirected to WhatsApp for final confirmation.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
