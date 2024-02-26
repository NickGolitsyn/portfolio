import { useState, useEffect } from 'react';

export default function Navbar() {
  const [activeItem, setActiveItem] = useState<string>('Home');
  const [bubblePosition, setBubblePosition] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY >= 40) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const ulClasses = `flex transition-all z-8 items-center border-opacity-70 ${
    scrolled ? 'bg-gray-500 border bg-opacity-20 border-gray-400  backdrop-blur-md' : 'backdrop-blur-none'
  } border-opacity-70 w-fit mx-auto rounded-full`;

  // const liClasses = `py-4 z-10 px-8 mx-1 cursor-pointer ${
  //   scrolled ? 'text-white' : 'text-gray-500'
  // }`;

  const handleItemClick = (itemName: string, position: number) => {
    setActiveItem(itemName);
    setBubblePosition(position);
  };

  return (
    <nav className="mt-4 sm:mt-8 w-screen flex justify-center fixed">
      <ul className={ulClasses}>
        <li
          className={`py-4 z-10 px-8 mx-1 cursor-pointer ${activeItem === 'Home' ? 'text-white' : 'text-gray-500'}`}
          onClick={() => handleItemClick('Home', 0)}
        >
          Home
        </li>
        <li
          className={`py-4 z-10 px-8 mx-1 cursor-pointer ${activeItem === 'About' ? 'text-white' : 'text-gray-500'}`}
          onClick={() => handleItemClick('About', 117)}
        >
          About
        </li>
        <li
          className={`py-4 z-10 px-8 mx-1 cursor-pointer ${activeItem === 'Projects' ? 'text-white' : 'text-gray-500'}`}
          onClick={() => handleItemClick('Projects', 240)}
        >
          Projects
        </li>
        <li
          className="w-20 z-9 rounded-full bg-gray-700 opacity-40 h-9 absolute left-4 custom-transition"
          style={{
            transform: `translateX(${bubblePosition}px)`,
            transition: `transform .3s cubic-bezier(.34,1.56,.64,1)`,
          }}
        ></li>
      </ul>
    </nav>
  );
}
