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
import { useCollection } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Team } from '@/lib/types';
import { CreateTeamButton } from '@/components/teams/create-team-button';
import { TeamCard } from '@/components/teams/team-card';

export default function TeamsPage() {
  const firestore = useFirestore();
  const { data: teams, loading } = useCollection(
    firestore ? query(collection(firestore, 'teams'), orderBy('name')) : null
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and team members.
          </p>
        </div>
        <CreateTeamButton />
      </div>

      {loading && (
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse" />
                <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
              </CardHeader>
              <CardContent>
                 <div className="h-4 w-1/4 rounded-md bg-muted animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams?.map(team => (
            <TeamCard key={team.id} team={team as Team} />
          ))}
        </div>
      )}
       {!loading && teams?.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            <p>No teams found. Click "Add Team" to create one.</p>
          </div>
        )}
    </div>
  );
}
