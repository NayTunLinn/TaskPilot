'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Team } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TeamForm } from './team-form';

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Card>
            <CardHeader>
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>{team.description}</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                {team.members.slice(0, 5).map(member => (
                    <TooltipProvider key={member.id}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="h-8 w-8 border-2 border-card">
                                    <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                                    <AvatarFallback>{member.initials}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{member.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
                {team.members.length > 5 && (
                    <Avatar className="h-8 w-8 border-2 border-card">
                        <AvatarFallback>+{team.members.length - 5}</AvatarFallback>
                    </Avatar>
                )}
                </div>
                <p className="text-sm text-muted-foreground">{team.members.length} member{team.members.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        Manage
                    </Button>
                </DialogTrigger>
            </div>
            </CardContent>
        </Card>
         <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
                <DialogTitle>Edit Team</DialogTitle>
                <DialogDescription>
                    Update the details for your team.
                </DialogDescription>
            </DialogHeader>
            <TeamForm teamToEdit={team} onFinished={() => setIsEditDialogOpen(false)} />
        </DialogContent>
    </Dialog>
  );
}
