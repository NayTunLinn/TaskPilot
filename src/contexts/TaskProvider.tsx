
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Task, TaskStatus, User, Project, FirestoreTaskData } from '@/lib/types';
import { produce } from 'immer';
import { initialTasks, projects, users } from '@/lib/data';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<FirestoreTaskData, 'id'>) => Promise<void>;
  updateTask: (task: FirestoreTaskData) => Promise<void>;
  deleteTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const enrichTask = (taskData: FirestoreTaskData | Omit<FirestoreTaskData, 'id'>): Task => {
    const project = projects.find(p => p.id === taskData.projectId);
    const assignees = users.filter(u => taskData.assigneeIds.includes(u.id));
    return {
        ...taskData,
        id: 'id' in taskData ? taskData.id : `task-${Date.now()}`,
        project: project || projects[0],
        assignees: assignees,
    } as Task;
}


export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = async (taskData: Omit<FirestoreTaskData, 'id'>) => {
    const newTask = enrichTask(taskData);
    setTasks(produce(draft => {
      draft.push(newTask);
    }));
  };

  const updateTask = async (taskData: FirestoreTaskData) => {
    const updatedTask = enrichTask(taskData);
    setTasks(produce(draft => {
        const index = draft.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
            draft[index] = updatedTask;
        }
    }));
  };
  
  const deleteTask = async (taskId: string) => {
     setTasks(produce(draft => {
        const index = draft.findIndex(t => t.id === taskId);
        if (index !== -1) {
            draft.splice(index, 1);
        }
    }));
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
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
