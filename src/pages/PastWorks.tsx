import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

interface ProjectItem {
  id: number;
  title: string;
  category: string;
  description: string;
  link?: string;
}

export function PastWorksPage() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Cleanup effect to prevent 404s and leftover state on unmount
  useEffect(() => {
    return () => {
      setSelectedProject(null);
    };
  }, []);

  const portfolioItems: ProjectItem[] = [
    {
      id: 1,
      title: "VALORÉ Clothing",
      category: "Premium E-commerce Experience",
      description: "A high-end fashion interface featuring luminescent design and seamless product navigation.",
      link: "https://valoreclothing.vercel.app"
    },
    {
      id: 2,
      title: "Cake Delights",
      category: "Gourmet Bakery Experience",
      description: "A delightful, high-performance interface designed for local culinary branding.",
      link: "https://cakedelights.vercel.app"
    },
    {
      id: 3,
      title: "Axon",
      category: "Cutting-edge Tech Solutions",
      description: "A sleek, modern architectural site focused on technical precision and luminescent UI.",
      link: "https://axon-s-website.vercel.app"
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
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(item);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/5 py-3 text-sm font-bold tracking-[0.5px] text-primary transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] cursor-pointer uppercase"
                >
                  Live Site <ArrowUpRight size={18} />
                </button>
              ) : (
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 py-3 text-sm font-bold tracking-[0.5px] text-zinc-500 cursor-not-allowed uppercase">
                  Coming Soon
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Redirect Confirmation Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setSelectedProject(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0a0a0a] rounded-[20px] p-8 flex flex-col items-center text-center outline-none"
              style={{
                border: '1px solid rgba(34, 211, 238, 0.3)',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)'
              }}
            >
              <h2 className="text-3xl font-[900] text-white mb-2 tracking-tight">{selectedProject.title}</h2>
              <span className="text-primary text-[11px] font-bold tracking-widest uppercase mb-4 block drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                {selectedProject.category}
              </span>
              <p className="text-zinc-400 text-[14px] font-medium mb-6 leading-relaxed">
                {selectedProject.description}
              </p>
              
              <div className="w-full h-[1px] bg-white/10 mb-6" />
              
              <p className="text-white text-sm font-bold tracking-wide leading-relaxed mb-8">
                You are now being redirected to our external portfolio site. Would you like to proceed?
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const targetLink = selectedProject.link;
                    // Reset state immediately before navigation
                    setSelectedProject(null);
                    // Use replace to prevent browser history loop
                    if (targetLink) {
                      window.location.replace(targetLink);
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 py-4 text-sm font-bold tracking-[0.5px] text-primary transition-all duration-300 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] cursor-pointer uppercase"
                >
                  View Website <ArrowUpRight size={18} />
                </button>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full py-4 rounded-lg border border-zinc-700 bg-transparent text-zinc-400 text-sm font-bold tracking-[0.5px] uppercase transition-all duration-300 hover:border-white hover:text-white"
                >
                  Go Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
