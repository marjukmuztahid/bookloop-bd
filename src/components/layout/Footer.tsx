import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="mt-16">
      <div className="border-t border-[rgba(0,0,0,0.06)]" />
      <div className="glass-panel mx-auto mt-0 rounded-t-none border-t-0">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Column 1 — Brand */}
            <div>
              <img src={logo} alt="Book Loop BD" className="mb-3 h-9 w-auto" />
              <p className="text-sm text-[#8A8A8A]">
                Buy and sell school books across Bangladesh
              </p>
            </div>

            {/* Column 2 — Links */}
            <div className="flex flex-col gap-2">
              <FooterLink to="/how-it-works" label="How It Works" />
              <FooterLink to="/listings" label="Browse Books" />
              <FooterLink to="/sell" label="Sell a Book" />
              <FooterLink to="/contact" label="Contact / Report an Issue" />
            </div>

            {/* Column 3 — Info */}
            <div className="flex flex-col gap-2 text-sm text-[#8A8A8A]">
              <span>© 2025 Book Loop BD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }: { to: string; label: string }) => (
  <Link
    to={to}
    className="text-sm text-[#8A8A8A] transition-colors duration-200 hover:text-[#E8357A]"
  >
    {label}
  </Link>
);

export default Footer;
