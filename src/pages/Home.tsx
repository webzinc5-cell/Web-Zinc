import { motion } from "motion/react";
import { ReactNode } from "react";
import { MoveRight, PenTool, Rocket, Cpu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export function Home({ onGetStarted, isLoggedIn }: { onGetStarted?: () => void, isLoggedIn?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="flex w-full flex-col pt-24 text-white relative">
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(34,211,238,0.08)_0%,transparent_70%)] z-0 pointer-events-none" />
      {/* Hero Section */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-8 px-6 py-24 lg:py-40 relative z-10 text-center">
        <motion.div
           className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[2px] -z-10 w-[300px] h-[350px] bg-gradient-to-br from-[#1a1a1a] to-[#000000] border border-primary/20 flex items-center justify-center -rotate-6 shadow-[0_0_60px_rgba(34,211,238,0.15)] [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]"
         >
           <div className="absolute inset-0 border-2 border-primary opacity-30 blur-[2px]" />
           <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
           </svg>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-8 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase border border-primary/20 glow-border"
          >
            Architectural Marketing Precision
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="mb-6 text-[72px] font-[800] leading-[0.95] tracking-[-4px]"
          >
            Dominate<br />
            Your Local<br />
            <span className="text-primary drop-shadow-[0_0_30px_rgba(34,211,238,0.4)]">Market</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="mb-10 max-w-[500px] text-[18px] text-white/60 leading-relaxed"
          >
            Harness luminescent digital strategies to ignite exponential growth and outshine your competitors.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-[16px] w-full justify-center">
            <button
              onClick={isLoggedIn ? () => navigate("/start") : onGetStarted}
              className="rounded-[4px] px-[36px] py-[16px] text-[14px] font-bold text-black bg-white uppercase tracking-[1px] border-none transition-all duration-300 ease-out shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_rgba(34,211,238,1)] hover:scale-105 w-full sm:w-auto mt-[40px]"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Bottom Sections Container */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-[30px] px-6 pb-10 lg:px-20 mx-auto max-w-7xl">
        {/* Process Section */}
        <div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-8"
          >
            <motion.div variants={fadeInUp} className="text-[10px] font-bold tracking-[2px] uppercase text-white/30 mb-[12px]">
              The Luminescent Process
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-[15px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <ProcessCard
              title="Analysis"
              description="Deep dive into your market mechanics."
            />
            <ProcessCard
              title="Strategy"
              description="High-contrast tactical deployment."
            />
            <ProcessCard
              title="Scale"
              description="Continuous glow and market growth."
            />
          </motion.div>
        </div>

        {/* Case Studies Section */}
        <div>
          <motion.div
            className="mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
             <motion.div variants={fadeInUp} className="text-[10px] font-bold tracking-[2px] uppercase text-white/30 mb-[12px]">
               Case Studies
             </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-[15px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <CaseStudyCard
               gradient="from-[#111] to-[#333] bg-gradient-to-tr"
               tag="HEALTHCARE"
               title="Apex Dental Clinic"
             />
             <CaseStudyCard
               gradient="from-[#111] to-[#333] bg-gradient-to-tl"
               tag="LIFESTYLE"
               title="Roast & Co."
             />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ProcessCard({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group rounded-[12px] bg-[#111111] p-[20px] transition-colors border border-white/5 relative hover:bg-zinc-900 hover:border-white/10"
    >
      <div className="w-[8px] h-[8px] bg-primary rounded-full mb-[15px] shadow-[0_0_10px_rgba(34,211,238,1)] transition-shadow group-hover:shadow-[0_0_15px_rgba(34,211,238,1)]" />
      <h4 className="mb-[8px] text-[13px] uppercase tracking-[1px] font-bold">{title}</h4>
      <p className="text-[11px] leading-[1.4] opacity-50">{description}</p>
    </motion.div>
  );
}

function CaseStudyCard({ gradient, tag, title }: { gradient: string; tag: string; title: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group relative h-[140px] w-full overflow-hidden rounded-[12px] bg-[#222] border border-white/10"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={`absolute inset-0 w-full h-full ${gradient} opacity-80`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-50" />
      <div className="absolute bottom-[15px] left-[15px]">
        <span className="mb-[4px] block text-[9px] font-[800] tracking-[1px] text-primary transition-all group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          {tag}
        </span>
        <h3 className="text-[14px] font-[700]">{title}</h3>
      </div>
    </motion.div>
  );
}
