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
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  onFinished: () => void;
  userToEdit?: UserProfile;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
}

export function UserForm({ onFinished, userToEdit }: UserFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const isEditMode = !!userToEdit;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: isEditMode
      ? {
          name: userToEdit.name,
          email: userToEdit.email,
        }
      : {
          name: '',
          email: '',
        },
  });

  async function onSubmit(data: UserFormValues) {
    if (!firestore) return;

    try {
      if (isEditMode && userToEdit) {
        // Update logic will be added later
        toast({
          title: 'User Updated',
          description: `"${data.name}" has been updated.`,
        });
        onFinished();
      } else {
        const randomAvatar = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)].imageUrl;
        await addDoc(collection(firestore, 'users'), {
          ...data,
          initials: getInitials(data.name),
          avatarUrl: randomAvatar,
        });
        toast({
          title: 'User Created',
          description: `User "${data.name}" has been created.`,
        });
        onFinished();
      }
    } catch (error: any) {
      console.error('Error saving user: ', error);
      toast({
        title: 'Uh oh! Something went wrong.',
        description: 'Could not save user.',
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
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g. john.smith@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">{isEditMode ? 'Save Changes' : 'Create User'}</Button>
        </div>
      </form>
    </Form>
  );
}
