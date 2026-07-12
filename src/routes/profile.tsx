import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserProfile } from "@/services/userService";
import { Github } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({ component: Profile });

interface ProfileStats {
  totalReviews: number;
  averageScore: number;
  linesReviewed: number;
  projectsReviewed: number;
}

interface ProfileData {
  name: string;
  email: string;
  githubUsername: string;
  location: string;
  createdAt: string;
  stats: ProfileStats;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You need to be logged in to view your profile.");
          setLoading(false);
          return;
        }

        const res = await getUserProfile(token);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Profile"
        description="Manage your public profile and connected accounts."
      />

      {error && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {!error && loading && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!error && !loading && profile && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <Avatar className="h-24 w-24">
                <AvatarFallback>{getInitials(profile.name) || "?"}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-lg font-semibold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              {profile.githubUsername && (
                <div className="mt-4 flex items-center gap-1 text-sm text-muted-foreground">
                  <Github className="h-4 w-4" /> @{profile.githubUsername}
                </div>
              )}
              {profile.location && (
                <div className="mt-1 text-sm text-muted-foreground">{profile.location}</div>
              )}
              {profile.createdAt && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Joined{" "}
                  {new Date(profile.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { l: "Reviews", v: profile.stats.totalReviews },
                  { l: "Projects", v: profile.stats.projectsReviewed },
                  { l: "Avg. Score", v: profile.stats.averageScore },
                  { l: "Lines", v: profile.stats.linesReviewed.toLocaleString() },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg border p-4">
                    <div className="text-2xl font-semibold">{s.v}</div>
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Edit profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  className="grid gap-4 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Profile updated");
                  }}
                >
                  <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input defaultValue={profile.name} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input defaultValue={profile.email} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>GitHub username</Label>
                    <Input defaultValue={profile.githubUsername} placeholder="octocat" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Input defaultValue={profile.location} placeholder="San Francisco, CA" />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit">Save changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}