'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/contexts/TaskProvider';
import { useUser } from '@/firebase';
import { TaskCard } from '@/components/dashboard/task-card';

export default function MyTasksPage() {
  const { tasks } = useTasks();
  const { user: currentUser } = useUser();

  const myTasks = useMemo(() => {
    if (!currentUser) return [];
    return tasks.filter(task =>
      task.assignees.some(assignee => assignee.id === currentUser.uid)
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
              <p className="col-span-full py-12 text-center text-muted-foreground">You have no tasks assigned to you.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
