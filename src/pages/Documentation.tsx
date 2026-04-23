import { motion } from "motion/react";
import { BookOpen, CreditCard, Layers, Rocket, ChevronRight } from "lucide-react";
import { useState } from "react";

const DOCS = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Rocket,
    content: `
      Welcome to WebZinc. To begin your journey with us, follow these simple steps:
      1. Explore our portfolio in the "Works" section.
      2. Choose a project structure that fits your business needs.
      3. Use our real-time project funnel to provide your requirements.
      4. Our system will generate an initial architectural overview.
    `
  },
  {
    id: "payment-guide",
    title: "Payment Guide",
    icon: CreditCard,
    content: `
      WebZinc uses a transparent payment system:
      - We support both Direct Bank Transfers and UPI Payments.
      - 50% upfront payment is required to initiate the architectural phase.
      - Upon payment, visit our Payments portal and click the "Confirm Payment" button.
      - This will redirect you to our WhatsApp verification channel where you can share your receipt.
    `
  },
  {
    id: "project-workflow",
    title: "Project Workflow",
    icon: Layers,
    content: `
      Our workflow ensures precision at every step:
      - Phase 1: Requirement Gathering & Strategy.
      - Phase 2: Design & Prototyping.
      - Phase 3: Development & Quality Assurance.
      - Phase 4: Final Deployment & Handover.
      Every phase is tracked via our internal client dashboard.
    `
  }
];

export function DocumentationPage({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [activeSection, setActiveSection] = useState("getting-started");
  const isLight = theme === 'light';

  return (
    <div className={`min-h-screen pt-12 md:pt-20 pb-12 transition-colors duration-300 ${isLight ? 'bg-[#F8FAFC]' : 'bg-[#000000] text-white'}`}>
      <div className="mx-auto w-full max-w-[92%] md:max-w-6xl px-4">
        
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <BookOpen size={16} className="text-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[3px] text-primary">Technical Resources</span>
          </div>
          <h1 className={`text-2xl md:text-4xl font-black tracking-tight uppercase ${isLight ? 'text-slate-900' : 'text-white'}`}>Documentation</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col gap-2">
              {DOCS.map((doc) => {
                const Icon = doc.icon;
                const isActive = activeSection === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => {
                        setActiveSection(doc.id);
                        if (window.innerWidth < 768) {
                           document.getElementById(doc.id)?.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                    className={`flex items-center justify-between w-full p-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                      isActive 
                        ? (isLight ? 'bg-white border-primary/30 text-primary shadow-sm' : 'bg-primary/10 border-primary/30 text-primary')
                        : (isLight ? 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100' : 'bg-transparent border-transparent text-zinc-500 hover:text-white hover:bg-white/5')
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      {doc.title}
                    </div>
                    {isActive && <ChevronRight size={14} />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 max-w-3xl">
            <div className="space-y-12">
              {DOCS.map((doc) => (
                <motion.section 
                  key={doc.id}
                  id={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`scroll-mt-24 p-6 md:p-8 rounded-2xl border transition-all ${
                    isLight 
                      ? 'bg-white border-[#E2E8F0] shadow-sm' 
                      : 'bg-zinc-950/50 border-white/5'
                  } ${activeSection === doc.id ? 'border-primary/30' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-primary font-black opacity-30 text-2xl">#</span>
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-primary">{doc.title}</h2>
                  </div>
                  
                  <div className={`text-sm leading-relaxed space-y-4 whitespace-pre-line ${isLight ? 'text-slate-800' : 'text-zinc-300'}`}>
                    {doc.content}
                  </div>

                  <div className="mt-8 pt-6 border-t border-dashed border-white/5 flex gap-4">
                    <div className={`p-3 rounded-xl border flex-1 ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>Related Info</p>
                        <p className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>Contact support for deeper architectural queries.</p>
                    </div>
                  </div>
                </motion.section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
