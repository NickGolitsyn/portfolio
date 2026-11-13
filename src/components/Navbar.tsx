import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Index" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
  { id: "experience", label: "Experience" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState(navItems[0].id);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const measure = () => {
      if (!listRef.current) return;
      const activeIndex = navItems.findIndex((item) => item.id === activeSection);
      if (activeIndex < 0) return;
      const button = listRef.current.querySelector(
        `button[data-nav-index="${activeIndex + 1}"]`,
      ) as HTMLElement | null;
      if (button) {
        setPill({ x: button.offsetLeft, width: button.offsetWidth });
        const scroller = scrollerRef.current;
        if (scroller) {
          const target =
            button.offsetLeft -
            (scroller.clientWidth - button.offsetWidth) / 2;
          scroller.scrollTo({
            left: Math.max(0, target),
            behavior: "smooth",
          });
        }
      }
    };
    measure();
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts?.ready?.then(measure).catch(() => {});
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeSection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          sectionRefs.current[item.id] = element;
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 12);

      if (isScrolling) return;

      const scrollPosition = window.scrollY + 140;
      let currentSection = activeSection;

      for (const item of navItems) {
        const section = sectionRefs.current[item.id];
        if (!section) continue;

        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = item.id;
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    setTimeout(handleScroll, 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, isScrolling]);

  const scrollToSection = (id: string) => {
    setIsScrolling(true);
    setActiveSection(id);

    const section =
      sectionRefs.current[id] ?? document.getElementById(id);
    if (section) {
      sectionRefs.current[id] = section;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => setIsScrolling(false), 1200);
    } else {
      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  return (
    <nav
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-max max-w-[calc(100vw-1.5rem)] print:hidden"
      aria-label="Primary"
    >
      <div
        className={`flex items-center rounded-full pl-2 pr-1.5 py-1.5 max-w-full transition-all duration-500 ease-out ${
          hasScrolled
            ? "bg-[rgba(250,248,243,0.82)] backdrop-blur-xl border border-[rgba(28,26,22,0.12)] shadow-[0_8px_32px_-16px_rgba(28,26,22,0.28)]"
            : "bg-[rgba(250,248,243,0.5)] backdrop-blur-md border border-[rgba(28,26,22,0.08)]"
        }`}
      >
        <a
          href="#home"
          aria-label="Home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("home");
          }}
          className="flex items-center justify-center size-8 ml-1 mr-1 rounded-full text-[var(--ink)] hover:text-[var(--ink-2)] transition-colors shrink-0"
        >
          <Logo className="size-5" />
        </a>

        <span
          className="h-5 w-px bg-[rgba(28,26,22,0.12)] mx-1 shrink-0"
          aria-hidden="true"
        />

        <div
          ref={scrollerRef}
          className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div ref={listRef} className="relative flex items-center gap-1 pr-1">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                data-nav-index={idx + 1}
                onClick={() => scrollToSection(item.id)}
                className={`relative z-10 shrink-0 inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-300 ${
                  activeSection === item.id
                    ? "text-[var(--paper)]"
                    : "text-[var(--ink-mute)] hover:text-[var(--ink)]"
                }`}
                aria-current={activeSection === item.id ? "true" : undefined}
              >
                <span>{item.label}</span>
              </button>
            ))}

            {pill && (
              <motion.div
                className="absolute top-0 bottom-0 left-0 z-0 pointer-events-none"
                initial={false}
                animate={{ x: pill.x, width: pill.width }}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                <div className="h-full w-full rounded-full bg-[var(--ink)]" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
