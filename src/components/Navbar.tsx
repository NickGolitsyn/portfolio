import { useState } from 'react'

export default function Navbar() {
  const [activeItem, setActiveItem] = useState<string>('Home');
  const [bubblePosition, setBubblePosition] = useState(0);

  const handleItemClick = (itemName: string, position: number) => {
    setActiveItem(itemName);
    setBubblePosition(position);
  };
  return (
    <nav className="mt-4 sm:mt-8 w-screen flex justify-center fixed">
      <ul className="flex z-8 items-center bg-gray-500 bg-opacity-20 border border-gray-400 border-opacity-70 w-fit mx-auto rounded-full backdrop-blur-md fixed relative">
        <li className={`py-4 z-10 px-8 mx-1 cursor-pointer  ${activeItem === 'Home' ? 'text-white' : 'text-gray-500'}`} onClick={() => handleItemClick('Home', 0)}>Home</li>
        <li className={`py-4 z-10 px-8 mx-1 cursor-pointer ${activeItem === 'About' ? 'text-white' : 'text-gray-500'}`} onClick={() => handleItemClick('About', 117)}>About</li>
        <li className={`py-4 z-10 px-8 mx-1 cursor-pointer ${activeItem === 'Projects' ? 'text-white' : 'text-gray-500'}`} onClick={() => handleItemClick('Projects', 240)}>Projects</li>
        <div className="w-20 z-9 rounded-full bg-gray-700 opacity-40 h-9 absolute left-4 custom-transition" style={{ transform: `translateX(${bubblePosition}px)`, transition: `transform .3s cubic-bezier(.34,1.56,.64,1)` }}></div>
      </ul>
    </nav>
  )
}
