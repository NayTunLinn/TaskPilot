'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyTasksPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is where your tasks will be displayed.</p>
      </CardContent>
    </Card>
  );
}
