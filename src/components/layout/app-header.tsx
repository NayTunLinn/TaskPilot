
'use client';

import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from './sidebar-provider';
import { CreateTaskButton } from '../tasks/create-task-button';
import Link from 'next/link';

export function AppHeader() {
  const { toggle, isMobile } = useSidebar();
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'JD';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6">
      {isMobile && (
        <Button variant="ghost" size="icon" onClick={toggle} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      )}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="w-full bg-background pl-8 text-sm md:w-[200px] lg:w-[320px]"
          />
        </div>
      </div>
      <CreateTaskButton />
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjEwMzE4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Jane Doe" data-ai-hint="person portrait" />
              <AvatarFallback>{getInitials('Jane Doe')}</AvatarFallback>
            </Avatar>
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/profile" passHref>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </Link>
          <Link href="/settings" passHref>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
