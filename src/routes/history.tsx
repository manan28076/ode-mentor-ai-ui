import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { mockReviews } from "@/lib/mockData";
import { ScoreBadge, StatusBadge } from "@/components/common/ScoreBadge";
import { Download, Search, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({ component: History });

function History() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"date" | "score">("date");
  const items = useMemo(() => {
    let list = mockReviews.filter((r) => r.project.toLowerCase().includes(q.toLowerCase()));
    list = [...list].sort((a, b) => (sort === "date" ? b.createdAt.localeCompare(a.createdAt) : b.score - a.score));
    return list;
  }, [q, sort]);

  return (
    <AppShell>
      <PageHeader title="Review History" description="A timeline of every review you've run." />
      <div className="mb-4 grid gap-2 sm:flex sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reviews…" className="pl-9" />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as "date" | "score")}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort: Newest</SelectItem>
            <SelectItem value="score">Sort: Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <ol className="divide-y">
          {items.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-4 p-4 hover:bg-muted/30">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link to="/review/$id" params={{ id: r.id }} className="truncate font-medium hover:text-primary">{r.project}</Link>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-xs text-muted-foreground">{r.language} · {r.bugs} bugs · {r.createdAt}</p>
              </div>
              <ScoreBadge score={r.score} />
              <div className="flex gap-1">
                <Button asChild size="sm" variant="outline"><Link to="/review/$id" params={{ id: r.id }}>Open</Link></Button>
                <Button size="sm" variant="ghost" onClick={() => toast.success("Exported (mock)")}><Download className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => toast.success("Deleted (mock)")}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </AppShell>
  );
}