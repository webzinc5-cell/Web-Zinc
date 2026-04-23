import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onSignUp: () => void;
  isLoggedIn?: boolean;
  onOpenContact?: () => void;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

export function Navbar({ onSignUp, isLoggedIn, onOpenContact, theme = 'dark', toggleTheme }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { name: "HOME", path: "/" },
    { name: "PORTFOLIO", path: "/past-works" },
    { name: "PAYMENTS", path: "/payments" },
    { name: "REVIEWS", path: "/reviews" },
    { name: "CONTACT", action: onOpenContact },
  ];

  return (
    <>
      <nav className="fixed top-[20px] left-1/2 -translate-x-1/2 w-[900px] max-w-[95vw] h-[60px] bg-white/5 backdrop-blur-[12px] border border-white/10 rounded-full flex items-center justify-between px-[30px] z-[100] relative">
        <Link to="/" className="text-[20px] font-[900] tracking-[-1px] uppercase text-white min-w-[120px]">
          WEBZINC
        </Link>
        <div className="hidden md:flex absolute flex-row left-1/2 -translate-x-1/2 items-center gap-[24px]">
          {links.map((link) => (
            link.path ? (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => {
                  if (link.path === '/' && location.pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={cn(
                  "relative py-1 text-[13px] font-bold tracking-widest transition-colors duration-300 uppercase group",
                  location.pathname === link.path
                    ? "text-[#00FFFF]"
                    : "text-white/80 hover:text-[#00FFFF]"
                )}
              >
                {link.name}
                {location.pathname === link.path ? (
                  <span className="absolute left-0 bottom-0 w-full h-[1px] bg-[#00FFFF]" />
                ) : (
                  <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#00FFFF] transition-all duration-300 group-hover:w-full" />
                )}
              </Link>
            ) : (
              <button
                key={link.name}
                onClick={link.action}
                className="relative py-1 text-[13px] font-bold tracking-widest transition-colors duration-300 uppercase text-white/80 hover:text-[#00FFFF] cursor-pointer group"
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#00FFFF] transition-all duration-300 group-hover:w-full" />
              </button>
            )
          ))}
        </div>
        <div className="hidden md:flex justify-end items-center gap-4 min-w-[120px]">
          <button
            onClick={toggleTheme}
            className="text-white/80 hover:text-[#00FFFF] transition-colors p-2 rounded-full hover:bg-white/5"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={isLoggedIn ? () => navigate("/profile") : onSignUp}
            className="bg-transparent border border-primary text-white px-[20px] py-[8px] rounded-full text-[13px] font-bold uppercase transition-all hover:bg-primary/10 hover:text-[#00FFFF] cursor-pointer min-h-[48px]"
          >
            {isLoggedIn ? "PROFILE" : "Sign Up"}
          </button>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="text-white/80 hover:text-[#00FFFF] transition-colors p-2 rounded-full"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="text-white flex items-center justify-center p-2 min-h-[48px]"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-[80vw] max-w-[300px] bg-zinc-950 border-l border-primary/20 shadow-[-10px_0_30px_rgba(34,211,238,0.1)] z-[200] flex flex-col p-6 md:hidden"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-[20px] font-[900] tracking-[-1px] uppercase text-white">Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/70 hover:text-primary transition-colors p-2 min-h-[48px] flex items-center justify-center"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4 px-2">
                {links.map((link) => {
                  const isActive = link.path ? location.pathname === link.path : false;
                  
                  return link.path ? (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={(e) => {
                        setIsMobileMenuOpen(false);
                        if (link.path === '/' && location.pathname === '/') {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={cn(
                        "flex items-center w-full px-6 py-4 rounded-full border transition-all duration-300",
                        isActive 
                          ? "bg-[rgba(0,255,255,0.15)] border-[#00FFFF] text-white" 
                          : "bg-[rgba(0,255,255,0.05)] border-[#00FFFF]/30 text-white/90 hover:bg-[rgba(0,255,255,0.1)] hover:border-[#00FFFF]/60"
                      )}
                    >
                      {isActive && <div className="w-2 h-2 rounded-full bg-[#00FFFF] mr-3 shadow-[0_0_8px_rgba(0,255,255,0.8)] shrink-0" />}
                      <span className="text-[14px] font-bold tracking-widest uppercase">{link.name}</span>
                    </Link>
                  ) : (
                    <button
                      key={link.name}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (link.action) link.action();
                      }}
                      className="flex items-center w-full px-6 py-4 rounded-full border transition-all duration-300 bg-[rgba(0,255,255,0.05)] border-[#00FFFF]/30 text-white/90 hover:bg-[rgba(0,255,255,0.1)] hover:border-[#00FFFF]/60 text-left"
                    >
                      <span className="text-[14px] font-bold tracking-widest uppercase">{link.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto mb-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    isLoggedIn ? navigate("/profile") : onSignUp();
                  }}
                  className="w-full bg-primary/10 border border-primary text-primary px-[20px] py-[12px] rounded-lg text-[14px] font-bold uppercase transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] min-h-[48px]"
                >
                  {isLoggedIn ? "PROFILE" : "Sign Up"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
