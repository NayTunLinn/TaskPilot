'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, TaskStatus, User, Project } from '@/lib/types';
import { produce } from 'immer';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, doc, setDoc, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'project' | 'assignees'> & { projectId: string; assigneeIds: string[] }) => void;
  updateTask: (task: Omit<Task, 'project' | 'assignees'> & { projectId: string; assigneeIds: string[] }) => void;
  deleteTask: (taskId: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const firestore = useFirestore();

  const tasksQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'tasks');
  }, [firestore]);

  const projectsQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'projects');
  }, [firestore]);

  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: tasksData, loading: tasksLoading } = useCollection(tasksQuery);
  const { data: projectsData, loading: projectsLoading } = useCollection(projectsQuery);
  const { data: usersData, loading: usersLoading } = useCollection(usersQuery);

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!tasksLoading && !projectsLoading && !usersLoading && tasksData && projectsData && usersData) {
      const enrichedTasks = tasksData.map(task => {
        const project = projectsData.find(p => p.id === task.projectId) as Project;
        const assignees = usersData.filter(u => task.assigneeIds?.includes(u.id)) as User[];
        return {
          ...task,
          id: task.id,
          project,
          assignees,
        } as Task;
      });
      setTasks(enrichedTasks);
    }
  }, [tasksData, projectsData, usersData, tasksLoading, projectsLoading, usersLoading]);

  const addTask = async (task: Omit<Task, 'id' | 'project' | 'assignees'> & { projectId: string; assigneeIds: string[] }) => {
    if (!firestore) return;
    const { projectId, assigneeIds, ...rest } = task;
    const taskCollection = collection(firestore, 'tasks');
    await addDoc(taskCollection, {
      ...rest,
      projectId,
      assigneeIds,
    });
  };

  const updateTask = async (task: Omit<Task, 'project' | 'assignees'> & { projectId: string; assigneeIds: string[] }) => {
    if (!firestore) return;
    const { id, projectId, assigneeIds, ...rest } = task;
    const taskRef = doc(firestore, 'tasks', id);
    await setDoc(taskRef, {
        ...rest,
        projectId,
        assigneeIds,
    }, { merge: true });
  };
  
  const deleteTask = async (taskId: string) => {
    if (!firestore) return;
    const taskRef = doc(firestore, 'tasks', taskId);
    await deleteDoc(taskRef);
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
