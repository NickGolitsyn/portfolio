import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

interface ProjectGalleryProps {
  title: string;
  kind: string;
  images: string[];
  variant: "featured" | "card";
  href?: string;
  priority?: boolean;
}

interface FrameProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function Frame({ src, alt, className = "", sizes, priority = false }: FrameProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, [src]);

  return (
    <div
      className={`img-frame interactive relative w-full h-full overflow-hidden ${loaded ? "loaded" : ""} ${className}`}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={1400}
        height={875}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-top"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default function ProjectGallery({
  title,
  kind,
  images,
  variant,
  href,
  priority = false,
}: ProjectGalleryProps) {
  const labelId = useId();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const hasImages = images.length > 0;
  const multiple = images.length > 1;
  const cover = images[0];
  const active = images[index] ?? cover;
  const isCardLink = variant === "card" && !multiple && Boolean(href);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const openAt = useCallback((i: number) => {
    if (!hasImages) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    setIndex(i);
    setOpen(true);
  }, [hasImages]);

  const cycle = useCallback(
    (dir: -1 | 1) => {
      if (!multiple) return;
      setIndex((current) => (current + dir + images.length) % images.length);
    },
    [images.length, multiple],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        cycle(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        cycle(-1);
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      lastFocus.current?.focus();
    };
  }, [open, close, cycle]);

  const frameClass =
    variant === "featured"
      ? "rounded-[10px] border border-[rgba(28,26,22,0.12)] shadow-[0_14px_40px_-22px_rgba(28,26,22,0.28)]"
      : "rounded-none";

  const coverButton = (
    <button
      type="button"
      onClick={() => openAt(0)}
      className="group/shot relative block w-full aspect-[16/10] text-left"
      aria-label={
        multiple ? `View screenshots of ${title}` : `View screenshot of ${title}`
      }
    >
      {cover ? (
        <Frame
          src={cover}
          alt={`${title} - ${kind}`}
          className={frameClass}
          sizes={
            variant === "featured"
              ? "(min-width: 768px) 58vw, 100vw"
              : "(min-width: 768px) 45vw, 100vw"
          }
          priority={priority}
        />
      ) : (
        <div
          className={`img-frame loaded flex items-center justify-center ${frameClass}`}
        >
          <span className="serif italic text-2xl text-[var(--ink-mute)] px-6 text-center">
            {title}
          </span>
        </div>
      )}
    </button>
  );

  const coverLink =
    cover && href ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group/shot relative block w-full aspect-[16/10]"
        aria-label={`Visit ${title}`}
      >
        <Frame
          src={cover}
          alt={`${title} - ${kind}`}
          className={frameClass}
          sizes="(min-width: 768px) 45vw, 100vw"
          priority={priority}
        />
      </a>
    ) : (
      coverButton
    );

  const lightbox =
    mounted &&
    createPortal(
      <AnimatePresence>
        {open && active && (
          <motion.div
            className="project-lightbox"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4">
              <div className="min-w-0">
                <div className="eyebrow">{kind}</div>
                <h2
                  id={labelId}
                  className="mt-1 text-lg sm:text-xl font-medium truncate"
                >
                  {title}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="size-10 shrink-0 inline-flex items-center justify-center rounded-full border border-[rgba(28,26,22,0.2)] bg-white text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
                aria-label="Close gallery"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center px-12 sm:px-16 py-2 min-h-0">
              {multiple && (
                <button
                  type="button"
                  onClick={() => cycle(-1)}
                  className="absolute left-3 sm:left-5 z-10 size-10 inline-flex items-center justify-center rounded-full border border-[rgba(28,26,22,0.2)] bg-white text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
                  aria-label="Previous screenshot"
                >
                  <ArrowLeft className="size-4" />
                </button>
              )}

              <motion.div
                key={active}
                className="project-lightbox-stage relative w-full max-w-5xl aspect-[16/10] overflow-hidden rounded-[10px]"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src={active}
                  alt={`${title}, screenshot ${index + 1} of ${images.length}`}
                  width={1400}
                  height={875}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </motion.div>

              {multiple && (
                <button
                  type="button"
                  onClick={() => cycle(1)}
                  className="absolute right-3 sm:right-5 z-10 size-10 inline-flex items-center justify-center rounded-full border border-[rgba(28,26,22,0.2)] bg-white text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
                  aria-label="Next screenshot"
                >
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>

            {multiple && (
              <div className="px-5 sm:px-8 py-5 flex items-center justify-center gap-2">
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show screenshot ${i + 1}`}
                    aria-current={i === index ? "true" : undefined}
                    className={`h-12 sm:h-14 aspect-[16/10] overflow-hidden rounded-md border bg-white transition-all ${
                      i === index
                        ? "border-[var(--ink)] opacity-100"
                        : "border-[rgba(28,26,22,0.14)] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      width={160}
                      height={100}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <div>
      {isCardLink ? coverLink : coverButton}

      {variant === "featured" && multiple && (
        <div className="mt-3 flex gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => openAt(i)}
              aria-label={`Open screenshot ${i + 1} of ${title}`}
              className={`relative h-14 sm:h-[4.25rem] aspect-[16/10] overflow-hidden rounded-md border transition-all ${
                i === 0
                  ? "border-[rgba(28,26,22,0.28)]"
                  : "border-[rgba(28,26,22,0.12)] hover:border-[rgba(28,26,22,0.28)]"
              }`}
            >
              <img
                src={src}
                alt=""
                width={160}
                height={100}
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox}
    </div>
  );
}
