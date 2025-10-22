'use client';

import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Folder,
  Users,
  CheckSquare,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from './sidebar-provider';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/my-tasks', icon: CheckSquare, label: 'My Tasks' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/reports', icon: BarChart3, label: 'Reports' },
  { href: '/projects', icon: Folder, label: 'Projects' },
  { href: '/teams', icon: Users, label: 'Teams' },
];

function SidebarContent() {
  const { isCollapsed } = useSidebar();
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
          {!isCollapsed && <span className="text-lg">TaskPilot</span>}
        </Link>
        <SidebarToggle />
      </div>
      <nav className="flex-1 space-y-2 p-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map(item => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3 rounded-lg px-3 py-2 text-primary-foreground/80 transition-all hover:bg-primary-foreground/10 hover:text-primary-foreground',
                    isCollapsed ? 'justify-center' : ''
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" sideOffset={5}>
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </div>
  );
}

function SidebarToggle() {
  const { isCollapsed, toggle, isMobile } = useSidebar();
  if (isMobile) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className="rounded-full text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
    >
      <ChevronLeft
        className={cn('h-6 w-6 transition-transform', isCollapsed && 'rotate-180')}
      />
    </Button>
  );
}

export function AppSidebar() {
  const { isMobile, isOpen, setOpen, isCollapsed } = useSidebar();
  const sidebarClasses = cn(
    'bg-gradient-to-b from-primary to-accent text-primary-foreground transition-all duration-300 ease-in-out',
    isCollapsed ? 'w-16' : 'w-64'
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-card p-0">
          <div className="h-full bg-gradient-to-b from-primary to-accent text-primary-foreground">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn(sidebarClasses, 'hidden md:block')}>
      <SidebarContent />
    </aside>
  );
}
