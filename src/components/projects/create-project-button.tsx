
'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { ProjectForm } from './project-form';
import { useState } from 'react';
import type { Project } from '@/lib/types';

interface CreateProjectButtonProps {
  onProjectCreated: (project: Project) => void;
}

export function CreateProjectButton({ onProjectCreated }: CreateProjectButtonProps) {
  const [open, setOpen] = useState(false);

  const handleFinished = (project?: Project) => {
    if (project) {
        onProjectCreated(project);
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new project.
          </DialogDescription>
        </DialogHeader>
        <ProjectForm onFinished={handleFinished} />
      </DialogContent>
    </Dialog>
  );
}
