# Understanding the Tech Stack

Welcome to the TaskPilot project! This document is a guide for students and new developers to understand the technologies used to build this application. We'll explore what each tool does, why it was chosen, and show you where to find it in the code.

## Table of Contents

1.  [Core Framework: Next.js & React](#core-framework-nextjs--react)
2.  [Language: TypeScript](#language-typescript)
3.  [Styling: Tailwind CSS & ShadCN/UI](#styling-tailwind-css--shadcnui)
4.  [AI Features: Genkit](#ai-features-genkit)
5.  [State Management: React Context](#state-management-react-context)
6.  [Forms & Validation: React Hook Form & Zod](#forms--validation-react-hook-form--zod)
7.  [Icons: Lucide React](#icons-lucide-react)
8.  [Utilities: date-fns & class-variance-authority](#utilities)

---

### Core Framework: Next.js & React

*   **What it is:** React is a JavaScript library for building user interfaces. Next.js is a powerful framework built on top of React. It provides a structured way to build production-ready applications with features like routing, server-side rendering, and performance optimizations.

*   **Why we use it:** Next.js allows us to build a fast, modern web application. We use its **App Router** to define different pages (like `Dashboard`, `Calendar`, `Projects`) and layouts. This makes the application structure clean and scalable.

*   **How we use it:** Every page in our app is a React component located in the `src/app/` directory. For example, the main dashboard page is `src/app/page.tsx`. The overall structure of every page (like the header and sidebar) is defined in `src/app/layout.tsx`.

    *File: `src/app/page.tsx`*
    ```tsx
    'use client';

    import { StatCards } from '@/components/dashboard/stat-cards';
    import { KanbanBoard } from '@/components/dashboard/kanban-board';

    export default function Home() {
      return (
        <div className="flex flex-col gap-8">
          <StatCards />
          <KanbanBoard />
        </div>
      );
    }
    ```

---

### Language: TypeScript

*   **What it is:** TypeScript is a programming language that builds on JavaScript by adding static types.

*   **Why we use it:** Types help us catch bugs before they happen. By defining the "shape" of our data (like what a `Task` object should contain), TypeScript ensures we don't accidentally use the wrong data in the wrong place. It also provides excellent autocompletion and makes the code easier to understand.

*   **How we use it:** We define the shapes of our main data structures in `src/lib/types.ts`. These types are then imported and used throughout the application to ensure data consistency.

    *File: `src/lib/types.ts`*
    ```ts
    export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
    export type TaskPriority = 'low' | 'medium' | 'high';

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
      subTasks?: SubTask[];
    }
    ```
    This `Task` type is then used as a `prop` in components like `TaskCard`.

---

### Styling: Tailwind CSS & ShadCN/UI

*   **What it is:**
    *   **Tailwind CSS** is a "utility-first" CSS framework. Instead of writing custom CSS files, you style elements by applying pre-existing classes directly in your HTML/JSX.
    *   **ShadCN/UI** is a collection of reusable UI components (like `Button`, `Card`, `Dialog`) built using Radix UI (for accessibility) and styled with Tailwind CSS.

*   **Why we use it:** This combination allows us to build a beautiful, consistent, and professional-looking UI very quickly. Tailwind's utility classes handle all the low-level styling, while ShadCN provides ready-made, accessible, and customizable components for common UI patterns.

*   **How we use it:** We use Tailwind classes for layout and styling everywhere. The UI components from ShadCN are imported from `@/components/ui/`.

    *File: `src/components/dashboard/task-card.tsx`*
    ```tsx
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';
    import { cn } from '@/lib/utils'; // A helper for combining class names

    export function TaskCard({ task }: TaskCardProps) {
      return (
        <Card className="border-l-4 transform transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex flex-wrap gap-1">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }
    ```

---

### AI Features: Genkit

*   **What it is:** Genkit is an open-source framework from Google that helps integrate generative AI models (like Gemini) into applications.

*   **Why we use it:** Genkit simplifies the process of creating structured, reliable, and testable AI-powered features. We use it for the "Suggest Tags" functionality, where it analyzes a task description and returns relevant tags.

*   **How we use it:** AI logic is defined in "flows" located in `src/ai/flows/`. A flow defines the prompt, the expected input/output format, and calls the AI model.

    *File: `src/ai/flows/ai-suggested-tags.ts`*
    ```ts
    'use server';
    import {ai} from '@/ai/genkit';
    import {z} from 'genkit'; // Using Zod to define schema

    // 1. Define the shape of the input data
    const SuggestTagsInputSchema = z.object({
      taskDescription: z.string(),
    });

    // 2. Define the shape of the expected output
    const SuggestTagsOutputSchema = z.object({
      tags: z.array(z.string()),
    });

    // 3. Define the AI prompt
    const prompt = ai.definePrompt({
      name: 'suggestTagsPrompt',
      input: {schema: SuggestTagsInputSchema},
      output: {schema: SuggestTagsOutputSchema},
      prompt: `Based on the task description, suggest up to 5 relevant tags.
      Task Description: {{{taskDescription}}}`,
    });

    // 4. Define the flow that calls the prompt
    const suggestTagsFlow = ai.defineFlow({ ... }, async input => {
        const {output} = await prompt(input);
        return output!;
      }
    );
    ```

---

### State Management: React Context

*   **What it is:** React Context provides a way to pass data through the component tree without having to pass props down manually at every level. It's great for managing "global" state that many components need to access.

*   **Why we use it:** We use it to manage the list of tasks. The `TaskProvider` holds the state for all tasks. Any component in the app can then read the task list, or use functions to add, update, and delete tasks. This keeps our state logic centralized and clean.

*   **How we use it:** `TaskProvider` is wrapped around the application in `src/app/layout.tsx`. Components can then access the task data and functions using the `useTasks` hook.

    *File: `src/contexts/TaskProvider.tsx`*
    ```tsx
    'use client';

    import React, { createContext, useContext, useState } from 'react';

    const TaskContext = createContext<TaskContextType | undefined>(undefined);

    export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
      const [tasks, setTasks] = useState<Task[]>(initialTasks);

      const addTask = async (taskData: Omit<FirestoreTaskData, 'id'>) => {
        // ... logic to add a task
      };

      const updateTask = async (taskData: FirestoreTaskData) => {
        // ... logic to update a task
      };

      return (
        <TaskContext.Provider value={{ tasks, addTask, updateTask, ... }}>
          {children}
        </TaskContext.Provider>
      );
    };

    // The custom hook that components will use
    export const useTasks = () => {
      const context = useContext(TaskContext);
      if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
      }
      return context;
    };
    ```

---

### Forms & Validation: React Hook Form & Zod

*   **What it is:**
    *   **React Hook Form** is a library for managing form state, handling submissions, and displaying validation errors with minimal re-renders.
    *   **Zod** is a TypeScript-first schema declaration and validation library. You define the "shape" of your data, and Zod will ensure that any given data adheres to it.

*   **Why we use it:** They work perfectly together. Zod defines the rules for our form data (e.g., "title must be at least 3 characters"), and React Hook Form uses that schema to automatically validate the form fields and display error messages.

*   **How we use it:** In `src/components/tasks/task-form.tsx`, we define a Zod schema for a task, then pass it to `useForm`.

    *File: `src/components/tasks/task-form.tsx`*
    ```tsx
    import { zodResolver } from '@hookform/resolvers/zod';
    import { useForm } from 'react-hook-form';
    import * as z from 'zod';

    // 1. Define the validation schema with Zod
    const taskFormSchema = z.object({
      title: z.string().min(3, 'Title must be at least 3 characters.'),
      priority: z.enum(['low', 'medium', 'high']),
      // ... other fields
    });

    type TaskFormValues = z.infer<typeof taskFormSchema>;

    export function TaskForm({ onFinished, taskToEdit }: TaskFormProps) {
      // 2. Initialize the form with the schema
      const form = useForm<TaskFormValues>({
        resolver: zodResolver(taskFormSchema),
        // ...
      });

      // 3. The FormField component connects the UI to the form state
      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage /> {/* Displays validation errors */}
                </FormItem>
              )}
            />
            {/* ... other form fields */}
          </form>
        </Form>
      );
    }
    ```

---

### Icons: Lucide React

*   **What it is:** A simple and beautiful open-source icon library.

*   **Why we use it:** It provides a huge collection of consistent, high-quality icons that are easy to import and use within our React components.

*   **How we use it:** We import icons directly from `lucide-react` and can customize their size, color, and more using Tailwind classes.

    *File: `src/components/layout/app-sidebar.tsx`*
    ```tsx
    import {
      LayoutDashboard,
      Calendar,
      BarChart3,
      Folder,
    } from 'lucide-react';

    const navItems = [
      { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/calendar', icon: Calendar, label: 'Calendar' },
      { href: '/reports', icon: BarChart3, label: 'Reports' },
      { href: '/projects', icon: Folder, label: 'Projects' },
    ];
    ```

---

### Utilities

*   **date-fns:** Used for formatting dates. For example, turning a JavaScript `Date` object into a more readable string like "Nov 10, 2025".
*   **class-variance-authority (CVA) & clsx:** These are helper libraries used internally by ShadCN components and our own `cn` utility (`src/lib/utils.ts`). They allow us to conditionally apply Tailwind CSS classes, which is essential for creating dynamic and variant-based components (e.g., a button that has different styles for `primary`, `secondary`, or `destructive` variants).
