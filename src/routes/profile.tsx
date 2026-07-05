import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockUser, mockStats } from "@/lib/mockData";
import { Github } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({ component: Profile });

function Profile() {
  return (
    <AppShell>
      <PageHeader title="Profile" description="Manage your public profile and connected accounts." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="h-24 w-24"><AvatarImage src={mockUser.avatar} alt={mockUser.name} /><AvatarFallback>AC</AvatarFallback></Avatar>
            <h2 className="mt-4 text-lg font-semibold">{mockUser.name}</h2>
            <p className="text-sm text-muted-foreground">{mockUser.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{mockUser.plan} plan</div>
            <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground"><Github className="h-4 w-4" /> @{mockUser.githubUsername}</div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Statistics</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { l: "Reviews", v: mockStats.reviews },
                { l: "Projects", v: mockStats.projects },
                { l: "Avg. Score", v: mockStats.averageScore },
                { l: "Lines", v: mockStats.linesReviewed.toLocaleString() },
              ].map((s) => (
                <div key={s.l} className="rounded-lg border p-4">
                  <div className="text-2xl font-semibold">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Edit profile</CardTitle></CardHeader>
            <CardContent>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Profile updated (mock)"); }}>
                <div className="space-y-1.5"><Label>Name</Label><Input defaultValue={mockUser.name} /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input defaultValue={mockUser.email} /></div>
                <div className="space-y-1.5"><Label>GitHub username</Label><Input defaultValue={mockUser.githubUsername} /></div>
                <div className="space-y-1.5"><Label>Location</Label><Input placeholder="San Francisco, CA" /></div>
                <div className="sm:col-span-2"><Button type="submit">Save changes</Button></div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}