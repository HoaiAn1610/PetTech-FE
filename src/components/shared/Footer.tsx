import { PawPrint, Twitter, Linkedin, Youtube, ExternalLink } from "lucide-react";
import { Link } from "react-router";

interface FooterProps {
  onToast?: (msg: string) => void;
}

const footerLinks: Record<string, { label: string; href?: string; internal?: string; action?: string }[]> = {
  "Sản phẩm": [
    { label: "Tính năng",       href: "#features"   },
    { label: "Bảng giá",        href: "#pricing"     },
    { label: "Nhật ký cập nhật",action: "coming"     },
    { label: "Lộ trình",        action: "coming"     },
    { label: "Tích hợp",        action: "coming"     },
  ],
  "Giải pháp": [
    { label: "Phòng khám nhỏ",    href: "#features"  },
    { label: "Nhiều chi nhánh",   action: "coming"   },
    { label: "Nhóm thú y",        action: "coming"   },
    { label: "Phòng khám cấp cứu",action: "coming"   },
  ],
  "Tài nguyên": [
    { label: "Tài liệu hướng dẫn", action: "docs"   },
    { label: "Tham chiếu API",     action: "docs"    },
    { label: "Trang trạng thái",   action: "coming"  },
    { label: "Blog",               action: "coming"  },
    { label: "Hội thảo trực tuyến",action: "coming"  },
  ],
  "Công ty": [
    { label: "Về chúng tôi", action: "coming"   },
    { label: "Tuyển dụng",   action: "careers"  },
    { label: "Bộ báo chí",   action: "coming"   },
    { label: "Liên hệ",      action: "contact"  },
    { label: "Đối tác",      action: "coming"   },
  ],
};

const SOCIAL = [
  { Icon: Twitter,  href: "https://twitter.com",   label: "Twitter / X" },
  { Icon: Linkedin, href: "https://linkedin.com",  label: "LinkedIn"    },
  { Icon: Youtube,  href: "https://youtube.com",   label: "YouTube"     },
];

export function Footer({ onToast }: FooterProps) {
  function handleAction(action: string) {
    if (action === "coming") {
      onToast?.("Sắp ra mắt — hãy đón chờ! 🚀");
    } else if (action === "docs") {
      onToast?.("Đang mở tài liệu… 📖");
    } else if (action === "careers") {
      onToast?.("Chúng tôi đang tuyển dụng! Hãy quay lại sớm 🐾");
    } else if (action === "contact") {
      onToast?.("Gửi email cho chúng tôi tại hello@pettech.io 📧");
    }
  }

  function scrollTo(href: string) {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <footer
      id="contact"
      className="bg-gray-950 pt-16 pb-8"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-white/10">
          {/* Brand col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)" }}
              >
                <PawPrint className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-white" style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                  Pet
                </span>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#60a5fa", letterSpacing: "-0.02em" }}>
                  Tech
                </span>
              </div>
            </div>
            <p className="text-gray-400 mb-3" style={{ fontSize: "0.85rem", lineHeight: 1.7, maxWidth: "220px" }}>
              Nền tảng vận hành cho phòng khám thú y hiện đại, dựa trên dữ liệu.
            </p>
            <Link to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg mb-5 hover:bg-white/10 transition-colors"
              style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.3)", fontSize: "0.75rem", fontWeight: 600, color: "#60a5fa", textDecoration: "none" }}>
              Mở bảng điều khiển <ExternalLink className="w-3 h-3" />
            </Link>
            {/* Social icons */}
            <div className="flex gap-3 mt-1">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-white mb-4"
                style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.06em" }}
              >
                {category.toUpperCase()}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <button
                        onClick={() => scrollTo(link.href!)}
                        className="text-gray-400 hover:text-white transition-colors text-left"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {link.label}
                      </button>
                    ) : link.internal ? (
                      <Link
                        to={link.internal}
                        className="text-gray-400 hover:text-white transition-colors"
                        style={{ fontSize: "0.85rem", textDecoration: "none" }}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAction(link.action!)}
                        className="text-gray-400 hover:text-white transition-colors text-left"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter strip */}
        <div className="py-8 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white" style={{ fontSize: "0.9rem", fontWeight: 700 }}>Cập nhật tin tức</p>
            <p className="text-gray-500" style={{ fontSize: "0.78rem", marginTop: "2px" }}>Cập nhật sản phẩm, kiến thức thú y & mẹo quản lý phòng khám.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="email@phongkham.com"
              className="flex-1 sm:w-56 px-4 py-2 rounded-xl outline-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "white", fontSize: "0.82rem", fontFamily: "Inter, sans-serif" }}
            />
            <button
              onClick={() => onToast?.("Đã đăng ký! Chúng tôi sẽ liên hệ sớm 📬")}
              className="px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "white", fontWeight: 700, fontSize: "0.82rem", whiteSpace: "nowrap" }}
            >
              Đăng ký
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600" style={{ fontSize: "0.8rem" }}>
            © 2026 PetTech Technologies, Inc. Bảo lưu mọi quyền.
          </p>
          <div className="flex gap-6">
            {["Chính sách bảo mật", "Điều khoản dịch vụ", "Chính sách cookie"].map((link) => (
              <button
                key={link}
                onClick={() => onToast?.(`${link} — sắp có 📄`)}
                className="text-gray-600 hover:text-gray-400 transition-colors"
                style={{ fontSize: "0.8rem" }}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

