'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { users } from '@/lib/data';

export default function ProfilePage() {
  const currentUser = users[0];

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint="person portrait" />
            <AvatarFallback className="text-3xl">{currentUser.initials}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-3xl">{currentUser.name}</CardTitle>
        <CardDescription>Software Engineer at TaskPilot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-muted-foreground">
            {currentUser.name} is a dedicated team member, contributing to various projects with a focus on frontend development and user experience.
          </p>
          <Button className="mt-6">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}
