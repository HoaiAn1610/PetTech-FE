import { useState } from "react";
import { Camera, ZoomIn, RotateCcw, X, Upload, Loader2 } from "lucide-react";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { fileService } from "@/api/services";
import { resolveMinioUrl } from "@/utils/file";

interface PhotoSlotProps {
  label: string;
  color: string;
  previewUrl: string | null;
  onSet: (url: string) => void;
}

export function PhotoSlot({ label, color, previewUrl, onSet }: PhotoSlotProps) {
  const [hovered, setHovered] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await fileService.uploadFile(file);
      const url = (res as any)?.data?.url || (res as any)?.url || "uploaded"; // Fallback if API response structure varies
      onSet(url);
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      alert("Tải ảnh thất bại!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {zoomed && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
          onClick={() => setZoomed(false)}
        >
          <div className="relative max-w-3xl w-full mx-4">
            <img
              src={resolveMinioUrl(previewUrl) || ""}
              alt={label}
              className="w-full rounded-2xl object-cover"
              style={{ maxHeight: "80vh" }}
            />
            <button
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
      <div
        className="flex flex-col gap-2 flex-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 800,
              color: "#374151",
              letterSpacing: "0.06em",
            }}
          >
            {label}
          </span>
        </div>
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer"
          style={{
            height: "160px",
            border: previewUrl ? `2px solid ${color}40` : `2px dashed ${color}50`,
            background: previewUrl ? "transparent" : `${color}06`,
            boxShadow:
              previewUrl && hovered ? `0 8px 24px ${color}22` : "none",
          }}
          onClick={() => (previewUrl ? setZoomed(true) : onSet(""))}
        >
          {previewUrl ? (
            <>
              <ImageWithFallback
                src={resolveMinioUrl(previewUrl) || ""}
                alt={label}
                className="w-full h-full object-cover transition-all duration-300"
                style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
              />
              {hovered && (
                <div
                  className="absolute inset-0 flex items-center justify-center gap-2"
                  style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
                >
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{
                      background: "white",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "#374151",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoomed(true);
                    }}
                  >
                    <ZoomIn className="w-3.5 h-3.5" /> Xem
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSet("");
                    }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Thay thế
                  </button>
                </div>
              )}
              <div
                className="absolute top-2 left-2 px-2 py-0.5 rounded-full"
                style={{
                  background: `${color}dd`,
                  fontSize: "0.58rem",
                  fontWeight: 800,
                  color: "white",
                }}
              >
                {label}
              </div>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center h-full gap-2 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadPhoto}
                disabled={isUploading}
              />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}12` }}
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color }} />
                ) : (
                  <Camera className="w-5 h-5" style={{ color }} />
                )}
              </div>
              <div className="text-center">
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color }}>
                  {isUploading ? "Đang tải lên..." : "Nhấn để tải lên"}
                </p>
                <p style={{ fontSize: "0.62rem", color: "#9ca3af" }}>
                  JPG, PNG hoặc HEIC
                </p>
              </div>
            </label>
          )}
        </div>
      </div>
    </>
  );
}
