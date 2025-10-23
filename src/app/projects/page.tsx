
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateProjectButton } from '@/components/projects/create-project-button';
import { Project } from '@/lib/types';
import { ProjectCard } from '@/components/projects/project-card';
import { projects as mockProjects } from '@/lib/data';
import { useState } from 'react';

export default function ProjectsPage() {
  // Using mock data since auth/db is removed
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const onProjectCreated = (newProject: Project) => {
    setProjects(prev => [...prev, newProject]);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Organize your tasks into projects.
          </p>
        </div>
        <CreateProjectButton onProjectCreated={onProjectCreated} />
      </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map(project => (
            <ProjectCard key={project.id} project={project as Project} />
          ))}
        </div>

       {projects?.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-24">
            <p>No projects found. Click "Add Project" to create one.</p>
          </div>
        )}
    </div>
  );
}
