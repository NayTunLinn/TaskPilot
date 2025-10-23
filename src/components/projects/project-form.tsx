
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
import { Project } from '@/lib/types';

const projectFormSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters.'),
  description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  onFinished: (project?: Project) => void;
  projectToEdit?: Project;
}

export function ProjectForm({ onFinished, projectToEdit }: ProjectFormProps) {
  const { toast } = useToast();
  const isEditMode = !!projectToEdit;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: isEditMode
      ? {
          name: projectToEdit.name,
          description: projectToEdit.description,
        }
      : {
          name: '',
          description: '',
        },
  });

  async function onSubmit(data: ProjectFormValues) {
    try {
      if (isEditMode && projectToEdit) {
        // This would be a call to an update function
        console.log('Updating project', { ...projectToEdit, ...data });
        toast({
          title: 'Project Updated',
          description: `"${data.name}" has been updated.`,
        });
        onFinished({ ...projectToEdit, ...data });
      } else {
        const newProject = {
          id: `proj-${Date.now()}`,
          ...data,
        }
        console.log('Creating project', newProject);
        toast({
          title: 'Project Created',
          description: `Project "${data.name}" has been created.`,
        });
        onFinished(newProject);
      }
    } catch (error: any) {
      console.error('Error saving project: ', error);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Could not save project.',
        variant: 'destructive',
      });
      onFinished();
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
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Website Redesign" {...field} />
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
                <Textarea
                  placeholder="What is this project about?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">
            {isEditMode ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
