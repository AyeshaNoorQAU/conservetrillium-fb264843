import { useEffect, useRef, useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Move, X, Maximize2 } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
};

/**
 * Interactive plant image viewer:
 *  - mouse wheel / pinch to zoom
 *  - drag to pan
 *  - click "view" to open fullscreen lightbox
 *  - reset button
 */
export function ZoomableImage({ src, alt, caption, className = "" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <figure className={`relative group overflow-hidden rounded-2xl ${className}`}>
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Open zoomable viewer"
        >
          <Maximize2 className="w-3.5 h-3.5" /> Zoom & pan
        </button>
        {caption && (
          <figcaption className="absolute bottom-3 left-4 text-xs text-white/90 drop-shadow">
            {caption}
          </figcaption>
        )}
      </figure>
      {open && <ZoomLightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}

function ZoomLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [rot, setRot] = useState(0);
  const dragging = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.25, 6));
      if (e.key === "-") setScale((s) => Math.max(s - 0.25, 0.5));
      if (e.key.toLowerCase() === "r") {
        setScale(1); setTx(0); setTy(0); setRot(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const next = Math.min(6, Math.max(0.5, scale + (e.deltaY > 0 ? -0.15 : 0.15)));
    setScale(next);
  };
  const onDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragging.current = { x: e.clientX - tx, y: e.clientY - ty };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setTx(e.clientX - dragging.current.x);
    setTy(e.clientY - dragging.current.y);
  };
  const onUp = () => { dragging.current = null; };

  const reset = () => { setScale(1); setTx(0); setTy(0); setRot(0); };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 text-white/90 text-sm border-b border-white/10">
        <span className="truncate">{alt}</span>
        <div className="flex items-center gap-1">
          <ToolBtn onClick={() => setScale((s) => Math.min(s + 0.25, 6))}><ZoomIn className="w-4 h-4" /></ToolBtn>
          <ToolBtn onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}><ZoomOut className="w-4 h-4" /></ToolBtn>
          <ToolBtn onClick={() => setRot((r) => r - 15)}>↺</ToolBtn>
          <ToolBtn onClick={() => setRot((r) => r + 15)}>↻</ToolBtn>
          <ToolBtn onClick={reset}><RotateCcw className="w-4 h-4" /></ToolBtn>
          <ToolBtn onClick={onClose}><X className="w-4 h-4" /></ToolBtn>
        </div>
      </div>
      <div
        onWheel={onWheel}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="flex-1 overflow-hidden grid place-items-center cursor-grab active:cursor-grabbing select-none"
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rot}deg)`,
            transition: dragging.current ? "none" : "transform 0.25s ease-out",
          }}
          className="max-h-[88vh] max-w-[92vw] object-contain will-change-transform"
        />
      </div>
      <div className="px-5 py-2 text-[11px] text-white/50 flex items-center gap-3 border-t border-white/10">
        <Move className="w-3 h-3" /> drag to pan · scroll/pinch to zoom · R to reset · Esc to close · scale {scale.toFixed(2)}×
      </div>
    </div>
  );
}

function ToolBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 grid place-items-center rounded-full bg-white/5 hover:bg-white/15 text-white transition-colors"
    >
      {children}
    </button>
  );
}
