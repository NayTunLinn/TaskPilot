
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/components/profile/profile-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { users } from '@/lib/data';

export default function ProfilePage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // Using a mock user since auth is removed
  const currentUser = {
      displayName: 'Jane Doe',
      email: 'jane.d@example.com',
      photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjEwMzE4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  }


  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  return (
    <>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || ''} data-ai-hint="person portrait" />
              <AvatarFallback className="text-3xl">{getInitials(currentUser.displayName)}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl">{currentUser.displayName}</CardTitle>
          <CardDescription>{currentUser.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-muted-foreground">
              Manage your personal information and application settings.
            </p>
            <Button className="mt-6" onClick={() => setIsEditDialogOpen(true)}>Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    </>
  );
}

