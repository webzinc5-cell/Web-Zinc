import { Link } from "react-router-dom";

interface FooterProps {
  onOpenContact?: () => void;
}

export function Footer({ onOpenContact }: FooterProps) {
  return (
    <footer className="border-t border-zinc-border py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 sm:flex-row">
        <div className="mb-4 sm:mb-0">
          <Link to="/" className="text-xl font-bold tracking-tight text-white">
            WebZinc
          </Link>
          <p className="mt-2 text-xs text-zinc-500">
            © 2024 WebZinc. Architectural Precision in Marketing.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 mt-4 sm:mt-0 justify-center sm:justify-start">
          <Link to="/payments" className="text-xs font-medium uppercase tracking-wider text-zinc-500 hover:text-white">
            Pricing & Payments
          </Link>
          <Link to="/reviews" className="text-xs font-medium uppercase tracking-wider text-zinc-500 hover:text-white">
            Reviews
          </Link>
          <button onClick={onOpenContact} className="text-xs font-medium uppercase tracking-wider text-zinc-500 hover:text-white cursor-pointer bg-transparent border-none p-0 outline-none">
            Contact
          </button>
          <Link to="#" className="text-xs font-medium uppercase tracking-wider text-zinc-500 hover:text-white">
            Privacy Policy
          </Link>
          <Link to="#" className="text-xs font-medium uppercase tracking-wider text-zinc-500 hover:text-white">
            Terms of Service
          </Link>
          <Link to="#" className="text-xs font-medium uppercase tracking-wider text-zinc-500 hover:text-white">
            LinkedIn
          </Link>
          <Link to="#" className="text-xs font-medium uppercase tracking-wider text-zinc-500 hover:text-white">
            Documentation
          </Link>
        </div>
      </div>
    </footer>
  );
}
