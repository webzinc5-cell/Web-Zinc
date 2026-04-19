import { motion } from "motion/react";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Dr. Sarah Jenkins",
    company: "Apex Dental Clinic",
    content: "WebZinc completely restructured our client acquisition. Within 3 months, our local search visibility skyrocketed and we saw a 40% increase in high-value patient bookings.",
    rating: 5,
  },
  {
    name: "Marcus Thornton",
    company: "Thornton Legal Partners",
    content: "The level of precision and strategic depth WebZinc brings is unmatched. They don't just supply marketing, they build an impenetrable local presence.",
    rating: 5,
  },
  {
    name: "Elena Rostova",
    company: "Roast & Co.",
    content: "Our foot traffic has doubled since the new infrastructure deployed. The aesthetic is perfect, but the actual conversion metrics are what blew us away.",
    rating: 5,
  },
  {
    name: "David Chen",
    company: "Chen Auto Group",
    content: "Hard numbers. No fluff. WebZinc delivered exactly what they promised. We dominate the local search results for our most profitable services.",
    rating: 5,
  },
];

export function Reviews() {
  return (
    <div className="flex w-full flex-col pt-32 text-white pb-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-5xl">
            Client <span className="text-primary glow-text">Proof</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-400">
            Real outcomes from market leaders who deployed our infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-zinc-800 bg-zinc-card p-8 hover:bg-zinc-900 transition-colors"
            >
              <div className="mb-4 flex space-x-1">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                ))}
              </div>
              <p className="mb-6 text-lg italic text-zinc-300">"{review.content}"</p>
              <div>
                <p className="font-bold text-white">{review.name}</p>
                <p className="text-sm text-primary uppercase tracking-wider">{review.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
