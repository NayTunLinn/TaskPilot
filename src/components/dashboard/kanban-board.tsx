'use client';

import { useTasks } from '@/contexts/TaskProvider';
import { KanbanColumn } from './kanban-column';
import type { TaskStatus } from '@/lib/types';
import { useMemo } from 'react';

const columns: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

export function KanbanBoard() {
  const { tasks } = useTasks();

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, any[]> = {
      todo: [],
      'in-progress': [],
      review: [],
      done: [],
    };
    tasks.forEach(task => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {columns.map(column => (
        <KanbanColumn
          key={column.id}
          title={column.title}
          tasks={tasksByStatus[column.id]}
        />
      ))}
    </div>
  );
}
