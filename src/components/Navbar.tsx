import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "About" },
  // { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState(navItems[0].id);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const getActiveItemPosition = () => {
    if (!navRef.current) return { x: 0, width: 0 };

    const activeIndex =
      navItems.findIndex((item) => item.id === activeSection) + 1;
    const activeButton = navRef.current.querySelector(
      `button:nth-child(${activeIndex})`,
    ) as HTMLElement | null;

    return {
      x: activeButton?.offsetLeft || 0,
      width: activeButton?.offsetWidth || 0,
    };
  };

  // Register section refs
  useEffect(() => {
    // Add a delay to ensure the DOM is fully loaded
    const timer = setTimeout(() => {
      navItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          sectionRefs.current[item.id] = element;
        } else {
          console.warn(`Section not found: ${item.id}`);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Handle scroll to update active section and navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      // Update scroll state for navbar appearance
      setHasScrolled(window.scrollY > 10);

      if (isScrolling) return;

      const scrollPosition = window.scrollY + 100; // Offset for better UX

      // Find the current section
      let currentSection = activeSection; // Keep current section by default

      // Create entries array for logging
      const sectionsInfo = [];

      for (const item of navItems) {
        const section = sectionRefs.current[item.id];
        if (!section) continue;

        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        sectionsInfo.push({
          id: item.id,
          top: sectionTop,
          bottom: sectionBottom,
          height: section.offsetHeight,
          scrollPos: scrollPosition,
        });

        // Only update if we're actually within a section's bounds
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = item.id;
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // Initial call to set the correct active section on load - with delay
    setTimeout(handleScroll, 500);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, isScrolling]);

  // Scroll to section when nav item is clicked
  const scrollToSection = (id: string) => {
    setIsScrolling(true);
    setActiveSection(id);

    const section = sectionRefs.current[id];
    if (section) {
      const offsetTop = section.offsetTop;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    } else {
      console.warn(`Section element not found for: ${id}`);
      // Release scroll lock if section not found
      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
    >
      <div
        className={`relative flex items-center rounded-[32px] p-2 transition-all duration-300 ${
          hasScrolled
            ? "bg-white/50 backdrop-blur-md shadow-md border border-gray-300"
            : "bg-transparent border-transparent"
        }`}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={`relative px-6 py-2 text-base font-medium transition-colors z-10 ${
              activeSection === item.id
                ? "text-gray-700"
                : "text-gray-500 hover:text-gray-600"
            }`}
          >
            {item.label}
          </button>
        ))}

        {/* Animated selection pill */}
        <motion.div
          className="absolute inset-0 z-0 flex items-center justify-center"
          initial={false}
          animate={getActiveItemPosition()}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        >
          <div className="h-[calc(100%-16px)] w-full rounded-3xl bg-gray-200/90" />
        </motion.div>
      </div>
    </nav>
  );
}
