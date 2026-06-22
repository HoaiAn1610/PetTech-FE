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
      className="bg-slate-50 border-t border-slate-100 pt-12 pb-8"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 pb-10 border-b border-slate-200/60">
          {/* Brand col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)" }}
              >
                <PawPrint className="w-5.5 h-5.5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-slate-900" style={{ fontSize: "1.25rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
                  Pet
                </span>
                <span style={{ fontSize: "1.25rem", fontWeight: 900, color: "#2563EB", letterSpacing: "-0.02em" }}>
                  Tech
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-[240px] font-medium">
              Nền tảng quản lý & vận hành tối ưu cho phòng khám và spa thú cưng hiện đại.
            </p>
            <div className="pt-2">
              <Link to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs font-black text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
                style={{ textDecoration: "none" }}>
                Mở bảng điều khiển <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
            {/* Social icons */}
            <div className="flex gap-2.5 pt-1">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 border border-slate-200/60 hover:bg-white hover:shadow-md transition-all hover:-translate-y-0.5 bg-white/40"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-slate-900 text-[0.72rem] font-black uppercase tracking-widest">
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <button
                        onClick={() => scrollTo(link.href!)}
                        className="text-slate-500 hover:text-blue-600 transition-colors text-left text-[0.85rem] font-bold"
                      >
                        {link.label}
                      </button>
                    ) : link.internal ? (
                      <Link
                        to={link.internal}
                        className="text-slate-500 hover:text-blue-600 transition-colors text-[0.85rem] font-bold"
                        style={{ textDecoration: "none" }}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleAction(link.action!)}
                        className="text-slate-500 hover:text-blue-600 transition-colors text-left text-[0.85rem] font-bold"
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
        <div className="py-6 border-b border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-slate-900 text-sm font-black">Cập nhật tin tức</p>
            <p className="text-slate-500 text-xs font-medium">Cập nhật sản phẩm mới, kiến thức thú y & mẹo tối ưu hóa phòng khám.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="email@phongkham.com"
              className="flex-1 md:w-64 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-medium focus-visible:ring-1 focus-visible:ring-blue-600 outline-none shadow-inner"
            />
            <button
              onClick={() => onToast?.("Đã đăng ký! Chúng tôi sẽ liên hệ sớm 📬")}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/10 transition-colors whitespace-nowrap cursor-pointer"
            >
              Đăng ký
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium">
          <p className="text-slate-400 text-center sm:text-left">
            © 2026 PetTech Technologies, Inc. Bảo lưu mọi quyền.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {["Chính sách bảo mật", "Điều khoản dịch vụ", "Chính sách cookie"].map((link) => (
              <button
                key={link}
                onClick={() => onToast?.(`${link} — sắp có 📄`)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
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
