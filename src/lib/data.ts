
import type { UserProfile, Project, Task, User, Team } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { addDays, formatISO } from 'date-fns';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

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

export const teams: Team[] = [
    { id: 'team-1', name: 'Frontend', description: 'Responsible for the client-side of the web application.', members: [users[0], users[2]] },
    { id: 'team-2', name: 'Backend', description: 'Manages the server, database, and application logic.', members: [users[1], users[3]] },
    { id: 'team-3', name: 'Design', description: 'Creates the user interface and user experience.', members: [users[4]] },
]

const today = new Date();

export const initialTasks: Task[] = [
    {
    id: 'task-1',
    title: 'Design homepage mockups',
    description: 'Create high-fidelity mockups for the new homepage design.',
    status: 'in-progress',
    priority: 'high',
    dueDate: formatISO(addDays(today, 3)),
    assignees: [users[0], users[4]],
    tags: ['design', 'UI/UX'],
    project: projects[0],
     subTasks: [
      { id: 'sub-1-1', title: 'Wireframe layout', completed: true },
      { id: 'sub-1-2', title: 'Choose color palette', completed: true },
      { id: 'sub-1-3', title: 'Select typography', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Develop authentication API',
    description: 'Build the API endpoints for user authentication.',
    status: 'todo',
    priority: 'high',
    dueDate: formatISO(addDays(today, 5)),
    assignees: [users[1]],
    tags: ['backend', 'api', 'auth'],
    project: projects[1],
  },
  {
    id: 'task-3',
    title: 'Implement navigation bar',
    description: 'Code the main navigation component for the website.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: formatISO(addDays(today, 2)),
    assignees: [users[2]],
    tags: ['frontend', 'react'],
    project: projects[0],
    subTasks: [
      { id: 'sub-3-1', title: 'HTML structure', completed: true },
      { id: 'sub-3-2', title: 'CSS styling', completed: false },
       { id: 'sub-3-3', title: 'Mobile responsiveness', completed: false },
    ],
  },
   {
    id: 'task-4',
    title: 'Set up database schema',
    description: 'Define and create the schema for the new database.',
    status: 'done',
    priority: 'high',
    dueDate: formatISO(addDays(today, -1)),
    assignees: [users[1], users[3]],
    tags: ['backend', 'database'],
    project: projects[1],
     subTasks: [
      { id: 'sub-4-1', title: 'Define user table', completed: true },
      { id: 'sub-4-2', title: 'Define posts table', completed: true },
    ],
  },
  {
    id: 'task-5',
    title: 'Create social media graphics',
    description: 'Design graphics for the upcoming marketing campaign.',
    status: 'review',
    priority: 'medium',
    dueDate: formatISO(addDays(today, 1)),
    assignees: [users[4]],
    tags: ['marketing', 'design'],
    project: projects[2],
  },
   {
    id: 'task-6',
    title: 'Write blog post about launch',
    description: 'Draft a blog post announcing the new mobile app.',
    status: 'todo',
    priority: 'low',
    dueDate: formatISO(addDays(today, 10)),
    assignees: [users[0]],
    tags: ['marketing', 'content'],
    project: projects[2],
  },
];
