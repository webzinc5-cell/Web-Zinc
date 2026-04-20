import { motion } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

export function PastWorksPage() {
  const portfolioItems = [
    {
      id: 1,
      title: "VALORÉ Clothing",
      category: "Premium E-commerce Experience",
      description: "A high-end fashion interface featuring luminescent design and seamless product navigation.",
      image: "https://via.placeholder.com/600x400/0a0a0a/22D3EE?text=VALOR%C3%89+Clothing",
      link: "https://valoreclothing.vercel.app"
    },
    {
      id: 2,
      title: "Apex Dental Clinic",
      category: "Healthcare",
      description: "Luminescent Healthcare UI/UX",
      image: "https://via.placeholder.com/600x400/0a0a0a/22D3EE?text=Apex+Dental+Clinic",
    },
    {
      id: 3,
      title: "Durgapur Tech Hub",
      category: "Enterprise Software",
      description: "Dark-Mode Enterprise Dashboard",
      image: "https://via.placeholder.com/600x400/0a0a0a/22D3EE?text=Durgapur+Tech+Hub",
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
            className="group relative flex flex-col rounded-[20px] bg-[#0a0a0a]/50 p-4 border border-white/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_15px_40px_-15px_rgba(34,211,238,0.3)] overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-black/50">
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 MixBlendMode-overlay mix-blend-overlay z-10" />
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 flex flex-col px-2">
              <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{item.title}</h3>
              {item.category && (
                <span className="text-primary text-[11px] font-bold tracking-widest uppercase mb-3 block">
                  {item.category}
                </span>
              )}
              <p className="text-zinc-500 text-sm font-medium mb-8 leading-relaxed max-w-[280px]">
                {item.description}
              </p>
              
              {/* Glowing Button */}
              {item.link ? (
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 py-4 text-sm font-bold tracking-[0.5px] text-primary transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] cursor-pointer uppercase"
                >
                  Live Site <ArrowUpRight size={18} />
                </a>
              ) : (
                <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 py-4 text-sm font-bold tracking-[0.5px] text-zinc-500 cursor-not-allowed uppercase">
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
