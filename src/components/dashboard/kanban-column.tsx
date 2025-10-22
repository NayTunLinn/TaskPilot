import type { Task } from '@/lib/types';
import { TaskCard } from './task-card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ title, tasks }: KanbanColumnProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg bg-card p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-semibold text-primary">
          {tasks.length}
        </span>
      </div>
      <ScrollArea className="h-[60vh] flex-1">
        <div className="flex flex-col gap-4 pr-4">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
