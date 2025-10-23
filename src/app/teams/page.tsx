
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Team } from '@/lib/types';
import { CreateTeamButton } from '@/components/teams/create-team-button';
import { TeamCard } from '@/components/teams/team-card';
import { teams as mockTeams } from '@/lib/data';
import { useState } from 'react';


export default function TeamsPage() {
  const [teams, setTeams] = useState(mockTeams);

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams?.map(team => (
          <TeamCard key={team.id} team={team as Team} />
        ))}
      </div>

       {teams?.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            <p>No teams found. Click "Add Team" to create one.</p>
          </div>
        )}
    </div>
  );
}
