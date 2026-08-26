import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], input, textarea, select, label";

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ring = ringRef.current;
    if (!ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const apply = (x: number, y: number) => {
      ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (ring.style.opacity !== "1") {
        ring.style.opacity = "1";
        current.current = { x: e.clientX, y: e.clientY };
        apply(e.clientX, e.clientY);
      }
      if (reduceMotion) {
        current.current = { x: e.clientX, y: e.clientY };
        apply(e.clientX, e.clientY);
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      document.documentElement.classList.toggle(
        "cursor-hover",
        Boolean(target.closest(INTERACTIVE)),
      );
    };

    const onLeave = () => {
      ring.style.opacity = "0";
    };

    const tick = () => {
      const lerp = 0.2;
      current.current.x += (pos.current.x - current.current.x) * lerp;
      current.current.y += (pos.current.y - current.current.y) * lerp;
      apply(current.current.x, current.current.y);
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    if (!reduceMotion) {
      raf.current = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
      document.documentElement.classList.remove(
        "has-custom-cursor",
        "cursor-hover",
      );
    };
  }, []);

  return (
    <div
      ref={ringRef}
      className="cursor-ring"
      aria-hidden="true"
      style={{ opacity: 0 }}
    >
      <div className="cursor-dot" />
    </div>
  );
}
