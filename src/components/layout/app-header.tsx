
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
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function AppHeader() {
  const { toggle, isMobile } = useSidebar();
  const { user: currentUser, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out.',
        variant: 'destructive',
      });
    }
  };
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
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
      {currentUser && <CreateTaskButton />}
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.photoURL || ''} alt={currentUser?.displayName || ''} data-ai-hint="person portrait" />
              <AvatarFallback>{getInitials(currentUser?.displayName)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentUser ? (
            <>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/profile" passHref>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              <Link href="/settings" passHref>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <DropdownMenuItem>Login</DropdownMenuItem>
              </Link>
              <Link href="/signup" passHref>
                <DropdownMenuItem>Sign Up</DropdownMenuItem>
              </Link>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
