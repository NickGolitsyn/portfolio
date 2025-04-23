import React, { useState, useRef, useEffect } from "react";
import json from "../../data/data.json";
import {
  motion,
  useMotionValue,
  animate,
} from "framer-motion";
import useMeasure from "react-use-measure";

const { carousel } = json;

export default function Carousel() {
  const FAST_DURATION = 25;
  const SLOW_DURATION = 75;
  const [duration, setDuration] = useState(FAST_DURATION);
  let [ref, { width }] = useMeasure();
  const xTranslation = useMotionValue(0);

  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    let controls;
    let finalPosition = -width / 2 - 20;

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
    <div className="w-screen overflow-hidden py-10">
      <div className="relative h-[200px]">
        <motion.div
          className="absolute left-0 flex gap-10 group"
          ref={ref}
          style={{ x: xTranslation }}
        >
          {[...carousel, ...carousel].map((item, index) => (
            <motion.div
              key={index}
              className={`min-w-[280px] sm:min-w-[320px] md:min-w-[280px] lg:min-w-[320px] border-2 rounded-lg select-none transition-all duration-300 group-hover:brightness-75 group-hover:blur-sm hover:!blur-none hover:!brightness-100 hover:scale-110 hover:rotate-0 overflow-hidden ${index % 2 === 0 ? "rotate-3" : "-rotate-3"}`}
              onHoverStart={() => {
                setMustFinish(true);
                setDuration(SLOW_DURATION);
              }}
              onHoverEnd={() => {
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
              <div className="absolute inset-0 rounded-md overflow-hidden after:absolute after:pointer-events-none after:w-full after:h-full after:-left-full hover:after:left-full hover:after:duration-1000 hover:after:transition-all after:bg-gradient-to-r after:from-transparent after:via-white/50 after:to-transparent after:-skew-x-12"></div>
              <img
                className="w-full h-full object-cover"
                src={item}
                alt={"website"}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
