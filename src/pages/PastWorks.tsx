import { motion } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

export function PastWorksPage() {
  const portfolioItems = [
    {
      id: 1,
      title: "VALORÉ Clothing",
      category: "Premium E-commerce Experience",
      description: "A high-end fashion interface featuring luminescent design and seamless product navigation.",
      link: "https://valoreclothing.vercel.app"
    },
    {
      id: 2,
      title: "Apex Dental Clinic",
      category: "Healthcare",
      description: "Luminescent Healthcare UI/UX",
    },
    {
      id: 3,
      title: "Durgapur Tech Hub",
      category: "Enterprise Software",
      description: "Dark-Mode Enterprise Dashboard",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-12 w-full max-w-7xl mx-auto flex flex-col items-center">
      <div className="w-full mb-8">
        <button 
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-[13px] font-bold tracking-widest uppercase cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-center max-w-3xl mb-20"
      >
        <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter uppercase mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          Past Works
        </h1>
        <p className="text-zinc-400 text-lg sm:text-xl font-medium tracking-wide">
          A showcase of our premium dark-mode aesthetic and luminescent web applications.
        </p>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
      >
        {portfolioItems.map((item) => (
          <motion.div 
            key={item.id}
            variants={fadeUp}
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
              <h3 className="text-2xl font-bold tracking-tight text-white mb-2">{item.title}</h3>
              {item.category && (
                <span className="text-primary text-[11px] font-bold tracking-widest uppercase mb-4 block">
                  {item.category}
                </span>
              )}
              <p className="text-zinc-400 text-[14px] font-medium mb-8 leading-relaxed">
                {item.description}
              </p>
            </div>
            
            {/* Glowing Button */}
            <div className="mt-auto">
              {item.link ? (
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 py-3 text-sm font-bold tracking-[0.5px] text-primary transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] cursor-pointer uppercase"
                >
                  Live Site <ArrowUpRight size={18} />
                </a>
              ) : (
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 py-3 text-sm font-bold tracking-[0.5px] text-zinc-500 cursor-not-allowed uppercase">
                  Coming Soon
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
