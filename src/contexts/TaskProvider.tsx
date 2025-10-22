'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { initialTasks } from '@/lib/data';
import { produce } from 'immer';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const statusOrder: TaskStatus[] = ['todo', 'in-progress', 'review', 'done'];

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (task: Task) => {
    setTasks(produce(draft => {
      draft.unshift(task);
    }));
  };

  const simulateTaskProgress = useCallback(() => {
    setTasks(
      produce(draft => {
        // Find a task that is not 'done'
        const taskToUpdateIndex = draft.findIndex(t => t.status !== 'done');

        if (taskToUpdateIndex !== -1) {
          const task = draft[taskToUpdateIndex];
          const currentStatusIndex = statusOrder.indexOf(task.status);
          const nextStatusIndex = (currentStatusIndex + 1) % statusOrder.length;
          task.status = statusOrder[nextStatusIndex];
        }
      })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      simulateTaskProgress();
    }, 10000); // Auto-updates board every 10 seconds

    return () => clearInterval(interval);
  }, [simulateTaskProgress]);

  return (
    <TaskContext.Provider value={{ tasks, addTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
