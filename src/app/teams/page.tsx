'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const teams = [
    {
        id: 'team-1',
        name: 'Frontend Developers',
        description: 'Responsible for the user interface and user experience.',
        members: [
            { id: 'user-1', name: 'Jane Doe', initials: 'JD', avatarUrl: '...' },
            { id: 'user-2', name: 'John Smith', initials: 'JS', avatarUrl: '...' },
        ]
    },
    {
        id: 'team-2',
        name: 'Backend Engineers',
        description: 'Manages the server-side logic and database.',
        members: [
             { id: 'user-3', name: 'Alex Brown', initials: 'AB', avatarUrl: '...' },
        ]
    },
    {
        id: 'team-3',
        name: 'Marketing',
        description: 'In charge of product promotion and communication.',
        members: [
            { id: 'user-4', name: 'Sarah Connor', initials: 'SC', avatarUrl: '...' },
        ]
    }
]


export default function TeamsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and team members.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2" />
          Add Team
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map(team => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
              <CardDescription>{team.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex -space-x-2">
                 <p className="text-sm text-muted-foreground">{team.members.length} members</p>
              </div>
               <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
