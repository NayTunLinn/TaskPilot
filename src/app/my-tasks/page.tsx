'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/contexts/TaskProvider';
import { users } from '@/lib/data';
import { TaskCard } from '@/components/dashboard/task-card';

export default function MyTasksPage() {
  const { tasks } = useTasks();
  const currentUser = users[0];

  const myTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter(task =>
      task.assignees.some(assignee => assignee.id === currentUser.id)
    );
  }, [tasks, currentUser]);

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myTasks.length > 0 ? (
              myTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
              <p className="text-muted-foreground col-span-full">You have no tasks assigned to you.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
