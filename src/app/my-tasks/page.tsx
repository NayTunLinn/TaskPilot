'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/contexts/TaskProvider';
import { useUser } from '@/firebase';
import { TaskCard } from '@/components/dashboard/task-card';
import { TaskListView } from '@/components/tasks/task-list-view';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '@/lib/types';
import { isAfter, isBefore, parseISO } from 'date-fns';

type SortableField = 'title' | 'priority' | 'status' | 'dueDate';
type SortDirection = 'asc' | 'desc';

const priorityOrder: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
const statusOrder: Record<TaskStatus, number> = { todo: 0, 'in-progress': 1, review: 2, done: 3 };

export default function MyTasksPage() {
  const { tasks } = useTasks();
  const { user: currentUser } = useUser();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<{ by: SortableField; dir: SortDirection }>({ by: 'dueDate', dir: 'asc' });

  const myTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter(task =>
      task.assignees.some(assignee => assignee.id === currentUser.uid)
    );
  }, [tasks, currentUser]);
  
  const sortedTasks = useMemo(() => {
    return [...myTasks].sort((a, b) => {
        const { by, dir } = sort;
        const dirMultiplier = dir === 'asc' ? 1 : -1;

        switch (by) {
            case 'priority':
                return (priorityOrder[a.priority] - priorityOrder[b.priority]) * dirMultiplier;
            case 'status':
                return (statusOrder[a.status] - statusOrder[b.status]) * dirMultiplier;
            case 'dueDate':
                const dateA = parseISO(a.dueDate);
                const dateB = parseISO(b.dueDate);
                if (isBefore(dateA, dateB)) return -1 * dirMultiplier;
                if (isAfter(dateA, dateB)) return 1 * dirMultiplier;
                return 0;
            case 'title':
                 return a.title.localeCompare(b.title) * dirMultiplier;
            default:
                return 0;
        }
    })
  }, [myTasks, sort]);

  const handleSort = (field: SortableField) => {
    if (sort.by === field) {
        setSort({ ...sort, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
        setSort({ by: field, dir: 'asc' });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Tasks</CardTitle>
           <div className="flex items-center gap-2">
             <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}>
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only">Grid View</span>
            </Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}>
                <List className="h-4 w-4" />
                <span className="sr-only">List View</span>
            </Button>
           </div>
        </CardHeader>
        <CardContent>
          {sortedTasks.length === 0 ? (
             <p className="col-span-full py-12 text-center text-muted-foreground">You have no tasks assigned to you.</p>
          ) : view === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          ) : (
            <TaskListView tasks={sortedTasks} sort={sort} onSort={handleSort} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
