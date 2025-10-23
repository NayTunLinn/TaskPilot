
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Team, UserProfile } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useCollection } from '@/firebase';
import { useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Checkbox } from '../ui/checkbox';

const teamFormSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters.'),
  description: z.string().optional(),
  memberIds: z.array(z.string()).optional(),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

interface TeamFormProps {
  onFinished: () => void;
  teamToEdit?: Team;
}

export function TeamForm({ onFinished, teamToEdit }: TeamFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const isEditMode = !!teamToEdit;

  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: users, loading: loadingUsers } = useCollection(usersQuery);

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: isEditMode
      ? {
          name: teamToEdit.name,
          description: teamToEdit.description,
          memberIds: teamToEdit.members.map(m => m.id),
        }
      : {
          name: '',
          description: '',
          memberIds: [],
        },
  });

  async function onSubmit(data: TeamFormValues) {
    if (!firestore || !users) return;

    const selectedMembers = users.filter(user => data.memberIds?.includes(user.id));

    try {
      if (isEditMode && teamToEdit) {
        const teamRef = doc(firestore, 'teams', teamToEdit.id);
        await setDoc(teamRef, {
            ...data,
            members: selectedMembers,
        }, { merge: true });
        toast({
          title: 'Team Updated',
          description: `"${data.name}" has been updated.`,
        });
      } else {
        await addDoc(collection(firestore, 'teams'), {
          ...data,
          members: selectedMembers,
        });
        toast({
          title: 'Team Created',
          description: `Team "${data.name}" has been created.`,
        });
      }
      onFinished();
    } catch (error: any) {
      console.error('Error saving team: ', error);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Could not save team.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Frontend Developers" {...field} />
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
                <Textarea placeholder="What is this team responsible for?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memberIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Members</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'justify-between h-auto min-h-10',
                        !field.value?.length && 'text-muted-foreground'
                      )}
                    >
                      <div className="flex flex-wrap gap-1">
                        {field.value && field.value.length > 0
                          ? users
                              ?.filter(u => field.value?.includes(u.id))
                              .map(u => (
                                <Badge key={u.id} variant="secondary">
                                  {u.name}
                                </Badge>
                              ))
                          : 'Select members'}
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
                          const isSelected = field.value?.includes(user.id) ?? false;
                          return (
                            <CommandItem
                              key={user.id}
                              onSelect={() => {
                                const currentIds = field.value || [];
                                const newSelection = isSelected
                                  ? currentIds.filter(id => id !== user.id)
                                  : [...currentIds, user.id];
                                field.onChange(newSelection);
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

        <div className="flex justify-end">
          <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Team'}</Button>
        </div>
      </form>
    </Form>
  );
}
