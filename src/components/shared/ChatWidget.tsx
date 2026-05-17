import { useState } from "react";
import { X, MessageCircle, ChevronDown } from "lucide-react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showTip, setShowTip] = useState(true);

  const channels = [
    {
      id: "zalo",
      name: "Chat qua Zalo",
      sub: "Thường phản hồi trong vài phút",
      href: "https://zalo.me/pettech",
      gradient: "linear-gradient(135deg,#0068FF,#004FC4)",
      shadow: "0 8px 24px rgba(0,104,255,0.45)",
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
          <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.2" />
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
            style={{ fill: "white", fontSize: "15px", fontWeight: 900, fontFamily: "Inter,sans-serif" }}>
            Z
          </text>
        </svg>
      ),
      badge: "🇻🇳 Hỗ trợ tiếng Việt",
    },
    {
      id: "messenger",
      name: "Chat qua Messenger",
      sub: "Chúng tôi đang trực tuyến",
      href: "https://m.me/pettech",
      gradient: "linear-gradient(135deg,#0084FF,#0052CC)",
      shadow: "0 8px 24px rgba(0,132,255,0.4)",
      icon: (
        <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
          <circle cx="20" cy="20" r="18" fill="white" fillOpacity="0.18" />
          <path
            d="M20 8C13.373 8 8 13.009 8 19.2c0 3.533 1.663 6.69 4.275 8.803V32l3.91-2.148c1.045.29 2.15.448 3.315.448 6.627 0 12-5.009 12-11.2C31.5 13.009 26.627 8 20 8zm1.18 15.08l-3.055-3.26-5.962 3.26 6.556-6.96 3.13 3.26 5.887-3.26-6.556 6.96z"
            fill="white"
          />
        </svg>
      ),
      badge: "Tiếng Anh & Tiếng Việt",
    },
  ];

  return (
    <div
      className="fixed z-[500] flex flex-col items-end gap-3"
      style={{ bottom: "24px", right: "24px", fontFamily: "Inter, sans-serif" }}
    >
      {/* Expanded panel */}
      {open && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            width: "300px",
            background: "white",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 pt-5 pb-4"
            style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#2563EB 100%)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ background: "rgba(255,255,255,0.18)" }}
                >
                  🐾
                </div>
                <div>
                  <p style={{ color: "white", fontSize: "0.88rem", fontWeight: 700 }}>PetTech Hỗ trợ</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.65rem" }}>Đang trực tuyến</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.78rem", lineHeight: 1.5, marginTop: "6px" }}>
              Xin chào! 👋 Chúng tôi có thể giúp gì cho bạn? Chọn kênh để chat với đội ngũ hỗ trợ.
            </p>
          </div>

          {/* Channel options */}
          <div className="p-3 flex flex-col gap-2.5">
            {channels.map((ch) => (
              <a
                key={ch.id}
                href={ch.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                style={{
                  background: ch.gradient,
                  boxShadow: ch.shadow,
                  textDecoration: "none",
                }}
              >
                <div className="flex-shrink-0">{ch.icon}</div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: "white", fontSize: "0.83rem", fontWeight: 700 }}>{ch.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.68rem" }}>{ch.sub}</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.18)", color: "white", fontSize: "0.58rem", fontWeight: 600 }}
                >
                  {ch.badge}
                </span>
              </a>
            ))}

            {/* Quick contact info */}
            <div
              className="mt-1 px-4 py-3 rounded-xl flex items-center gap-3"
              style={{ background: "#f8faff", border: "1.5px solid rgba(37,99,235,0.12)" }}
            >
              <span style={{ fontSize: "1.2rem" }}>📧</span>
              <div>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#374151" }}>Gửi email cho chúng tôi</p>
                <a
                  href="mailto:hello@pettech.io"
                  style={{ fontSize: "0.68rem", color: "#2563EB", fontWeight: 600, textDecoration: "none" }}
                >
                  hello@pettech.io
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 pb-4 text-center">
            <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>
              Powered by PetTech · We reply within 5 min
            </p>
          </div>
        </div>
      )}

      {/* Floating tooltip */}
      {!open && showTip && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{
            background: "white",
            boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
            border: "1px solid rgba(0,0,0,0.06)",
            animation: "fadeInUp 0.4s ease",
          }}
        >
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>
            💬 Need help? Chat with us!
          </span>
          <button
            onClick={() => setShowTip(false)}
            className="ml-1"
            style={{ color: "#9ca3af" }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main FAB */}
      <div className="flex items-center gap-3">
        {/* Zalo quick-button */}
        <a
          href="https://zalo.me/pettech"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on Zalo"
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1"
          style={{
            background: "linear-gradient(135deg,#0068FF,#004FC4)",
            boxShadow: "0 4px 20px rgba(0,104,255,0.5)",
            textDecoration: "none",
          }}
        >
          <span style={{ color: "white", fontSize: "1rem", fontWeight: 900, fontFamily: "Inter, sans-serif" }}>Z</span>
        </a>

        {/* Messenger quick-button */}
        <a
          href="https://m.me/pettech"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on Messenger"
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1"
          style={{
            background: "linear-gradient(135deg,#0084FF,#0052CC)",
            boxShadow: "0 4px 20px rgba(0,132,255,0.45)",
            textDecoration: "none",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.916 1.418 5.527 3.643 7.254V22l3.318-1.83c.887.246 1.826.38 2.8.38 5.524 0 10-4.144 10-9.307C21.761 6.145 17.523 2 12 2zm1.003 12.545l-2.547-2.717-4.973 2.717 5.47-5.808 2.61 2.717 4.906-2.717-5.466 5.808z" />
          </svg>
        </a>

        {/* Main toggle button */}
        <button
          onClick={() => { setOpen((v) => !v); setShowTip(false); }}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{
            background: open
              ? "linear-gradient(135deg,#374151,#1f2937)"
              : "linear-gradient(135deg,#F97316,#ea6c0a)",
            boxShadow: open
              ? "0 4px 20px rgba(31,41,55,0.4)"
              : "0 4px 24px rgba(249,115,22,0.55)",
          }}
        >
          {open
            ? <ChevronDown className="w-6 h-6 text-white" />
            : <MessageCircle className="w-6 h-6 text-white" fill="white" />
          }
        </button>
      </div>
    </div>
  );
}
