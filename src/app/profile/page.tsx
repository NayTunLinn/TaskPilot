
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
import { useUser } from '@/firebase';
import { ProfileForm } from '@/components/profile/profile-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ProfilePage() {
  const { user: currentUser } = useUser();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  if (!currentUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
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

