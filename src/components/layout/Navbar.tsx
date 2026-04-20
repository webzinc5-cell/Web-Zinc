import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

interface NavbarProps {
  onSignUp: () => void;
  isLoggedIn?: boolean;
}

export function Navbar({ onSignUp, isLoggedIn }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: "Platform", path: "/" },
    { name: "PAST WORKS", path: "/past-works" },
    { name: "Pricing", path: "/#pricing" },
    { name: "Contact", path: "/#contact" },
  ];

  return (
    <nav className="fixed top-[20px] left-1/2 -translate-x-1/2 w-[900px] max-w-[95vw] h-[60px] bg-white/5 backdrop-blur-[12px] border border-white/10 rounded-full flex items-center justify-between px-[30px] z-[100]">
      <Link to="/" className="text-[20px] font-[900] tracking-[-1px] uppercase text-white">
        WEBZINC
      </Link>
      <div className="hidden items-center gap-[24px] md:flex">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              "text-[13px] font-medium transition-opacity",
              location.pathname === link.path || (location.pathname === '/' && link.path === '/')
                ? "text-white opacity-100"
                : "text-white opacity-70 hover:opacity-100"
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
      <button
        onClick={isLoggedIn ? () => navigate("/profile") : onSignUp}
        className="bg-transparent border border-white text-white px-[20px] py-[8px] rounded-full text-[13px] font-bold uppercase transition-all hover:bg-white/10 hover:scale-105"
      >
        {isLoggedIn ? "Profile" : "Sign Up"}
      </button>
    </nav>
  );
}
