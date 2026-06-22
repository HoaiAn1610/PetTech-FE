import React from "react";

export function SocialFloatingButtons() {
  return (
    <div
      className="fixed z-[500] flex flex-col gap-2.5 bottom-4 right-4 sm:bottom-6 sm:right-6"
    >
      {/* Zalo quick-button */}
      <a
        href="https://zalo.me/0972214859"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on Zalo"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 shadow-lg cursor-pointer animate-in fade-in"
        style={{
          background: "linear-gradient(135deg,#0068FF,#004FC4)",
          boxShadow: "0 4px 16px rgba(0,104,255,0.35)",
          textDecoration: "none",
        }}
      >
        <span className="text-white text-base sm:text-lg font-black" style={{ fontFamily: "Inter, sans-serif" }}>Z</span>
      </a>

      {/* Messenger quick-button */}
      <a
        href="https://m.me/phuc.bao.790256"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on Messenger"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 shadow-lg cursor-pointer animate-in fade-in"
        style={{
          background: "linear-gradient(135deg,#0084FF,#0052CC)",
          boxShadow: "0 4px 16px rgba(0,132,255,0.35)",
          textDecoration: "none",
        }}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="white">
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.916 1.418 5.527 3.643 7.254V22l3.318-1.83c.887.246 1.826.38 2.8.38 5.524 0 10-4.144 10-9.307C21.761 6.145 17.523 2 12 2zm1.003 12.545l-2.547-2.717-4.973 2.717 5.47-5.808 2.61 2.717 4.906-2.717-5.466 5.808z" />
        </svg>
      </a>
    </div>
  );
}
