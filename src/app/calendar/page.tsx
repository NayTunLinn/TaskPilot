'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useTasks } from '@/contexts/TaskProvider';
import { isSameDay, parseISO } from 'date-fns';
import { TaskCard } from '@/components/dashboard/task-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Expand, Shrink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [numberOfMonths, setNumberOfMonths] = useState(1);

  const taskDueDates = useMemo(() => {
    return tasks.map(task => parseISO(task.dueDate));
  }, [tasks]);

  const selectedDayTasks = useMemo(() => {
    if (!date) return [];
    return tasks.filter(task => isSameDay(parseISO(task.dueDate), date));
  }, [tasks, date]);

  const modifiers = {
    hasTasks: taskDueDates,
  };

  const modifiersClassNames = {
    hasTasks: 'bg-primary/20',
  };

  const handleToggleZoom = () => {
    setNumberOfMonths(prev => (prev === 1 ? 3 : 1));
  };

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 transition-all duration-300',
        numberOfMonths === 1 && 'md:grid-cols-2'
      )}
    >
      <Card
        className={cn(
          'transition-all duration-300',
          numberOfMonths > 1 && 'md:col-span-2'
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleZoom}
            >
              {numberOfMonths === 1 ? (
                <Expand className="h-4 w-4" />
              ) : (
                <Shrink className="h-4 w-4" />
              )}
              <span className="sr-only">{numberOfMonths === 1 ? 'Expand' : 'Shrink'}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            numberOfMonths={numberOfMonths}
          />
        </CardContent>
      </Card>
      <div
        className={cn(
          'transition-all duration-300',
          numberOfMonths > 1 ? 'md:col-span-2' : ''
        )}
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Tasks for {date ? date.toLocaleDateString() : 'selected day'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea
              className={cn(numberOfMonths === 1 ? 'h-[60vh]' : 'h-[30vh]')}
            >
              <div className="flex flex-col gap-4 pr-4">
                {selectedDayTasks.length > 0 ? (
                  selectedDayTasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                  ))
                ) : (
                  <p className="pt-10 text-center text-muted-foreground">
                    No tasks due on this day.
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
