import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Reviews } from "./pages/Reviews";
import { Dashboard } from "./pages/Dashboard";
import { ProjectFunnel } from "./pages/ProjectFunnel";
import { CursorGlow } from "./components/CursorGlow";
import { SignUpModal } from "./components/SignUpModal";
import { CrystalLoader } from "./components/ui/CrystalLoader";

import { PastWorksPage } from "./pages/PastWorks";
import { PaymentsPage } from "./pages/Payments";
import { ContactModal } from "./components/ContactModal";

function AppContent() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User detected:", user.email);
      }
      setIsLoggedIn(!!user);
      
      if (user) {        
        try {
          const q = query(
            collection(db, "projects"),
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          
          const fetchedOrders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })).filter((order: any) => order.isVerified !== false); // Exclude explicit false, allow legacy undefined
          
          setUserProjects(fetchedOrders);
        } catch (error) {
          setUserProjects([]);
        }
      } else {
        setUserProjects([]);
        if (window.location.pathname === "/profile" || window.location.pathname === "/start") {
          navigate("/");
        }
      }
      
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!isAuthReady) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-[#F8FAFC]' : 'bg-[#000000]'}`}>
        <CrystalLoader theme={theme} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans selection:bg-primary selection:text-black overflow-x-hidden">
      <CursorGlow />
      
      <Routes>
        {/* Profile gets its own layout */}
        <Route 
          path="/profile" 
          element={
            isLoggedIn ? (
              <Dashboard userProjects={userProjects} setUserProjects={setUserProjects} theme={theme} />
            ) : (
              <ProtectedGuard onRequireAuth={() => setIsAuthModalOpen(true)} />
            )
          } 
        />
        
        <Route 
          path="/start" 
          element={
            isLoggedIn ? (
              <ProjectFunnel userProjects={userProjects} setUserProjects={setUserProjects} />
            ) : (
              <ProtectedGuard onRequireAuth={() => setIsAuthModalOpen(true)} />
            )
          } 
        />
        
        <Route
          path="*"
          element={
            <>
              <Navbar onSignUp={() => setIsAuthModalOpen(true)} isLoggedIn={isLoggedIn} onOpenContact={() => setIsContactOpen(true)} theme={theme} toggleTheme={toggleTheme} />
              <main className="relative z-10 flex min-h-screen flex-col">
                <Routes>
                  <Route path="/" element={<Home onGetStarted={() => setIsAuthModalOpen(true)} isLoggedIn={isLoggedIn} />} />
                  <Route path="/past-works" element={<PastWorksPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/reviews" element={<Reviews />} />
                </Routes>
              </main>
              <Footer onOpenContact={() => setIsContactOpen(true)} />
            </>
          }
        />
      </Routes>
      
      <SignUpModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} theme={theme} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} theme={theme} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function ProtectedGuard({ onRequireAuth }: { onRequireAuth: () => void }) {
  useEffect(() => {
    onRequireAuth();
  }, [onRequireAuth]);

  return <Navigate to="/" replace />;
}
