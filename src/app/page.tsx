'use client';

import { StatCards } from '@/components/dashboard/stat-cards';
import { KanbanBoard } from '@/components/dashboard/kanban-board';
import { TaskProvider } from '@/contexts/TaskProvider';

export default function Home() {
  return (
    <TaskProvider>
      <div className="flex flex-col gap-8">
        <StatCards />
        <KanbanBoard />
      </div>
    </TaskProvider>
  );
}
