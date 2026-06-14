import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Heart, Flame, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Heart, label: 'Compliments', path: '/compliments' },
  { icon: Flame, label: 'Roasts', path: '/roasts' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 nav-blur z-50 safe-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full transition-all duration-200 gap-1",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-semibold uppercase tracking-tighter">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;