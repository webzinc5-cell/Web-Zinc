import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, Lock } from "lucide-react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../lib/firebase";
import { handleFirestoreError } from "../lib/handleFirestoreError";

function getSentimentLabel(rating: number) {
  switch (rating) {
    case 5: return "Excellent";
    case 4: return "Great";
    case 3: return "Good";
    case 2: return "Bad";
    case 1: return "Worst";
    default: return "";
  }
}

export function Reviews({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setName(currentUser.displayName || currentUser.email || "");
      }
    });

    const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedReviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(fetchedReviews);
    }, (error) => {
      // Just log without triggering a UI crashing alert
      console.error("Error listening to reviews:", error);
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Please login to leave a review.");
      return;
    }
    if (!name || !experience || rating === 0) return;
    
    setIsSubmitting(true);
    try {
      const sentiment = getSentimentLabel(rating);
      await addDoc(collection(db, "reviews"), {
        name,
        email: currentUser.email || null,
        uid: currentUser.uid,
        userId: currentUser.uid,
        experience,
        rating,
        sentiment,
        timestamp: serverTimestamp()
      });
      setName("");
      setExperience("");
      setRating(5);
      
      setSuccessMessage("Review added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error adding review: ", error);
      handleFirestoreError(error, "create", "/reviews");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex w-full flex-col pt-16 md:pt-20 pb-12 md:pb-24 transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#F8FAFC]' : 'text-white'
    }`}>
      <div className="mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 md:mb-8"
        >
          <h1 className={`mb-6 text-4xl font-extrabold tracking-tight md:text-5xl ${
            theme === 'light' ? 'text-slate-900' : 'text-white'
          }`}>
            Client <span className="text-primary glow-text">Proof</span>
          </h1>
          <p className={`mx-auto max-w-2xl text-lg ${
            theme === 'light' ? 'text-slate-500' : 'text-zinc-400'
          }`}>
            Real outcomes from market leaders who deployed our infrastructure.
          </p>
        </motion.div>

        {/* Submit Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`mb-4 md:mb-8 mx-auto w-[95%] max-w-2xl rounded-xl border p-4 md:p-8 transition-all ${
            theme === 'light' 
              ? 'bg-white border-[#E2E8F0] shadow-xl' 
              : 'border-primary/30 bg-[#0a0a0a] shadow-[0_0_20px_rgba(34,211,238,0.15)]'
          }`}
        >
          <h2 className={`mb-4 md:mb-6 text-xl md:text-2xl font-bold tracking-tight ${
            theme === 'light' ? 'text-[#1E293B]' : 'text-white'
          }`}>Leave a Review</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
            <div>
              <label className={`mb-1 md:mb-2 block text-xs md:text-sm font-medium ${
                theme === 'light' ? 'text-slate-500' : 'text-zinc-400'
              }`}>Your Rating</label>
              <div className="flex gap-1 md:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none focus:scale-110 transition-transform"
                  >
                    <Star 
                      className={`h-6 w-6 md:h-8 md:w-8 transition-colors ${
                        star <= (hoverRating || rating) 
                          ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                          : theme === 'light' ? "text-slate-200" : "text-zinc-600"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-1 md:gap-2">
              <label className={`text-xs md:text-sm font-medium ${
                theme === 'light' ? 'text-slate-500' : 'text-zinc-400'
              }`}>Your Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={!user}
                className={`w-full rounded-md border p-2 md:p-3 text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-primary ${
                  theme === 'light' 
                    ? 'border-slate-200 bg-slate-50 text-[#0F172A] placeholder-slate-400 focus:border-primary' 
                    : 'border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:border-primary'
                }`}
                required
              />
            </div>

            <div className="flex flex-col gap-1 md:gap-2">
              <label className={`text-xs md:text-sm font-medium ${
                theme === 'light' ? 'text-slate-500' : 'text-zinc-400'
              }`}>Your Experience</label>
              <textarea 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Share your results..."
                rows={3}
                disabled={!user}
                className={`w-full resize-none rounded-md border p-2 md:p-3 text-sm md:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-primary ${
                  theme === 'light' 
                    ? 'border-slate-200 bg-slate-50 text-[#0F172A] placeholder-slate-400 focus:border-primary' 
                    : 'border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-500 focus:border-primary'
                }`}
                required
              />
            </div>

            {successMessage && (
              <div className="rounded-md bg-primary/20 p-2 md:p-4 border border-primary/50 text-primary text-center font-bold tracking-wide text-xs md:text-base">
                {successMessage}
              </div>
            )}

            <div className="flex justify-center md:justify-start">
              <button 
                type="submit"
                disabled={isSubmitting || !user}
                onClick={(e) => {
                  if (!auth.currentUser) {
                    e.preventDefault();
                    alert("Please login to leave a review.");
                  }
                }}
                className="mt-1 w-full md:w-auto md:px-12 flex items-center justify-center gap-2 py-3 md:py-4 rounded-lg bg-primary text-black font-bold tracking-widest uppercase transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
              >
                {!user && <Lock size={16} />}
                {isSubmitting ? "Submitting..." : user ? "Submit Review" : "Login Required"}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Reviews List */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.1, duration: 0.5 }}
              className={`rounded-xl border p-3 md:p-8 flex flex-col justify-between transition-all duration-300 h-auto min-h-[120px] overflow-visible ${
                theme === 'light' 
                  ? 'bg-white border-[#E2E8F0] shadow-md hover:shadow-lg' 
                  : 'bg-zinc-900/40 border-zinc-800 backdrop-blur-sm hover:border-zinc-700 shadow-lg'
              }`}
            >
              <div className="mb-2 md:mb-4 flex items-center justify-between flex-wrap gap-1">
                <div className="flex space-x-0.5 md:space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <Star 
                      key={j} 
                      className={`h-3 w-3 md:h-4 md:w-4 ${
                        j < review.rating 
                          ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                          : theme === 'light' ? "text-slate-100" : "text-zinc-700"}`} 
                    />
                  ))}
                </div>
                {/* AI Sentiment Label */}
                <span className={`text-[8px] md:text-xs font-bold uppercase tracking-wider ${
                  theme === 'light' ? 'text-primary' : 'text-primary drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]'
                }`}>
                  {review.sentiment || getSentimentLabel(review.rating)}
                </span>
              </div>
              <p className={`mb-3 md:mb-6 text-[10px] md:text-lg italic leading-relaxed ${
                theme === 'light' ? 'text-[#1E293B]' : 'text-zinc-300'
              }`}>
                "{review.experience || review.content}"
              </p>
              <div>
                <p className={`font-bold text-xs md:text-base flex items-center gap-1.5 ${
                  theme === 'light' ? 'text-[#0F172A]' : 'text-white'
                }`}>
                  <span className="md:hidden w-1 h-1 bg-primary rounded-full" />
                  <span className="truncate">{review.name}</span>
                </p>
              </div>
            </motion.div>
          ))}
          {reviews.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-500">
              No reviews available yet. Be the first to leave one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
