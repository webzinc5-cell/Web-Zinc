import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, ShieldCheck, Copy, Check, Info, Sparkles, Zap, Globe, ShieldCheck as VerifiedIcon, Flame } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    id: "monthly",
    name: "Starter Pro (Monthly)",
    price: "₹799",
    originalPrice: "₹999",
    discount: "20% OFF",
    period: "/ month",
    description: "Ideal for fast launches, local business portfolios, and high-conversion landing pages.",
    features: [
      "24/7 customer service",
      "10 customisation per month",
      "Full SEO strategy and optimization",
      "24/7 site maintenance and optimization",
      "Domain hosting and Deployment",
      "Provide site analytics every month",
      "Custom reminders for better results"
    ],
    badge: "Special Discount",
    icon: Zap
  },
  {
    id: "yearly",
    name: "Ultimate Growth (Yearly)",
    price: "₹9,999",
    originalPrice: "₹11,999",
    discount: "16% OFF",
    period: "/ year",
    description: "The complete setup for business growth, steady continuous updates, and priority hosting.",
    features: [
      "24/7 customer service",
      "120 customisation per year",
      "Full SEO strategy and optimization",
      "24/7 site maintenance and optimization",
      "Domain hosting and Deployment",
      "Provide site analytics every month",
      "Custom reminders for better results"
    ],
    badge: "Best Value",
    icon: Flame
  },
  {
    id: "custom",
    name: "Enterprise Tailored (Custom)",
    price: "Custom",
    period: "",
    description: "For massive custom database architectures, custom backends, and bespoke API portals.",
    features: [
      "Contact us to discuss about your plan and build the best plan for your business."
    ],
    badge: "Unlimited Scale",
    icon: Sparkles
  }
];

export function PaymentsPage({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");

  // Modal and Form states
  const [activeModalPlan, setActiveModalPlan] = useState<any | null>(null);
  const [modalStep, setModalStep] = useState<'form' | 'confirm_whatsapp' | 'success_delay' | null>(null);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formInstructions, setFormInstructions] = useState("");

  const handleOpenPlanModal = (plan: any) => {
    setActiveModalPlan(plan);
    setModalStep('form');
  };

  const handleConfirmPlanSelection = () => {
    if (!formName.trim() || !formPhone.trim()) return;

    const planDetails = `${activeModalPlan?.name} (${activeModalPlan?.price}${activeModalPlan?.period || ""})`;
    const textMessage = `Hello WebZinc, I want to confirm my plan selection:
- Plan: ${planDetails}
- Name: ${formName}
- Contact Number: +91 ${formPhone}
- Special Instructions: ${formInstructions || "None"}`;

    const url = `https://wa.me/919091063123?text=${encodeURIComponent(textMessage)}`;
    window.open(url, '_blank');
    setModalStep('confirm_whatsapp');
  };

  const handleSendAgain = () => {
    if (!activeModalPlan) return;
    const planDetails = `${activeModalPlan.name} (${activeModalPlan.price}${activeModalPlan.period || ""})`;
    const textMessage = `Hello WebZinc, I want to confirm my plan selection:
- Plan: ${planDetails}
- Name: ${formName}
- Contact Number: +91 ${formPhone}
- Special Instructions: ${formInstructions || "None"}`;

    const url = `https://wa.me/919091063123?text=${encodeURIComponent(textMessage)}`;
    window.open(url, '_blank');
  };

  const handleConfirmSend = () => {
    setModalStep('success_delay');
    setTimeout(() => {
      setModalStep(null);
      setFormName("");
      setFormPhone("");
      setFormInstructions("");
      navigate("/");
    }, 5000);
  };

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
  const currentPlan = PLANS.find(p => p.id === selectedPlan) || PLANS[0];

  return (
    <div className={`min-h-screen pt-16 md:pt-24 pb-12 transition-colors duration-300 ${isLight ? 'bg-[#F8FAFC]' : 'bg-[#000000] text-white'}`}>
      <div className="mx-auto w-full max-w-[92%] md:max-w-6xl px-2 md:px-6">
        
        {/* Navigation Header */}
        <div className="mb-8 flex items-center justify-between">
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

        {/* Pricing Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <span className="text-xs font-black uppercase tracking-[3px] text-primary block mb-2">Our Plans & Pricing</span>
          <h1 className={`text-3xl md:text-5xl font-black tracking-tight mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Flexible, Premium Solutions
          </h1>
          <p className={`text-xs md:text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Choose the subscription tier that matches your business model. Select a plan below to unlock secure gateway payment routing.
          </p>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-10 md:gap-14"
        >
          {/* Subscription Plans Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              return (
                <motion.div
                  key={plan.id}
                  variants={itemVariants}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`rounded-2xl border p-5 md:p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer relative ${
                    isSelected 
                      ? isLight 
                        ? 'bg-white border-primary ring-2 ring-primary/40 shadow-xl scale-[1.01]' 
                        : 'bg-zinc-950 border-primary ring-2 ring-primary/30 shadow-[0_0_20px_rgba(34,211,238,0.15)] scale-[1.01]'
                      : isLight
                        ? 'bg-white/80 border-[#E2E8F0] hover:border-slate-300 shadow-sm hover:scale-[1.005]'
                        : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700/80 hover:scale-[1.005]'
                  }`}
                >
                  {/* Top Header details inside the plan */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        isSelected 
                          ? 'bg-primary/25 text-primary' 
                          : isLight ? 'bg-slate-100 text-slate-500' : 'bg-zinc-900 text-zinc-400'
                      }`}>
                        {plan.badge}
                      </span>
                      <Icon size={18} className={isSelected ? 'text-primary' : isLight ? 'text-slate-400' : 'text-zinc-500'} />
                    </div>

                    <h3 className={`text-lg md:text-xl font-bold tracking-tight mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {plan.name}
                    </h3>
                    
                    <p className={`text-[11px] md:text-xs leading-relaxed mb-5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      {plan.description}
                    </p>

                    {/* Price Block */}
                    <div className="mb-6 flex flex-col">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl md:text-4xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className={`text-xs font-semibold ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                            {plan.period}
                          </span>
                        )}
                      </div>
                      
                      {/* Optional Original Price & Discount Display */}
                      {plan.originalPrice && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className={`text-xs line-through ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                            {plan.originalPrice}
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 uppercase tracking-wider">
                            {plan.discount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Features Divider & List */}
                    <div className={`h-[1px] w-full my-4 ${isLight ? 'bg-slate-100' : 'bg-zinc-900'}`} />
                    
                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 size={14} className="text-primary shrink-0 mt-0.5" />
                          <span className={isLight ? 'text-slate-600' : 'text-zinc-300'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Dynamic Selection Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPlanModal(plan);
                    }}
                    className={`w-full py-2.5 md:py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-black shadow-md hover:opacity-90'
                        : isLight 
                          ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' 
                          : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    {isSelected ? "Plan Selected" : "Select Plan"}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Secure Payment Terminals Section */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto mb-6">
              <span className="text-[10px] font-black uppercase tracking-[3px] text-primary block mb-1">Step 2: Checkout Portal</span>
              <h2 className={`text-xl md:text-2xl font-bold tracking-tight ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Secure Checkout
              </h2>
              <p className={`text-[11px] md:text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Scan the UPI QR Code or complete a Direct Bank Transfer for the payment.
              </p>
            </div>

            {/* Gateways Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              {/* BOX 1: Bank Transfer */}
              <motion.div 
                variants={itemVariants}
                className={`rounded-2xl border p-4 md:p-6 transition-all duration-300 flex flex-col ${
                  isLight 
                    ? 'bg-white border-[#E2E8F0] shadow-md' 
                    : 'bg-zinc-950 border-zinc-800/80 shadow-[0_0_20px_rgba(34,211,238,0.05)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                    <VerifiedIcon size={16} className="text-primary" />
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
                    ? 'bg-white border-[#E2E8F0] shadow-md' 
                    : 'bg-zinc-950 border-zinc-800/80 shadow-[0_0_20px_rgba(34,211,238,0.05)]'
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
                      alt="WebZinc Payment Gateway - Official Merchant QR Code" 
                      width="180"
                      height="180"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover rounded-lg img-fade-in" 
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
          </div>

          {/* Action Button Section */}
          <motion.div variants={itemVariants} className="w-full space-y-6">
            <div className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
              isLight ? 'bg-indigo-50 border-indigo-100' : 'bg-primary/5 border border-primary/10'
            }`}>
               <Info size={20} className="text-primary shrink-0" />
               <p className={`text-xs md:text-sm font-medium leading-relaxed ${isLight ? 'text-indigo-900' : 'text-zinc-300'}`}>
                 Verification process: After completing the transfer, click the button below to confirm your chosen subscription ({currentPlan.name}) via WhatsApp with our official desk.
               </p>
            </div>

            <button 
              onClick={() => {
                const textMessage = `Hello WebZinc, I'm interested in the ${currentPlan.name} (${currentPlan.price === "Custom" ? "Custom Inquiries" : `${currentPlan.price}${currentPlan.period}`}). I have made a transfer / would like to prioritize my subscription.`;
                const url = `https://wa.me/919091063123?text=${encodeURIComponent(textMessage)}`;
                window.open(url, '_blank');
              }}
              className={`flex items-center justify-center gap-3 w-full py-4 md:py-6 rounded-2xl text-xs md:text-sm font-black uppercase tracking-[3px] transition-all cursor-pointer ${
                isLight 
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg' 
                  : 'bg-primary text-black hover:scale-[1.01] active:scale-[0.98] shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.7)]'
              }`}
            >
              {currentPlan.price === "Custom" ? "Inquire Custom Plan (WhatsApp)" : `Confirm ${currentPlan.name} (WhatsApp)`}
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

      {/* Interactive Modal Flow */}
      {modalStep !== null && (
        <div id="plan-selection-modal-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <motion.div
            id="plan-selection-modal-container"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`w-full max-w-md rounded-2xl border p-6 md:p-8 shadow-2xl relative ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-zinc-950 border-zinc-800 text-white'
            }`}
          >
            {modalStep === 'form' && (
              <div id="modal-step-form" className="space-y-6">
                <div>
                  <span id="modal-badge-step" className="text-[10px] font-black uppercase tracking-[3px] text-primary block mb-1">
                    Step 1 of 2
                  </span>
                  <h3 id="modal-title-confirm" className="text-xl font-bold tracking-tight">
                    Confirm Plan Selection
                  </h3>
                  <p id="modal-subtitle-plan" className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    You are subscribing to <strong className="text-primary">{activeModalPlan?.name}</strong> ({activeModalPlan?.price}{activeModalPlan?.period || ""}).
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="user-name-input" className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <span className={`text-[9px] font-medium ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                        {formName.length}/25
                      </span>
                    </div>
                    <input
                      id="user-name-input"
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formName}
                      maxLength={25}
                      onChange={(e) => setFormName(e.target.value.slice(0, 25))}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border outline-none transition-all ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400 focus:bg-white'
                          : 'bg-zinc-900/50 border-zinc-800 text-white focus:border-zinc-700 focus:bg-zinc-900'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="user-phone-input" className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <span className={`text-[9px] font-medium ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                        {formPhone.length}/10
                      </span>
                    </div>
                    <div className={`flex items-center rounded-xl border overflow-hidden transition-all focus-within:ring-2 focus-within:ring-primary/30 ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 focus-within:border-slate-400'
                        : 'bg-zinc-900/50 border-zinc-800 focus-within:border-zinc-700'
                    }`}>
                      <span className={`px-3 py-2.5 text-xs font-bold border-r border-dashed shrink-0 select-none ${
                        isLight 
                          ? 'text-slate-500 border-slate-200 bg-slate-100/50' 
                          : 'text-zinc-400 border-zinc-800 bg-zinc-900/50'
                      }`}>
                        +91
                      </span>
                      <input
                        id="user-phone-input"
                        type="tel"
                        required
                        placeholder="Enter 10-digit mobile number"
                        value={formPhone}
                        maxLength={10}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/\D/g, "");
                          setFormPhone(cleaned.slice(0, 10));
                        }}
                        className={`w-full px-3.5 py-2.5 text-xs font-medium outline-none bg-transparent ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="user-instructions-input" className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                        Special Instructions <span className={`text-[9px] font-normal lowercase ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>(optional)</span>
                      </label>
                      <span className={`text-[9px] font-medium ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                        {formInstructions.length}/400
                      </span>
                    </div>
                    <textarea
                      id="user-instructions-input"
                      placeholder="Any specific layout, pages, or features you want to outline..."
                      rows={3}
                      value={formInstructions}
                      maxLength={400}
                      onChange={(e) => setFormInstructions(e.target.value.slice(0, 400))}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border outline-none transition-all resize-none ${
                        isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-slate-400 focus:bg-white'
                          : 'bg-zinc-900/50 border-zinc-800 text-white focus:border-zinc-700 focus:bg-zinc-900'
                      }`}
                    />
                  </div>
                </div>

                <div id="modal-note-box" className={`p-3 rounded-xl text-[11px] leading-relaxed border ${
                  isLight ? 'bg-amber-50/50 border-amber-100 text-amber-900' : 'bg-amber-500/5 border-amber-500/10 text-amber-200/90'
                }`}>
                  <span className="font-extrabold uppercase tracking-wider text-[9px] block mb-0.5 text-amber-500">Note</span>
                  click the confirm plan selection button and send the information to our whatsapp
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    id="modal-btn-back"
                    onClick={() => {
                      setModalStep(null);
                    }}
                    className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    id="modal-btn-confirm"
                    disabled={!formName.trim() || !formPhone.trim()}
                    onClick={handleConfirmPlanSelection}
                    className="py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all bg-primary text-black shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    Confirm Plan Selection
                  </button>
                </div>
              </div>
            )}

            {modalStep === 'confirm_whatsapp' && (
              <div id="modal-step-whatsapp" className="space-y-6 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                  <Globe size={24} />
                </div>
                
                <div>
                  <h3 id="modal-whatsapp-title" className="text-xl font-bold tracking-tight">
                    confirm all information sent to our whatsapp
                  </h3>
                  <p className={`text-xs mt-2 leading-relaxed ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    If WhatsApp has opened in another tab, please make sure you hit the &quot;Send&quot; button in your WhatsApp app or web portal. 
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    id="modal-btn-confirm-send"
                    onClick={handleConfirmSend}
                    className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest bg-primary text-black shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                  >
                    Confirm Send
                  </button>
                  <button
                    id="modal-btn-send-again"
                    onClick={handleSendAgain}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80'
                    }`}
                  >
                    Send Again
                  </button>
                </div>
              </div>
            )}

            {modalStep === 'success_delay' && (
              <div id="modal-step-success" className="space-y-6 text-center py-8">
                <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 360] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
                  />
                  <Sparkles size={32} className="text-primary relative z-10" />
                </div>

                <div className="space-y-2">
                  <h3 id="success-header-title" className="text-xl font-black tracking-tight text-primary uppercase">
                    Plan Confirmed
                  </h3>
                  <p id="success-status-text" className={`text-xs md:text-sm font-semibold leading-relaxed px-4 ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                    your plan has been confirmed we will contact you shortly
                  </p>
                </div>

                <div className="pt-2">
                  <div className={`h-1 w-24 mx-auto rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-zinc-900'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider block mt-3 ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>
                    Redirecting to home in a few seconds...
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
