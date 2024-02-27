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

  const ulClasses = `flex transition-all z-8 h-14 items-center border-opacity-70 ${
    scrolled ? 'bg-gray-500 border bg-opacity-20 border-gray-400  backdrop-blur-md' : 'backdrop-blur-none'
  } border-opacity-70 w-fit mx-auto rounded-full`;

  const handleItemClick = (itemName: string, positionSmall: number, positionLarge: number) => {
    setActiveItem(itemName);

    // Adjust position based on screen size
    const screenWidth = window.innerWidth;
    const newPosition = screenWidth < 640 ? positionSmall : positionLarge;
    setBubblePosition(newPosition);
  };

  return (
    <nav className="mt-4 sm:mt-8 w-screen flex justify-center fixed">
      <ul className={ulClasses} style={{ position: 'relative' }}>
        <li
          className='z-10'
          onClick={() => handleItemClick('Home', 0, 0)}
        >
        <a
          className={`py-4 select-none z-10 px-6 sm:px-8 mx-1 cursor-pointer ${activeItem === 'Home' ? 'text-white' : 'text-gray-500'}`} 
          href="#home"
        >
            Home
          </a>
        </li>
        <li
          className='z-10'
          onClick={() => handleItemClick('About', 100, 117)}
        >
          <a 
            className={`py-4 select-none z-10 px-6 sm:px-8 mx-1 cursor-pointer ${activeItem === 'About' ? 'text-white' : 'text-gray-500'}`}
            href="#about"
          >
            About
          </a>
        </li>
        <li
          className='z-10'
          onClick={() => handleItemClick('Projects', 208, 240)}
        >
          <a 
            className={`py-4 select-none z-10 px-6 sm:px-8 mx-1 cursor-pointer ${activeItem === 'Projects' ? 'text-white' : 'text-gray-500'}`}
            href="#projects"
          >
            Projects
          </a>
        </li>
        <li
          className="w-20 left-2 sm:left-4 z-9 rounded-full bg-gray-700 opacity-40 h-9 absolute custom-transition"
          style={{
            right: 'auto',
            transform: `translateX(${bubblePosition}px)`,
            transition: `transform .3s cubic-bezier(.34,1.56,.64,1)`,
          }}
        ></li>
      </ul>
    </nav>
  );
}
