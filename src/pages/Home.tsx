import { motion } from "motion/react";
import { ReactNode, useState, useEffect } from "react";
import { MoveRight, PenTool, Rocket, Cpu, Star, ArrowUpRight } from "lucide-react";
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
      <section className="mx-auto flex w-full max-w-7xl flex-col md:flex-row justify-between items-start gap-12 px-6 pt-[80px] pb-24 md:pb-40 relative z-10">
        
        {/* Left Column (Content) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="flex flex-col items-start text-left order-1 md:max-w-[50%]"
        >
          <motion.div
            variants={fadeInUp}
            className="mb-8 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase border border-primary/20 glow-border"
          >
            Website Building Agency
          </motion.div>
          <motion.h1
            variants={fadeInUp}
            className="mb-6 text-[56px] md:text-[72px] font-[800] leading-[1] tracking-[-2px] md:tracking-[-4px]"
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
          <motion.div variants={fadeInUp} className="flex gap-[16px] w-full justify-start items-center">
            <button
              onClick={isLoggedIn ? () => navigate("/start") : onGetStarted}
              className="rounded-[4px] px-[36px] py-[16px] text-[14px] font-bold text-black bg-white uppercase tracking-[1px] border-none transition-all duration-300 ease-out shadow-[0_0_20px_rgba(34,211,238,0.6)] hover:shadow-[0_0_40px_rgba(34,211,238,1)] hover:scale-105 w-full sm:w-auto"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column (Image Asset) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="relative flex flex-col items-end justify-start order-2 w-full md:max-w-[50%] mt-10 md:mt-0"
        >
          {/* Main Cube Image */}
          <div className="relative w-full max-w-[280px] md:max-w-[350px]">
            <img 
              src="https://i.postimg.cc/hPVND3xM/IMG-20260422-153046.png" 
              alt="Luminescent Cube" 
              className="w-full h-auto relative z-10"
              style={{ filter: 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.4))' }}
            />
            {/* Ambient Cyan Background Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 blur-[100px] rounded-full z-0 pointer-events-none" />
          </div>
          
          {/* Subtle Ground Reflection */}
          <div className="w-[80%] max-w-[280px] md:max-w-[350px] h-[12px] mt-4 rounded-[100%] bg-primary/30 blur-[15px] pointer-events-none shadow-[0_0_40px_rgba(0,255,255,0.6)]" />
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="mx-auto flex w-full max-w-7xl flex-col items-start px-6 py-[100px] lg:px-20 border-t border-white/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="w-full flex flex-col items-start text-left"
        >
          <motion.div variants={fadeInUp} className="mb-10 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase border border-primary/20 glow-border w-fit">
            The Luminescent Process
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full"
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
        </motion.div>
      </section>

      {/* Portfolio Section */}
      <section className="mx-auto flex w-full max-w-7xl flex-col items-start px-6 py-[100px] lg:px-20 border-t border-white/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="w-full flex flex-col items-start text-left"
        >
          <motion.div variants={fadeInUp} className="mb-10 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase border border-primary/20 glow-border w-fit">
            Our Portfolio
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
             <PortfolioCard
               tag="PREMIUM E-COMMERCE EXPERIENCE"
               title="VALORÉ Clothing"
               description="A high-end fashion interface featuring luminescent design and seamless product navigation."
               link="https://valoreecommerce.vercel.app"
             />
             <PortfolioCard
               tag="CUTTING-EDGE TECH SOLUTIONS"
               title="Axon"
               description="A sleek, modern architectural site focused on technical precision and luminescent UI."
               link="https://axon-s-website.vercel.app/"
             />
          </motion.div>
          
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeInUp}
            className="flex justify-center w-full"
          >
            <Link to="/past-works">
              <button className="rounded px-8 py-4 text-[12px] font-extrabold text-[#000000] bg-[#00FFFF] border-none uppercase tracking-[2px] transition-all cursor-pointer animate-cyan-pulse hover:shadow-[0_0_35px_rgba(0,255,255,0.9)] hover:scale-105">
                View All Portfolio
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto flex w-full max-w-7xl flex-col items-start text-left px-6 py-[100px] lg:px-20 relative z-10 border-t border-white/5 bg-[#050505]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="flex flex-col items-start text-left w-full"
        >
          <motion.div variants={fadeInUp} className="mb-10 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase border border-primary/20 glow-border w-fit text-left">
            What Our Customers Say
          </motion.div>
          
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-2 mb-12">
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

          <motion.div variants={fadeInUp} className="flex justify-center w-full mt-6">
            <Link to="/reviews">
              <button className="cursor-pointer rounded-[4px] px-[30px] py-[14px] text-[12px] font-bold text-black bg-primary uppercase tracking-[2px] transition-all duration-300 ease-out shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.8)] hover:scale-105">
                See All Reviews
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section className="mx-auto flex w-full max-w-7xl flex-col items-start px-6 py-[100px] lg:px-20 relative z-10 border-t border-white/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="flex flex-col items-start text-left w-full"
        >
          <motion.div variants={fadeInUp} className="mb-10 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase border border-primary/20 glow-border w-fit text-left">
            About Us
          </motion.div>

          <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
            <div className="flex flex-col justify-center text-left">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">Pioneering Digital Excellence</h2>
              <p className="text-zinc-400 text-[18px] leading-relaxed mb-6">
                At WebZinc, we believe in high-contrast tactical deployment. Our mission is to propel local businesses into market dominance through luminescent digital strategies that captivate and convert.
              </p>
              <p className="text-zinc-400 text-[18px] leading-relaxed">
                We engineer more than just websites—we architect high-performance, precision-driven digital ecosystems tailored to outshine competitors and establish unshakeable authority in your sector.
              </p>
            </div>
            <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden border border-zinc-800 shadow-[0_0_30px_rgba(34,211,238,0.15)] glow-border">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
                alt="Cutting-Edge Tech Solution"
                className="w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00ffff]/20 to-transparent mix-blend-overlay pointer-events-none" />
            </div>
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
      className="group rounded-[12px] bg-[#111111] p-[30px] transition-all duration-300 border border-white/5 relative hover:bg-zinc-900 shadow-[0_0_15px_rgba(0,255,255,0.2)] hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]"
    >
      <div className="w-[8px] h-[8px] bg-primary rounded-full mb-[20px] shadow-[0_0_10px_rgba(34,211,238,1)] transition-shadow group-hover:shadow-[0_0_15px_rgba(34,211,238,1)]" />
      <h4 className="mb-[12px] text-[16px] uppercase tracking-[1px] font-bold text-white">{title}</h4>
      <p className="text-[13px] leading-relaxed text-zinc-400">{description}</p>
    </motion.div>
  );
}

function PortfolioCard({ tag, title, description, link }: { tag: string; title: string; description?: string; link: string }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="group flex flex-col justify-between p-8 rounded-[20px] bg-[#050505] transition-all duration-500 hover:-translate-y-2"
      style={{
        minHeight: '260px',
        border: '1px solid rgba(34, 211, 238, 0.2)',
        boxShadow: '0 0 15px rgba(34, 211, 238, 0.1)'
      }}
      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 25px rgba(34, 211, 238, 0.4)'}
      onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 211, 238, 0.1)'}
    >
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-white mb-2">{title}</h3>
        {tag && (
          <span className="text-primary text-[11px] font-bold tracking-widest uppercase mb-4 block">
            {tag}
          </span>
        )}
        {description && (
          <p className="text-zinc-400 text-[14px] font-medium mb-8 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {/* Glowing Button */}
      <div className="mt-auto">
        <a 
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 py-3 text-sm font-bold tracking-[0.5px] text-primary transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] cursor-pointer uppercase">
            Live Site <ArrowUpRight size={18} />
          </button>
        </a>
      </div>
    </motion.div>
  );
}
