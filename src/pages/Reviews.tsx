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

export function Reviews() {
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
      console.error("Error listening to reviews:", error);
      // Run the handler outside the Firestore callback stack to prevent INTERNAL ASSERTION failures
      setTimeout(() => {
        handleFirestoreError(error, "list", "/reviews");
      }, 0);
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to the website to add reviews.");
      return;
    }
    if (!name || !experience || rating === 0) return;
    
    setIsSubmitting(true);
    try {
      const sentiment = getSentimentLabel(rating);
      await addDoc(collection(db, "reviews"), {
        name,
        email: user.email || null,
        uid: user.uid,
        experience,
        rating,
        sentiment,
        timestamp: serverTimestamp()
      });
      setName("");
      setExperience("");
      setRating(5);
      
      setSuccessMessage("Thank you for your review!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error adding review: ", error);
      handleFirestoreError(error, "create", "/reviews");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* Submit Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 mx-auto max-w-2xl rounded-xl border border-primary/30 bg-[#0a0a0a] p-8 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
        >
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-white">Leave a Review</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-400">Your Rating</label>
              <div className="flex gap-2">
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
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating || rating) 
                          ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
                          : "text-zinc-600"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-400">Your Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                disabled={!user}
                className="w-full rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-400">Your Experience</label>
              <textarea 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Share your results..."
                rows={4}
                disabled={!user}
                className="w-full resize-none rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            {successMessage && (
              <div className="rounded-md bg-primary/20 p-4 border border-primary/50 text-primary text-center font-bold tracking-wide">
                {successMessage}
              </div>
            )}

            <button 
              type="submit"
              disabled={isSubmitting || !user}
              onClick={(e) => {
                if (!user) {
                  e.preventDefault();
                  alert("Please login to the website to add reviews.");
                }
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-lg bg-primary text-black font-bold tracking-widest uppercase transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!user && <Lock size={18} />}
              {isSubmitting ? "Submitting..." : user ? "Submit Review" : "Login Required"}
            </button>
          </form>
        </motion.div>

        {/* Reviews List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.1, duration: 0.5 }}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-lg backdrop-blur-sm transition-all hover:border-zinc-700"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <Star 
                      key={j} 
                      className={`h-4 w-4 ${j < review.rating ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "text-zinc-700"}`} 
                    />
                  ))}
                </div>
                {/* AI Sentiment Label */}
                <span className="text-xs font-bold uppercase tracking-wider text-primary shadow-primary drop-shadow-[0_0_5px_rgba(34,211,238,0.3)]">
                  {review.sentiment || getSentimentLabel(review.rating)}
                </span>
              </div>
              <p className="mb-6 text-lg italic text-zinc-300">"{review.experience || review.content}"</p>
              <div>
                <p className="font-bold text-white">{review.name}</p>
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
