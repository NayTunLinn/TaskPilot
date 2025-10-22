'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTasks } from '@/contexts/TaskProvider';
import { isPast } from 'date-fns';
import { ListTodo, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

export function StatCards() {
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = tasks.filter(
      t => t.status !== 'done' && isPast(new Date(t.dueDate))
    ).length;
    return { total, completed, inProgress, overdue };
  }, [tasks]);

  const cardData = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-primary',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-chart-2',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Loader2,
      color: 'text-chart-4',
      className: 'animate-spin',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-destructive',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cardData.map(card => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-5 w-5 text-muted-foreground ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
