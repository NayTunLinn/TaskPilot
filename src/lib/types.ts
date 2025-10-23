export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  avatarUrl: string;
  email?: string;
}

export interface User extends UserProfile {}


export interface Project {
  id: string;
  name:string;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: UserProfile[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignees: User[];
  tags: string[];
  project: Project;
}
