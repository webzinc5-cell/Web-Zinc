import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userProjects, setUserProjects] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(!!user);
      
      if (user) {
        try {
          // Fetch from nested user path to match aligned structure
          const projectsRef = collection(db, "users", user.uid, "projects");
          const querySnapshot = await getDocs(projectsRef);
          
          const fetchedOrders = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setUserProjects(fetchedOrders);
        } catch (error) {
          setUserProjects([]);
        }
      } else {
        setUserProjects([]);
      }
      
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
      </div>
    );
  }

  return (
    <Router>
      <div className="relative min-h-screen font-sans selection:bg-primary selection:text-black">
        <CursorGlow />
        
        <Routes>
          {/* Profile gets its own layout */}
          <Route 
            path="/profile" 
            element={
              isLoggedIn ? (
                <Dashboard userProjects={userProjects} setUserProjects={setUserProjects} />
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
                <Navbar onSignUp={() => setIsAuthModalOpen(true)} isLoggedIn={isLoggedIn} />
                <main className="relative z-10 flex min-h-screen flex-col">
                  <Routes>
                    <Route path="/" element={<Home onGetStarted={() => setIsAuthModalOpen(true)} isLoggedIn={isLoggedIn} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/reviews" element={<Reviews />} />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
        
        <SignUpModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    </Router>
  );
}

function ProtectedGuard({ onRequireAuth }: { onRequireAuth: () => void }) {
  useEffect(() => {
    onRequireAuth();
  }, [onRequireAuth]);

  return <Navigate to="/" replace />;
}
