import type { Task } from '@/lib/types';
import { TaskCard } from './task-card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ title, tasks }: KanbanColumnProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-card p-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="font-semibold">{title}</h2>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {tasks.length}
        </span>
      </div>
      <ScrollArea className="h-[65vh] flex-1">
        <div className="flex flex-col gap-3 pr-3">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
           {tasks.length === 0 && (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">No tasks</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
