'use client';

import { StatCards } from '@/components/dashboard/stat-cards';
import { KanbanBoard } from '@/components/dashboard/kanban-board';

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <StatCards />
      <KanbanBoard />
    </div>
  );
}
