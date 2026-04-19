import { motion } from "motion/react";
import { Users, Target, ShieldCheck } from "lucide-react";

export function About() {
  return (
    <div className="flex w-full flex-col pt-32 text-white pb-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase border border-primary/20 glow-border">
            Our Mission
          </div>
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight md:text-6xl">
            Architecting <span className="text-primary glow-text">Dominance</span>
          </h1>
          <p className="mb-16 max-w-2xl text-xl text-zinc-400 leading-relaxed">
            We are a collective of digital architects, data scientists, and conversion experts. 
            We do not build websites; we engineer high-performance conversion infrastructures 
            designed to systematically capture local market share.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              icon: <Users className="h-6 w-6 text-primary" />,
              title: "Elite Architects",
              desc: "Our team consists of top-tier talent with a singular focus on ROI and structural precision.",
            },
            {
              icon: <Target className="h-6 w-6 text-primary" />,
              title: "Hyper-Targeted",
              desc: "We don't do broad strokes. Every campaign is meticulously targeted to your ideal local demographic.",
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-primary" />,
              title: "Data Integrity",
              desc: "Complete transparency and rigorous data analysis back every decision we make.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-zinc-800 bg-zinc-card p-8 hover:bg-zinc-900 transition-colors"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded border border-zinc-800 bg-zinc-950 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                {item.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
