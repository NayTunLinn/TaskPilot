'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useTasks } from '@/contexts/TaskProvider';
import { isSameDay, parseISO } from 'date-fns';
import { TaskCard } from '@/components/dashboard/task-card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CalendarPage() {
  const { tasks } = useTasks();
  const [date, setDate] = useState<Date | undefined>(new Date());

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

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Tasks for {date ? date.toLocaleDateString() : 'selected day'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <div className="flex flex-col gap-4 pr-4">
              {selectedDayTasks.length > 0 ? (
                selectedDayTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
              ) : (
                <p className="text-center text-muted-foreground pt-10">
                  No tasks due on this day.
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
