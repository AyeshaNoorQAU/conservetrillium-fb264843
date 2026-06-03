import { useEffect, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxItem = { src: string; caption?: string; alt?: string };

export function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const touchX = useRef<number | null>(null);
  const next = () => onIndexChange((index + 1) % items.length);
  const prev = () => onIndexChange((index - 1 + items.length) % items.length);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, items.length]);

  if (!items.length) return null;
  const item = items[index];

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchX.current = null;
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute top-5 right-5 grid place-items-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        aria-label="Previous"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label="Next"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <figure
        className="relative max-w-[92vw] max-h-[88vh] flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={item.src}
          src={item.src}
          alt={item.alt ?? item.caption ?? ""}
          className="max-w-[92vw] max-h-[78vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 fade-in duration-300"
        />
        {item.caption && (
          <figcaption className="text-white/90 text-sm tracking-wide text-center px-4">
            {item.caption}{" "}
            <span className="text-white/50 ml-2">
              {index + 1} / {items.length}
            </span>
          </figcaption>
        )}
      </figure>
    </div>
  );
}

export function useLightbox() {
  const [index, setIndex] = useState<number | null>(null);
  return {
    index,
    open: (i: number) => setIndex(i),
    close: () => setIndex(null),
    setIndex,
  };
}
