
'use client';

import { useState } from 'react';
import type { SubTask, Task, TaskPriority, TaskStatus } from '@/lib/types';
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
  CheckCircle,
} from 'lucide-react';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Progress } from '../ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Checkbox } from '../ui/checkbox';

interface TaskCardProps {
  task: Task;
}

const priorityStyles: Record<
  TaskPriority,
  { iconColor: string; borderColor: string; bgColor: string }
> = {
  high: {
    iconColor: 'text-destructive',
    borderColor: 'border-l-destructive',
    bgColor: 'bg-destructive/20',
  },
  medium: {
    iconColor: 'text-chart-4',
    borderColor: 'border-l-chart-4',
    bgColor: 'bg-chart-4/20',
  },
  low: {
    iconColor: 'text-chart-2',
    borderColor: 'border-l-chart-2',
    bgColor: 'bg-chart-2/20',
  },
};

const priorityIcons: Record<TaskPriority, React.ElementType> = {
  high: Flag,
  medium: Flag,
  low: Flag,
};

export function TaskCard({ task }: TaskCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { updateTask } = useTasks();
  const { title, priority, tags, dueDate, assignees, status, subTasks } = task;
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
  
  const handleSubTaskToggle = (subTaskId: string) => {
    const newSubTasks = subTasks?.map(st => st.id === subTaskId ? {...st, completed: !st.completed} : st);
    updateTask({...task, subTasks: newSubTasks});
  }

  const PriorityIcon = priorityIcons[priority];
  const styles = priorityStyles[priority];
  const completedSubTasks = subTasks?.filter(st => st.completed).length || 0;
  const subTaskProgress = subTasks?.length ? (completedSubTasks / subTasks.length) * 100 : 0;

  return (
    <>
      <Card
        onClick={() => setIsEditDialogOpen(true)}
        className={cn(
          'border-l-4 transform transition-all duration-200 hover:shadow-lg hover:-translate-y-px cursor-pointer',
          styles.borderColor
        )}
      >
        <div
          className="p-3"
        >
          <div >
            <CardHeader className="p-0 pb-2">
              <CardTitle className="text-sm font-medium leading-snug">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              {tags?.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </div>
            
             {subTasks && subTasks.length > 0 && (
                <Collapsible onClick={e => e.stopPropagation()}>
                    <div className="my-3 space-y-2">
                        <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between text-xs text-muted-foreground hover:bg-muted p-1 rounded-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>{completedSubTasks}/{subTasks.length} Sub-tasks</span>
                                </div>
                                <ChevronDown className="h-4 w-4 transition-transform [&[data-state=open]]:rotate-180" />
                            </div>
                        </CollapsibleTrigger>
                        <Progress value={subTaskProgress} className="h-2" />
                        <CollapsibleContent className="space-y-2 pt-2">
                           {subTasks.map(subtask => (
                             <div key={subtask.id} className="flex items-center gap-2 text-sm p-1 rounded-sm hover:bg-muted/50">
                               <Checkbox 
                                 id={`subtask-${subtask.id}`}
                                 checked={subtask.completed} 
                                 onCheckedChange={() => handleSubTaskToggle(subtask.id)}
                               />
                               <label htmlFor={`subtask-${subtask.id}`} className={cn("flex-1", subtask.completed && "line-through text-muted-foreground")}>
                                {subtask.title}
                               </label>
                             </div>
                           ))}
                        </CollapsibleContent>
                    </div>
                </Collapsible>
            )}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {assignees.map(user => (
                    <TooltipProvider key={user.id} delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-5 w-5 border-2 border-card">
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
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn('h-6 w-6 rounded-full', styles.bgColor)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <PriorityIcon
                        className={cn('h-3.5 w-3.5', styles.iconColor)}
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuRadioGroup
                      value={priority}
                      onValueChange={value =>
                        handlePriorityChange(value as TaskPriority)
                      }
                    >
                      <DropdownMenuRadioItem value="low">
                        Low
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="medium">
                        Medium
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="high">
                        High
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        'h-6 gap-1 px-1 text-xs',
                        isOverdue && 'font-semibold text-destructive'
                      )}
                    >
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {format(new Date(dueDate), 'MMM d')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end" onClick={(e) => e.stopPropagation()}>
                    <Calendar
                      mode="single"
                      selected={new Date(dueDate)}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
        </div>
        <div className="border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center rounded-t-none text-xs capitalize text-muted-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                {status.replace('-', ' ')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              <DropdownMenuRadioGroup
                value={status}
                onValueChange={value => handleStatusChange(value as TaskStatus)}
              >
                <DropdownMenuRadioItem value="todo">To Do</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="in-progress">
                  In Progress
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="review">Review</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="done">Done</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
    </>
  );
}
