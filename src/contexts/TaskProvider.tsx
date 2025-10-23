
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, TaskStatus, User, Project, FirestoreTaskData } from '@/lib/types';
import { produce } from 'immer';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, doc, setDoc, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<FirestoreTaskData, 'id'>) => Promise<void>;
  updateTask: (task: FirestoreTaskData) => Promise<void>;
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

  const addTask = async (taskData: Omit<FirestoreTaskData, 'id'>) => {
    if (!firestore) return;
    const taskCollection = collection(firestore, 'tasks');
    await addDoc(taskCollection, taskData);
  };

  const updateTask = async (taskData: FirestoreTaskData) => {
    if (!firestore) return;
    const { id, ...rest } = taskData;
    const taskRef = doc(firestore, 'tasks', id);
    await setDoc(taskRef, rest, { merge: true });
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
