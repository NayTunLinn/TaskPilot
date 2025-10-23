'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateProjectButton } from '@/components/projects/create-project-button';
import { useCollection, useFirestore } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { Project } from '@/lib/types';
import { ProjectCard } from '@/components/projects/project-card';

export default function ProjectsPage() {
  const firestore = useFirestore();

  const projectsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('name'));
  }, [firestore]);

  const { data: projects, loading } = useCollection(projectsQuery);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Organize your tasks into projects.
          </p>
        </div>
        <CreateProjectButton />
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
          {projects?.map(project => (
            <ProjectCard key={project.id} project={project as Project} />
          ))}
        </div>
      )}

       {!loading && projects?.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-24">
            <p>No projects found. Click "Add Project" to create one.</p>
          </div>
        )}
    </div>
  );
}
