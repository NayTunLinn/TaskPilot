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
import { Team } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

const teamFormSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters.'),
  description: z.string().optional(),
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

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: isEditMode
      ? {
          name: teamToEdit.name,
          description: teamToEdit.description,
        }
      : {
          name: '',
          description: '',
        },
  });

  async function onSubmit(data: TeamFormValues) {
    if (!firestore) return;

    try {
      if (isEditMode && teamToEdit) {
        // Update logic will be added later
        toast({
          title: 'Team Updated',
          description: `"${data.name}" has been updated.`,
        });
        onFinished();
      } else {
        await addDoc(collection(firestore, 'teams'), {
          ...data,
          members: [], // Start with no members
        });
        toast({
          title: 'Team Created',
          description: `Team "${data.name}" has been created.`,
        });
        onFinished();
      }
    } catch (error: any) {
        console.error("Error saving team: ", error);
        toast({
            title: "Uh oh! Something went wrong.",
            description: "Could not save team.",
            variant: "destructive",
        })
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

        <div className="flex justify-end">
          <Button type="submit">{isEditMode ? 'Save Changes' : 'Create Team'}</Button>
        </div>
      </form>
    </Form>
  );
}
