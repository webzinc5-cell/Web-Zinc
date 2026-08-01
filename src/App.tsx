import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Reviews } from "./pages/Reviews";
import { ProjectFunnel } from "./pages/ProjectFunnel";
import { CursorGlow } from "./components/CursorGlow";

import { PastWorksPage } from "./pages/PastWorks";
import { PaymentsPage } from "./pages/Payments";
import { DocumentationPage } from "./pages/Documentation";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicy";
import { TermsConditionsPage } from "./pages/TermsConditions";
import { Order } from "./pages/Order";
import { ContactModal } from "./components/ContactModal";

function AppContent() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

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

  return (
    <div className="relative min-h-screen font-sans selection:bg-primary selection:text-black overflow-x-hidden">
      <CursorGlow />
      
      <Routes>
        <Route 
          path="/start" 
          element={<ProjectFunnel />} 
        />
        
        <Route 
          path="/order" 
          element={<Order />} 
        />
        
        <Route
          path="*"
          element={
            <>
              <Navbar onOpenContact={() => setIsContactOpen(true)} theme={theme} toggleTheme={toggleTheme} />
              <main className="relative z-10 flex min-h-screen flex-col">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/past-works" element={<PastWorksPage />} />
                  <Route path="/payments" element={<PaymentsPage theme={theme} />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/reviews" element={<Reviews theme={theme} />} />
                  <Route path="/documentation" element={<DocumentationPage theme={theme} />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage theme={theme} />} />
                  <Route path="/terms-and-conditions" element={<TermsConditionsPage theme={theme} />} />
                </Routes>
              </main>
              <Footer onOpenContact={() => setIsContactOpen(true)} theme={theme} />
            </>
          }
        />
      </Routes>
      
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
