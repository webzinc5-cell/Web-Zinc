import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [view, setView] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (view === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        try {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            businessName: businessName,
            createdAt: serverTimestamp(),
          });
        } catch (err) {
          // Could not create Firestore user doc (rules issue). Proceeding anyway.
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
      navigate("/profile");
    } catch (error: any) {
      setErrorMsg(error.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            businessName: user.displayName || "Google User",
            createdAt: serverTimestamp(),
          });
        }
      } catch (err) {
         // Could not read/write Firestore user doc (rules issue). Proceeding anyway.
      }

      onClose();
      navigate("/profile");
    } catch (error: any) {
      setErrorMsg(error.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 30 : -30, opacity: 0 }),
  };

  const direction = view === 'signup' ? -1 : 1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-[#000000bf] backdrop-blur-xl"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.3 }}
              className="relative w-full max-w-md pointer-events-auto flex flex-col rounded-2xl border border-primary/30 bg-zinc-950/80 p-6 md:p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)] max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-6 flex items-center justify-between z-10 w-full shrink-0">
                <h2 className="text-2xl font-bold text-white">
                  {view === 'signup' ? "Join WebZinc" : "Welcome Back"}
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={view}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                  className="flex flex-col w-full shrink-0"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {errorMsg && (
                        <div className="rounded border border-red-500/50 bg-red-500/10 p-3 text-xs text-red-500 font-medium">
                          {errorMsg}
                        </div>
                      )}
                      {view === 'signup' && (
                      <div>
                          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            Business Name
                          </label>
                          <input
                            type="text"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-3 text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            placeholder="Enter business name"
                          />
                        </div>
                      )}
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Secure Email ID
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-3 text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                          placeholder="Enter secure email"
                        />
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                            {view === 'signup' ? 'Create Password' : 'Password'}
                          </label>
                          {view === 'login' && (
                            <button type="button" className="text-xs font-medium text-primary hover:text-white transition-colors">
                              Forgot Password?
                            </button>
                          )}
                        </div>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 p-3 text-white placeholder-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-none focus:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                          placeholder="••••••••"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 flex w-full justify-center rounded-lg bg-primary py-3 font-bold text-black transition-colors hover:bg-primary/90 disabled:opacity-50"
                      >
                        {isLoading ? "Authenticating..." : (view === 'signup' ? "Create Account" : "Sign In")}
                      </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
                      <div className="h-px flex-1 bg-zinc-800"></div>
                      <span className="px-4 uppercase tracking-widest font-semibold">Or</span>
                      <div className="h-px flex-1 bg-zinc-800"></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="mt-6 border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 flex w-full items-center justify-center rounded-lg py-3 text-sm font-bold text-white transition-all shadow-none hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] gap-3 disabled:opacity-50"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Continue with Google
                    </button>

                    <p className="mt-8 text-center text-sm text-zinc-400 pb-2">
                       {view === 'signup' ? "Already have an account?" : "Don't have an account?"}
                      <button
                        type="button"
                        onClick={() => setView(view === 'signup' ? 'login' : 'signup')}
                        className="ml-2 font-bold text-primary hover:text-white transition-colors"
                      >
                         {view === 'signup' ? "Sign In" : "Create one"}
                      </button>
                    </p>
                  </motion.div>
                </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
