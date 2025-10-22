'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="jane.doe@example.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive an email for important updates and mentions.
                </span>
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span>Push Notifications</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                  Get real-time alerts on your devices.
                </span>
              </Label>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                 <span className="font-normal leading-snug text-muted-foreground">
                  Toggle between light and dark themes.
                </span>
              </Label>
               <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
