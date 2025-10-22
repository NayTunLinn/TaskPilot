'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

const SIDEBAR_COOKIE_NAME = "taskpilot-sidebar-state";
const MOBILE_BREAKPOINT = 768;

type SidebarContextType = {
  isMobile: boolean;
  isOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileView = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(isMobileView);
      if (!isMobileView && localStorage.getItem(SIDEBAR_COOKIE_NAME) === 'collapsed') {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const setOpen = (open: boolean) => {
    setIsOpen(open);
  }

  const toggle = () => {
    if (isMobile) {
      setIsOpen(prev => !prev);
    } else {
      const newCollapsedState = !isCollapsed;
      setIsCollapsed(newCollapsedState);
      localStorage.setItem(SIDEBAR_COOKIE_NAME, newCollapsedState ? 'collapsed' : 'expanded');
    }
  };

  return (
    <SidebarContext.Provider value={{ isMobile, isOpen, isCollapsed, toggle, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
