import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockRepos } from "@/lib/mockData";
import { ChevronRight, File, Folder, GitBranch, GitPullRequest, Lock, Search, Star } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/github")({ component: GithubPage });

function GithubPage() {
  const [selected, setSelected] = useState(mockRepos[0]);
  const [q, setQ] = useState("");
  const repos = mockRepos.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  const tree = [
    { type: "folder", name: "src" },
    { type: "folder", name: "tests" },
    { type: "file", name: "package.json" },
    { type: "file", name: "README.md" },
    { type: "file", name: "tsconfig.json" },
  ];

  return (
    <AppShell>
      <PageHeader
        title="GitHub"
        description="Browse and import your repositories."
        actions={<Button variant="outline" onClick={() => toast.info("PRs coming soon")}><GitPullRequest className="mr-2 h-4 w-4" /> Pull Request</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardContent className="p-0">
            <div className="border-b p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search repositories…" className="pl-9" />
              </div>
            </div>
            <ul className="divide-y">
              {repos.map((r) => (
                <li key={r.id}>
                  <button onClick={() => setSelected(r)} className={`flex w-full items-center gap-2 px-4 py-3 text-left text-sm hover:bg-muted/50 ${selected.id === r.id ? "bg-muted/60" : ""}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 truncate font-medium">{r.name} {r.private && <Lock className="h-3 w-3 text-muted-foreground" />}</div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{r.language}</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {r.stars}</span>
                        <span>{r.updated}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">{selected.name}</h2>
                <p className="text-xs text-muted-foreground">{selected.language} · updated {selected.updated}</p>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue={selected.branch}>
                  <SelectTrigger className="w-36"><GitBranch className="mr-1 h-3.5 w-3.5" /><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">main</SelectItem>
                    <SelectItem value="develop">develop</SelectItem>
                    <SelectItem value="feature/x">feature/x</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => toast.success("Imported (mock)")}>Import</Button>
                <Button variant="outline" onClick={() => toast.info("Would open commit UI")}>Commit</Button>
              </div>
            </div>
            <ul className="divide-y rounded-lg border">
              {tree.map((n) => (
                <li key={n.name} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted/30">
                  {n.type === "folder" ? <Folder className="h-4 w-4 text-primary" /> : <File className="h-4 w-4 text-muted-foreground" />}
                  <span>{n.name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}