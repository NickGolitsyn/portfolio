import { useState, useRef, useEffect } from "react";
import json from "../../data/data.json";
import { motion, useMotionValue, animate } from "framer-motion";
import useMeasure from "react-use-measure";

const { carousel } = json;

interface FrameProps {
  src: string;
  index: number;
}

function Frame({ src, index }: FrameProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const tilt = index % 2 === 0 ? "2deg" : "-2deg";

  return (
    <div
      className="relative min-w-[260px] sm:min-w-[300px] md:min-w-[320px] aspect-[16/10] select-none transition-all duration-500 ease-out group-hover:brightness-[0.7] group-hover:blur-[2px] hover:!blur-none hover:!brightness-100 hover:scale-[1.04] hover:rotate-0"
      style={{ transform: `rotate(${tilt})` }}
    >
      <div
        className={`img-frame relative w-full h-full rounded-[10px] border border-[rgba(28,26,22,0.12)] shadow-[0_14px_40px_-22px_rgba(28,26,22,0.28)] ${loaded ? "loaded" : ""}`}
      >
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-[1]">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border border-[rgba(28,26,22,0.16)]" />
              <div className="absolute inset-1.5 rounded-full border border-[rgba(28,26,22,0.12)] animate-[spin_2s_linear_infinite] [border-top-color:var(--ink)]" />
            </div>
          </div>
        )}

        <img
          ref={imgRef}
          className="absolute inset-0 w-full h-full object-cover rounded-[10px]"
          src={src}
          alt={`Project preview ${index + 1}`}
          loading="lazy"
          crossOrigin="anonymous"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}

export default function Carousel() {
  const FAST_DURATION = 30;
  const SLOW_DURATION = 80;
  const [duration, setDuration] = useState(FAST_DURATION);
  const [ref, { width }] = useMeasure();
  const xTranslation = useMotionValue(0);

  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    let controls;
    const finalPosition = -width / 2 - 20;

    if (mustFinish) {
      controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
        ease: "linear",
        duration: duration * (1 - xTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false);
          setRerender(!rerender);
        },
      });
    } else {
      controls = animate(xTranslation, [0, finalPosition], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
    }
    return controls?.stop;
  }, [xTranslation, width, duration, rerender]);

  return (
    <div
      className="relative w-screen overflow-hidden py-12"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, #000 5.5rem, #000 calc(100% - 5.5rem), transparent), radial-gradient(ellipse 100% 86% at 50% 50%, #000 62%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, #000 5.5rem, #000 calc(100% - 5.5rem), transparent), radial-gradient(ellipse 100% 86% at 50% 50%, #000 62%, transparent 100%)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div className="relative">
        <motion.div
          className="flex gap-10 group"
          ref={ref}
          style={{ x: xTranslation }}
        >
          {[...carousel, ...carousel].map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => {
                setMustFinish(true);
                setDuration(SLOW_DURATION);
              }}
              onMouseLeave={() => {
                setMustFinish(true);
                setDuration(FAST_DURATION);
              }}
              onTouchStart={() => {
                setMustFinish(true);
                setDuration(SLOW_DURATION);
              }}
              onTouchEnd={() => {
                setMustFinish(true);
                setDuration(FAST_DURATION);
              }}
            >
              <Frame src={item} index={index} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
