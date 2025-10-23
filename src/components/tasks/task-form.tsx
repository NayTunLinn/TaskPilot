
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Sparkles, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTasks } from '@/contexts/TaskProvider';
import { TagInput } from './tag-input';
import { suggestTags } from '@/ai/flows/ai-suggested-tags';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Task, User, Project } from '@/lib/types';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Separator } from '../ui/separator';

const subTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Sub-task title cannot be empty.'),
  completed: z.boolean(),
});

const taskFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
  projectId: z.string().min(1, 'Please select a project.'),
  assigneeIds: z.array(z.string()).min(1, 'Please select at least one assignee.'),
  dueDate: z.date({
    required_error: 'A due date is required.',
  }),
  tags: z.array(z.string()).optional(),
  subTasks: z.array(subTaskSchema).optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onFinished: () => void;
  taskToEdit?: Task;
}

export function TaskForm({ onFinished, taskToEdit }: TaskFormProps) {
  const { addTask, updateTask } = useTasks();
  const { toast } = useToast();
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const isEditMode = !!taskToEdit;
  const firestore = useFirestore();

  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('name'));
  }, [firestore]);
  const { data: users, loading: loadingUsers } = useCollection(usersQuery);

  const projectsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('name'));
  }, [firestore]);
  const { data: projects, loading: loadingProjects } = useCollection(projectsQuery);


  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: isEditMode
      ? {
          ...taskToEdit,
          projectId: taskToEdit.project.id,
          assigneeIds: taskToEdit.assignees.map(a => a.id),
          dueDate: new Date(taskToEdit.dueDate),
          subTasks: taskToEdit.subTasks || [],
        }
      : {
          title: '',
          description: '',
          priority: 'medium',
          status: 'todo',
          assigneeIds: [],
          tags: [],
          subTasks: [],
        },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "subTasks",
  });

  const handleSuggestTags = async () => {
    const description = form.getValues('description');
    if (!description || description.length < 10) {
      toast({
        title: 'Description too short',
        description: 'Please enter a more detailed description to get tag suggestions.',
        variant: 'destructive',
      });
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await suggestTags({ taskDescription: description });
      setSuggestedTags(result.tags);
    } catch (error) {
      console.error('Error suggesting tags:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch tag suggestions.',
        variant: 'destructive',
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  async function onSubmit(data: TaskFormValues) {
    if (!users || !projects) return;

    try {
        const payload = {
            ...data,
            dueDate: data.dueDate.toISOString(),
            tags: data.tags || [],
            description: data.description || '',
            subTasks: data.subTasks || [],
        };

      if (isEditMode && taskToEdit) {
        await updateTask({
          id: taskToEdit.id,
          ...payload
        });
        toast({
          title: 'Task Updated',
          description: `"${data.title}" has been updated.`,
        });
      } else {
        await addTask(payload);
        toast({
          title: 'Task Created',
          description: `"${data.title}" has been added to the board.`,
        });
      }
      onFinished();
    } catch (error) {
       console.error('Error saving task:', error);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Could not save task.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Design a new logo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add more details about the task..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />
        
        <div>
            <FormLabel>Sub-tasks</FormLabel>
            <div className="mt-2 space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                         <Checkbox
                            checked={field.completed}
                            onCheckedChange={(checked) => {
                                update(index, { ...field, completed: !!checked });
                            }}
                        />
                        <Input
                            {...form.register(`subTasks.${index}.title`)}
                            className="flex-1"
                            placeholder="Sub-task description"
                        />
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                ))}
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ id: `subtask-${Date.now()}`, title: '', completed: false })}
                >
                    Add Sub-task
                </Button>
            </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
           <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects?.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="assigneeIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Assignees</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" role="combobox" className={cn('justify-between h-auto min-h-10', !field.value?.length && 'text-muted-foreground')}>
                      <div className="flex flex-wrap gap-1">
                        {field.value?.length > 0 && users
                          ? users
                              .filter(u => field.value.includes(u.id))
                              .map(u => <Badge key={u.id} variant="secondary">{u.name}</Badge>)
                          : 'Select assignees'}
                      </div>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {users?.map(user => {
                          const isSelected = field.value.includes(user.id);
                          return (
                            <CommandItem
                              key={user.id}
                              onSelect={() => {
                                const newSelection = isSelected
                                  ? field.value.filter(id => id !== user.id)
                                  : [...field.value, user.id];
                                field.onChange(newSelection);
                              }}
                              onPointerDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  const newSelection = isSelected
                                    ? field.value.filter((id) => id !== user.id)
                                    : [...field.value, user.id];
                                  field.onChange(newSelection);
                                }
                              }}
                            >
                              <Checkbox checked={isSelected} className="mr-2" />
                              {user.name}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Tags</FormLabel>
                <Button type="button" variant="ghost" size="sm" onClick={handleSuggestTags} disabled={isSuggesting}>
                  <Sparkles className={cn('mr-2 h-4 w-4', isSuggesting && 'animate-spin')} />
                  Suggest Tags
                </Button>
              </div>
              <FormControl>
                <TagInput
                  {...field}
                  value={field.value || []}
                  suggestedTags={suggestedTags}
                  onClearSuggestions={() => setSuggestedTags([])}
                />
              </FormControl>
              <FormDescription>
                Add tags to categorize this task. Use AI to get suggestions based on the description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Task'}</Button>
        </div>
      </form>
    </Form>
  );
}
