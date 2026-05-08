import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  LogOut,
  Wallet,
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { SIDE_MENU_DATA } from '../utils/data';

const ICONS = { LayoutDashboard, TrendingUp, TrendingDown };

const Sidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-white flex flex-col shadow-[2px_0_20px_rgba(0,0,0,0.06)] z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7DD3FC] to-[#0284C7] flex items-center justify-center shadow-md">
          <Wallet size={18} className="text-white" />
        </div>
        <span className="text-[15px] font-bold text-[#111827] tracking-tight">
          ExpenseTracker
        </span>
      </div>

      {/* User avatar + name (top) */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center w-full">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7DD3FC] to-[#0284C7] flex items-center justify-center text-white text-[14px] font-bold overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.fullName || 'U')
              )}
            </div>
            <p className="text-[13px] font-semibold text-[#111827] mt-2 truncate text-center w-full">
              {user?.fullName || 'User'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {SIDE_MENU_DATA.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-[11px] rounded-xl text-[13.5px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0EA5E9] text-white shadow-md shadow-sky-200'
                    : 'text-[#111827] hover:bg-[#E0F2FE] hover:text-[#111827]'
                }`
                  }
                  >
              {({ isActive }) => (
                <>
                  {Icon && (
                    <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-[#0EA5E9]' : 'bg-[#E0F2FE]'}`}>
                      <Icon size={16} className={isActive ? 'text-white' : 'text-[#111827]'} />
                    </span>
                  )}
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-[11px] rounded-xl text-[13.5px] font-medium text-[#111827] hover:bg-red-50 hover:text-red-500 transition-all duration-200 mt-1"
        >
          <LogOut size={18} className="text-current" />
          Logout
        </button>
      </nav>

      {/* (bottom user section removed - avatar/name now at top) */}
    </aside>
  );
};

export default Sidebar;
