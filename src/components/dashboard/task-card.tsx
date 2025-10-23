'use client';

import { useState } from 'react';
import type { Task, TaskPriority, TaskStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  CalendarIcon,
  ChevronDown,
  Flag,
  CircleDotDashed,
} from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { useTasks } from '@/contexts/TaskProvider';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';

interface TaskCardProps {
  task: Task;
}

const priorityColors: Record<TaskPriority, string> = {
  high: 'text-destructive',
  medium: 'text-chart-4',
  low: 'text-chart-2',
};

const priorityIcons: Record<TaskPriority, React.ElementType> = {
  high: Flag,
  medium: Flag,
  low: Flag,
};

const statusIcons: Record<TaskStatus, React.ElementType> = {
  todo: CircleDotDashed,
  'in-progress': CircleDotDashed,
  review: CircleDotDashed,
  done: CircleDotDashed,
};


export function TaskCard({ task }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { updateTask } = useTasks();
  const { title, priority, tags, dueDate, assignees, status } = task;
  const isOverdue = isPast(new Date(dueDate)) && task.status !== 'done';

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask({ ...task, status: newStatus });
  };

  const handlePriorityChange = (newPriority: TaskPriority) => {
    updateTask({ ...task, priority: newPriority });
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      updateTask({ ...task, dueDate: newDate.toISOString() });
    }
  };
  
  const PriorityIcon = priorityIcons[priority];

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <Card className="transform transition-all duration-300 hover:shadow-lg">
        <div
          className="cursor-pointer p-4"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <CardHeader className="p-0 pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-medium leading-snug">
                {title}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="mb-3 flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {assignees.map(user => (
                  <TooltipProvider key={user.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6 border-2 border-card">
                          <AvatarImage
                            src={user.avatarUrl}
                            alt={user.name}
                            data-ai-hint="person portrait"
                          />
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
        </div>
        <div className="flex items-center gap-2 border-t p-2">
          {/* Status quick-edit */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 justify-center capitalize"
              >
                {status.replace('-', ' ')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={status}
                onValueChange={value => handleStatusChange(value as TaskStatus)}
              >
                <DropdownMenuRadioItem value="todo">To Do</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="in-progress">
                  In Progress
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="review">
                  Review
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="done">Done</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority quick-edit */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <PriorityIcon
                  className={cn('h-4 w-4', priorityColors[priority])}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={priority}
                onValueChange={value =>
                  handlePriorityChange(value as TaskPriority)
                }
              >
                <DropdownMenuRadioItem value="low">Low</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">
                  Medium
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high">High</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Due date quick-edit */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'text-muted-foreground',
                  isOverdue && 'font-semibold text-destructive'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(dueDate), 'MMM d')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={new Date(dueDate)}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </Card>
      {isEditDialogOpen && (
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
      )}
    </Dialog>
  );
}
