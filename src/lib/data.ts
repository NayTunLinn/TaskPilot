
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
  {
    id: 'task-1',
    title: 'Design Homepage Layout',
    description: 'Create wireframes and mockups for the new homepage design. Focus on a clean, modern aesthetic and improved user experience. The design should be responsive and accessible.',
    status: 'todo',
    priority: 'high',
    dueDate: formatISO(addDays(today, 5)),
    assignees: [users[0], users[1]],
    tags: ['Design', 'UI/UX'],
    project: projects[0],
    subTasks: [
        { id: 'sub-1-1', title: 'Create wireframes', completed: true },
        { id: 'sub-1-2', title: 'Create mockups', completed: false },
    ]
  },
  {
    id: 'task-2',
    title: 'Develop User Authentication',
    description: 'Implement secure user login and registration functionality using JWT for session management.',
    status: 'in-progress',
    priority: 'high',
    dueDate: formatISO(addDays(today, 12)),
    assignees: [users[2]],
    tags: ['Development', 'Backend'],
    project: projects[0],
  },
  {
    id: 'task-3',
    title: 'Setup Staging Environment',
    description: 'Configure the staging server and deployment pipeline for testing before production release.',
    status: 'todo',
    priority: 'medium',
    dueDate: formatISO(addDays(today, 8)),
    assignees: [users[2], users[4]],
    tags: ['DevOps'],
    project: projects[0],
  },
  {
    id: 'task-4',
    title: 'Plan Social Media Ads',
    description: 'Create a detailed plan for the social media advertising campaign, including target audience, budget, and content strategy.',
    status: 'review',
    priority: 'medium',
    dueDate: formatISO(addDays(today, -1)), // Overdue
    assignees: [users[3]],
    tags: ['Marketing', 'Social Media'],
    project: projects[2],
  },
  {
    id: 'task-5',
    title: 'Finalize App Store Screenshots',
    description: 'Design and capture compelling screenshots for the App Store and Google Play Store listings.',
    status: 'done',
    priority: 'low',
    dueDate: formatISO(addDays(today, 20)),
    assignees: [users[0]],
    tags: ['Design', 'Marketing'],
    project: projects[1],
    subTasks: [
        { id: 'sub-5-1', title: 'Capture iOS screenshots', completed: true },
        { id: 'sub-5-2', title: 'Capture Android screenshots', completed: true },
    ]
  },
  {
    id: 'task-6',
    title: 'Write API Documentation',
    description: 'Document all public API endpoints with clear explanations, request/response examples, and error codes.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: formatISO(addDays(today, 15)),
    assignees: [users[1]],
    tags: ['Documentation', 'Development'],
    project: projects[0],
  },
  {
    id: 'task-7',
    title: 'Conduct Beta Testing',
    description: 'Organize and run a closed beta test with a select group of users to gather feedback on the new mobile app.',
    status: 'todo',
    priority: 'high',
    dueDate: formatISO(addDays(today, 25)),
    assignees: [users[3], users[4]],
    tags: ['QA', 'Mobile'],
    project: projects[1],
  },
  {
    id: 'task-8',
    title: 'Optimize Database Queries',
    description: 'Analyze and optimize slow-performing database queries to improve overall application performance.',
    status: 'review',
    priority: 'high',
    dueDate: formatISO(addDays(today, 7)),
    assignees: [users[2]],
    tags: ['Backend', 'Performance'],
    project: projects[0],
  },
  {
    id: 'task-9',
    title: 'Create Email Newsletter Template',
    description: 'Design and code a responsive email template for the Q4 marketing newsletter.',
    status: 'done',
    priority: 'low',
    dueDate: formatISO(addDays(today, 30)),
    assignees: [users[0]],
    tags: ['Marketing', 'Design'],
    project: projects[2],
  },
  {
    id: 'task-10',
    title: 'Research Competitors',
    description: 'Analyze key competitors in the market to identify their strengths, weaknesses, and marketing strategies.',
    status: 'todo',
    priority: 'low',
    dueDate: formatISO(addDays(today, 18)),
    assignees: [users[3]],
    tags: ['Marketing', 'Strategy'],
    project: projects[2],
  },
  {
    id: 'task-11',
    title: 'Implement Push Notifications',
    description: 'Add push notification capabilities to the mobile app for user engagement.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: formatISO(addDays(today, 22)),
    assignees: [users[4]],
    tags: ['Mobile', 'Development'],
    project: projects[1],
  },
  {
    id: 'task-12',
    title: 'User Acceptance Testing (UAT)',
    description: 'Perform UAT on the website redesign to ensure it meets business requirements and is ready for launch.',
    status: 'review',
    priority: 'high',
    dueDate: formatISO(addDays(today, 3)),
    assignees: [users[1], users[3]],
    tags: ['QA', 'Testing'],
    project: projects[0],
  },
];
