import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number; // max tilt degrees
  glare?: boolean;
};

/** Lightweight 3D parallax tilt — mouse follow. No deps. */
export function Tilt3D({ children, className = "", max = 12, glare = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * max * 2;
    const ry = (x - 0.5) * max * 2;
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`tilt-3d relative ${className}`}
      style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
    >
      <div
        className="tilt-3d-inner transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
        {glare && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover/tilt:opacity-60 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.35), transparent 55%)",
              mixBlendMode: "soft-light",
            }}
          />
        )}
      </div>
    </div>
  );
}
