import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

const Navbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('Home');
  const customTransitionControls = useAnimation();
  const [indicatorPosition, setIndicatorPosition] = useState(0);

  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    moveIndicator(itemName);
  };

  const moveIndicator = (itemName: string) => {
    const targetElement = document.getElementById(itemName);
    if (targetElement) {
      const targetPosition = targetElement.getBoundingClientRect().left - indicatorPosition;
      customTransitionControls.start({ x: targetPosition });
    }
  };

  useEffect(() => {
    const homeElement = document.getElementById('Home');
    if (homeElement) {
      setIndicatorPosition(homeElement.getBoundingClientRect().left);
    }
  }, []);

  return (
    <nav className="mt-4 sm:mt-8 w-screen flex justify-center">
      <ul className="flex items-center bg-gray-500 bg-opacity-20 border border-gray-400 border-opacity-70 w-fit mx-auto rounded-full backdrop-blur-md fixed">
        <li
          id="Home"
          className={`z-10 py-4 px-8 mx-1 cursor-pointer ${activeItem === 'Home' ? 'text-white' : 'text-gray-400'}`}
          onClick={() => handleItemClick('Home')}
        >
          Home
        </li>
        <li
          id="About"
          className={`z-10 py-4 px-8 mx-1 cursor-pointer ${activeItem === 'About' ? 'text-white' : 'text-gray-400'}`}
          onClick={() => handleItemClick('About')}
        >
          About
        </li>
        <li
          id="Projects"
          className={`z-10 py-4 px-8 mx-1 cursor-pointer ${activeItem === 'Projects' ? 'text-white' : 'text-gray-400'}`}
          onClick={() => handleItemClick('Projects')}
        >
          Projects
        </li>
        <motion.div
          animate={customTransitionControls}
          className="w-24 rounded-full bg-gray-700 opacity-40 h-9 custom-transition absolute z-9 left-0"
        />
      </ul>
    </nav>
  );
};

export default Navbar;
