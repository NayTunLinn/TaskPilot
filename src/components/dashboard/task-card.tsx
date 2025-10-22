'use client';

import { useState } from 'react';
import type { Task, TaskPriority } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CalendarIcon } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TaskForm } from '../tasks/task-form';

interface TaskCardProps {
  task: Task;
}

const priorityColors: Record<TaskPriority, string> = {
  high: 'bg-destructive',
  medium: 'bg-chart-4',
  low: 'bg-chart-2',
};

export function TaskCard({ task }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { title, priority, tags, dueDate, assignees } = task;
  const isOverdue = isPast(new Date(dueDate)) && task.status !== 'done';

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogTrigger asChild>
        <Card className="transform cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-medium leading-snug">{title}</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className={cn('h-3 w-3 rounded-full', priorityColors[priority])} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{priority} Priority</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span className={cn(isOverdue && 'font-semibold text-destructive')}>
                  {format(new Date(dueDate), 'MMM d')}
                </span>
              </div>
              <div className="flex -space-x-2">
                {assignees.map(user => (
                  <TooltipProvider key={user.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6 border-2 border-card">
                          <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
                          <AvatarFallback>{user.initials}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the details of your task. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          taskToEdit={task}
          onFinished={() => setIsEditDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
