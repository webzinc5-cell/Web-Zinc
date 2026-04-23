import { motion, AnimatePresence } from "motion/react";
import { X, Eye, EyeOff } from "lucide-react";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export function SignUpModal({ isOpen, onClose, theme }: SignUpModalProps) {
  const [view, setView] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      await setPersistence(auth, browserLocalPersistence);
      
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
          // Silent catch for firestore issues (e.g. rules)
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
      await setPersistence(auth, browserLocalPersistence);
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      alert("Login Successful: " + (user.displayName || user.email));

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
      alert("Auth Error: " + error.code + " - " + error.message);
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
          <div className="fixed inset-0 z-[70] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300, duration: 0.3 }}
              className={`absolute top-[50%] left-[50%] mt-2 md:mt-0 w-[92%] md:w-full max-w-none md:max-w-md pointer-events-auto flex flex-col rounded-2xl border p-4 md:p-8 max-h-[85vh] overflow-y-auto outline-none transition-colors duration-300 ${
                theme === 'light' 
                  ? "bg-white border-[#E2E8F0] shadow-xl text-[#1E293B]" 
                  : "bg-zinc-950/80 border-primary/30 shadow-[0_0_10px_rgba(34,211,238,0.15)] text-white"
              }`}
            >
              <div className="mb-4 md:mb-6 flex items-center justify-between z-10 w-full shrink-0">
                <h2 className={`text-lg md:text-2xl font-bold uppercase tracking-tight ${
                  theme === 'light' ? "text-[#1E293B]" : "text-white"
                }`}>
                  {view === 'signup' ? "Join WebZinc" : "Welcome Back"}
                </h2>
                <button
                  onClick={onClose}
                  className={`rounded-full p-2 transition-colors ${
                    theme === 'light' ? "text-zinc-500 hover:bg-zinc-100" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
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
                          <label className={`mb-1.5 block text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? "text-zinc-500" : "text-zinc-400"
                          }`}>
                            Business Name
                          </label>
                          <input
                            type="text"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className={`w-full rounded-lg border p-2.5 sm:p-3 text-sm transition-all shadow-none focus:outline-none focus:ring-2 ${
                              theme === 'light' 
                                ? "bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] placeholder-zinc-400 focus:border-primary focus:ring-cyan-400/30" 
                                : "bg-zinc-900/50 border-zinc-700 text-white placeholder-zinc-500 focus:border-primary focus:ring-primary/20"
                            }`}
                            placeholder="Enter business name"
                          />
                        </div>
                      )}
                      <div>
                        <label className={`mb-1 block text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                          theme === 'light' ? "text-zinc-500" : "text-zinc-400"
                        }`}>
                          Secure Email ID
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full rounded-lg border p-2.5 sm:p-3 text-sm transition-all shadow-none focus:outline-none focus:ring-2 ${
                            theme === 'light' 
                              ? "bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] placeholder-zinc-400 focus:border-primary focus:ring-cyan-400/30" 
                              : "bg-zinc-900/50 border-zinc-700 text-white placeholder-zinc-500 focus:border-primary focus:ring-primary/20"
                          }`}
                          placeholder="Enter secure email"
                        />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <label className={`block text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                            theme === 'light' ? "text-zinc-500" : "text-zinc-400"
                          }`}>
                            {view === 'signup' ? 'Create Password' : 'Password'}
                          </label>
                        </div>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full rounded-lg border p-2.5 sm:p-3 pr-10 text-sm transition-all shadow-none focus:outline-none focus:ring-2 ${
                              theme === 'light' 
                                ? "bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] placeholder-zinc-400 focus:border-primary focus:ring-cyan-400/30" 
                                : "bg-zinc-900/50 border-zinc-700 text-white placeholder-zinc-500 focus:border-primary focus:ring-primary/20"
                            }`}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                              theme === 'light' ? "text-zinc-400 hover:text-zinc-600" : "text-zinc-500 hover:text-white"
                            }`}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 flex w-full justify-center items-center gap-2 rounded-lg bg-primary py-2.5 sm:py-3 text-[11px] sm:text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-primary/90 disabled:opacity-50 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                      >
                        {isLoading ? "Authenticating..." : (view === 'signup' ? "Create Account" : "Sign In")}
                      </button>
                    </form>

                    <div className={`mt-4 flex items-center justify-between text-[10px] ${
                      theme === 'light' ? "text-zinc-400" : "text-zinc-500"
                    }`}>
                      <div className={`h-px flex-1 ${theme === 'light' ? 'bg-[#E2E8F0]' : 'bg-zinc-800'}`}></div>
                      <span className="px-3 uppercase tracking-widest font-semibold text-zinc-500">Or</span>
                      <div className={`h-px flex-1 ${theme === 'light' ? 'bg-[#E2E8F0]' : 'bg-zinc-800'}`}></div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className={`mt-4 flex w-full flex-wrap sm:flex-nowrap items-center justify-center rounded-lg py-2.5 md:py-3 text-[11px] sm:text-sm font-bold uppercase tracking-wider transition-all gap-2 disabled:opacity-50 ${
                        theme === 'light' 
                          ? "bg-white border border-[#CBD5E1] text-zinc-900 shadow-sm hover:bg-zinc-50" 
                          : "bg-zinc-900/50 border border-zinc-700 text-white hover:bg-zinc-800"
                      }`}
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
                      {isLoading ? "Authenticating..." : "Continue with Google"}
                    </button>

                    <p className={`mt-8 text-center text-sm pb-2 ${
                      theme === 'light' ? "text-zinc-500" : "text-zinc-400"
                    }`}>
                       {view === 'signup' ? "Already have an account?" : "Don't have an account?"}
                      <button
                        type="button"
                        onClick={() => setView(view === 'signup' ? 'login' : 'signup')}
                        className="ml-2 font-bold text-primary hover:text-zinc-900 transition-colors"
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
