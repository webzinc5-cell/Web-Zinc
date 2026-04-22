import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

interface NavbarProps {
  onSignUp: () => void;
  isLoggedIn?: boolean;
  onOpenContact?: () => void;
}

export function Navbar({ onSignUp, isLoggedIn, onOpenContact }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: "HOME", path: "/" },
    { name: "PORTFOLIO", path: "/past-works" },
    { name: "PAYMENTS", path: "/payments" },
    { name: "REVIEWS", path: "/reviews" },
    { name: "CONTACT", action: onOpenContact },
  ];

  return (
    <nav className="fixed top-[20px] left-1/2 -translate-x-1/2 w-[900px] max-w-[95vw] h-[60px] bg-white/5 backdrop-blur-[12px] border border-white/10 rounded-full flex items-center justify-between px-[30px] z-[100]">
      <Link to="/" className="text-[20px] font-[900] tracking-[-1px] uppercase text-white">
        WEBZINC
      </Link>
      <div className="hidden items-center gap-[24px] md:flex">
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
                "text-[13px] font-bold tracking-widest transition-all duration-300 uppercase",
                location.pathname === link.path && link.path !== '/'
                  ? "text-primary drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  : "text-white/70 hover:text-primary hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] hover:opacity-100"
              )}
            >
              {link.name}
            </Link>
          ) : (
            <button
              key={link.name}
              onClick={link.action}
              className="text-[13px] font-bold tracking-widest transition-all duration-300 uppercase text-white/70 hover:text-primary hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] hover:opacity-100 cursor-pointer"
            >
              {link.name}
            </button>
          )
        ))}
      </div>
      <button
        onClick={isLoggedIn ? () => navigate("/profile") : onSignUp}
        className="bg-transparent border border-white text-white px-[20px] py-[8px] rounded-full text-[13px] font-bold uppercase transition-all hover:bg-white/10 hover:scale-105"
      >
        {isLoggedIn ? "PROFILE" : "Sign Up"}
      </button>
    </nav>
  );
}
