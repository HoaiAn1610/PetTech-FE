import { useState, useEffect } from "react";
import { Menu, X, PawPrint } from "lucide-react";
import { motion } from "motion/react";

interface NavBarProps {
  onLogin?: () => void;
  onRegister?: () => void;
}

export function NavBar({ onLogin, onRegister }: NavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Tính năng",        href: "#features"  },
    { label: "Bảng giá",         href: "#pricing"   },
    { label: "Di chuyển DL",     href: "#migration" },
    { label: "Liên hệ",          href: "#contact"   },
  ];

  function scrollTo(href: string) {
    setMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        fontFamily: "Inter, sans-serif",
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(0,0,0,0.04)",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.07)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5" style={{ textDecoration: "none" }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)" }}
            >
              <PawPrint className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-gray-900" style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                Pet
              </span>
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#2563EB", letterSpacing: "-0.02em" }}>
                Tech
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
                style={{ fontSize: "0.88rem", fontWeight: 500 }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onLogin}
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-150"
              style={{ fontSize: "0.88rem", fontWeight: 500 }}
            >
              Đăng nhập
            </button>
            <button
              onClick={onRegister}
              className="px-5 py-2.5 rounded-xl text-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-px"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                fontSize: "0.88rem",
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
              }}
            >
              Dùng thử miễn phí
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              className="px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-left"
              style={{ fontSize: "0.95rem", fontWeight: 500 }}
              onClick={() => scrollTo(link.href)}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-gray-100 mt-2 flex flex-col gap-2">
            <button
              onClick={() => { setMobileOpen(false); onLogin?.(); }}
              className="px-4 py-3 rounded-lg text-center text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
              style={{ fontSize: "0.95rem", fontWeight: 500 }}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => { setMobileOpen(false); onRegister?.(); }}
              className="px-4 py-3 rounded-xl text-center text-white"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                fontSize: "0.95rem",
                fontWeight: 700,
              }}
            >
              Dùng thử miễn phí
            </button>
          </div>
        </div>
      )}
    </motion.header>
  );
}
