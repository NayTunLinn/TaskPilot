
import type { UserProfile, Project, Task, User } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { addDays, formatISO } from 'date-fns';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

// This data is now primarily for fallback or initial structure.
// The app will fetch real data from Firestore.
export const users: User[] = [
  { id: 'user-1', name: 'Jane Doe', initials: 'JD', avatarUrl: findImage('user-jd'), email: 'jane.d@example.com' },
  { id: 'user-2', name: 'John Smith', initials: 'JS', avatarUrl: findImage('user-js'), email: 'john.s@example.com' },
  { id: 'user-3', name: 'Alex Brown', initials: 'AB', avatarUrl: findImage('user-ab'), email: 'alex.b@example.com' },
  { id: 'user-4', name: 'Sarah Connor', initials: 'SC', avatarUrl: findImage('user-sc'), email: 'sarah.c@example.com' },
  { id: 'user-5', name: 'Kyle Reese', initials: 'KR', avatarUrl: findImage('user-kw'), email: 'kyle.r@example.com' },
];

export const projects: Project[] = [
  { id: 'proj-1', name: 'Website Redesign', description: 'A complete overhaul of the company website.' },
  { id: 'proj-2', name: 'Mobile App Launch', description: 'Launch of the new mobile app for iOS and Android.' },
  { id: 'proj-3', name: 'Q4 Marketing Campaign', description: 'The marketing campaign for the last quarter of the year.' },
];

const today = new Date();

export const initialTasks: Task[] = [
];
