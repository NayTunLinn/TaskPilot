
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateUserButton } from '@/components/users/create-user-button';
import { users as mockUsers } from '@/lib/data';

export default function UsersPage() {
  const users = mockUsers;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user profiles.</p>
        </div>
        <CreateUserButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={user.avatarUrl}
                              alt={user.name}
                              data-ai-hint="person portrait"
                            />
                            <AvatarFallback>{user.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              @{user.name.toLowerCase().replace(/\s+/g, '')}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          {users?.length === 0 && (
            <div className="py-24 text-center text-muted-foreground">
              <p>No users found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
