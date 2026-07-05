import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockProjects } from "@/lib/mockData";
import { StatusBadge } from "@/components/common/ScoreBadge";
import { Copy, FolderOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/projects")({ component: Projects });

function Projects() {
  return (
    <AppShell>
      <PageHeader
        title="Projects"
        description="All code repositories you've reviewed."
        actions={<Button asChild><Link to="/new-review"><Plus className="mr-2 h-4 w-4" /> New Project</Link></Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((p) => (
          <Card key={p.id} className="group transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold">{p.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div><div className="text-foreground font-medium">{p.language}</div>Language</div>
                <div><div className="text-foreground font-medium">{p.lastReviewed}</div>Last reviewed</div>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1"><Link to="/review/$id" params={{ id: p.id }}><FolderOpen className="mr-1.5 h-3.5 w-3.5" /> Open</Link></Button>
                <Button size="sm" variant="ghost" onClick={() => toast.success("Duplicated (mock)")}><Copy className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => toast.success("Deleted (mock)")}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}