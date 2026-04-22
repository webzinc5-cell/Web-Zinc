import { motion } from "motion/react";
import { ReactNode, useState, useEffect } from "react";
import { MoveRight, PenTool, Rocket, Cpu, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

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
  const [latestReviews, setLatestReviews] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"), limit(3));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const revs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLatestReviews(revs);
    }, (error) => {
      console.error("Error fetching homepage reviews:", error);
    });
    return () => unsubscribe();
  }, []);

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

        {/* Portfolio Section */}
        <div className="flex flex-col">
          <motion.div
            className="mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
             <motion.div variants={fadeInUp} className="text-[10px] font-bold tracking-[2px] uppercase text-white/30 mb-[12px]">
               Our Portfolio
             </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <PortfolioCard
               gradient="from-[#051115] to-[#0A1A22]"
               tag="TRAVEL"
               title="Himachal Wonders"
               description="A premium travel agency experience with liquid glass aesthetics."
             />
             <PortfolioCard
               gradient="from-[#0A0515] to-[#110A22]"
               tag="AGENCY"
               title="WebZinc Agency"
               description="Our official luminescent marketing platform."
             />
          </motion.div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp}
            className="flex sm:justify-end"
          >
            <Link to="/past-works">
              <button className="rounded px-6 py-3 text-[11px] font-bold text-white border border-primary/50 uppercase tracking-[2px] transition-all hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] cursor-pointer">
                View All Portfolio
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 py-20 lg:px-20 text-center relative z-10 border-t border-white/5 bg-[#050505]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="flex flex-col items-center w-full"
        >
          <motion.div variants={fadeInUp} className="mb-4 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase border border-primary/20 glow-border">
            What Our Customers Say
          </motion.div>
          
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12 mb-12 text-left">
            {latestReviews.map((review, idx) => (
              <div 
                key={review.id || idx}
                className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-lg backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] group"
              >
                <div>
                  <div className="mb-4 flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < (review.rating || 5) ? "fill-primary text-primary transition-all group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "text-zinc-700"}`} 
                      />
                    ))}
                  </div>
                  <p className="mb-6 text-[15px] italic text-zinc-400 leading-relaxed line-clamp-4">
                    "{review.experience || review.content}"
                  </p>
                </div>
                <div>
                  <p className="font-bold text-white text-[14px]">{review.name}</p>
                  {review.sentiment && (
                    <p className="text-[10px] uppercase tracking-widest text-primary/70 mt-1">{review.sentiment}</p>
                  )}
                </div>
              </div>
            ))}
            {latestReviews.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-500">
                Loading reviews...
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Link to="/reviews">
              <button className="cursor-pointer rounded-[4px] px-[30px] py-[14px] text-[12px] font-bold text-black bg-primary uppercase tracking-[2px] transition-all duration-300 ease-out shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.8)] hover:scale-105">
                See All Reviews
              </button>
            </Link>
          </motion.div>
        </motion.div>
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

function PortfolioCard({ gradient, tag, title, description }: { gradient: string; tag: string; title: string; description?: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group relative h-[180px] w-full overflow-hidden rounded-[12px] bg-[#222] border border-zinc-800 transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={`absolute inset-0 w-full h-full bg-gradient-to-tr ${gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90" />
      <div className="absolute bottom-[15px] left-[15px] right-[15px]">
        <span className="mb-[4px] block text-[9px] font-[800] tracking-[1px] text-primary transition-all group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          {tag}
        </span>
        <h3 className="text-[16px] font-[800] mb-1">{title}</h3>
        {description && (
          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-300 transition-colors">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
