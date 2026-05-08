import React from 'react';
import { useUser } from '../context/UserContext';

const Navbar = ({ title }) => {
  const { user } = useUser();

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-[72px] flex items-center justify-between px-8 bg-white border-b border-gray-100 sticky top-0 z-30">
      {/* Left: Page title + greeting */}
      <div>
        <h1 className="text-[18px] font-bold text-[#111827]">{title}</h1>
        <p className="text-[12px] text-[#9CA3AF] mt-0.5">
          {getGreeting()}
        </p>
      </div>

      {/* Right side intentionally left empty (avatar shown in Sidebar) */}
    </header>
  );
};

export default Navbar;
