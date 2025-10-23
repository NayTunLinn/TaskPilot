'use client';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import type { Task, TaskPriority, TaskStatus } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { TaskCard } from '../dashboard/task-card';

type SortableField = 'title' | 'priority' | 'status' | 'dueDate';
type SortDirection = 'asc' | 'desc';

interface TaskListViewProps {
  tasks: Task[];
  sort: { by: SortableField; dir: SortDirection };
  onSort: (field: SortableField) => void;
}


const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-chart-2',
  medium: 'bg-chart-4',
  high: 'bg-destructive',
};

export function TaskListView({ tasks, sort, onSort }: TaskListViewProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const handleRowClick = (taskId: string) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
  };

  const SortableHeader = ({ field, children }: { field: SortableField, children: React.ReactNode }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => onSort(field)}>
        {children}
        <ArrowUpDown className={cn("ml-2 h-4 w-4", sort.by === field ? "" : "text-muted-foreground")} />
      </Button>
    </TableHead>
  );

  return (
     <div className="overflow-x-auto rounded-md border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <SortableHeader field="title">Task</SortableHeader>
                    <TableHead>Project</TableHead>
                    <SortableHeader field="status">Status</SortableHeader>
                    <SortableHeader field="priority">Priority</SortableHeader>
                    <SortableHeader field="dueDate">Due Date</SortableHeader>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map(task => (
                    <>
                        <TableRow key={task.id} onClick={() => handleRowClick(task.id)} className="cursor-pointer">
                            <TableCell></TableCell>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{task.project?.name || 'N/A'}</TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="capitalize">
                                    {task.status.replace('-', ' ')}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2.5 w-2.5 rounded-full ${priorityColors[task.priority]}`} />
                                    <span className="capitalize">{task.priority}</span>
                                </div>
                            </TableCell>
                            <TableCell>{format(new Date(task.dueDate), 'MMM d, yyyy')}</TableCell>
                        </TableRow>
                        {expandedTaskId === task.id && (
                             <TableRow>
                                <TableCell colSpan={6}>
                                    <div className="p-4">
                                      <TaskCard task={task} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
