import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getReviewHistory } from "@/services/reviewService";
import { ScoreBadge, StatusBadge } from "@/components/common/ScoreBadge";
import { Download, Search, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/history")({ component: History });

function History() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"date" | "score">("date");
  const [reviews, setReviews] = useState<any[]>([]);
  const items = useMemo(() => {
    let list = reviews.filter((r) =>
  (r.originalCode || "").toLowerCase().includes(q.toLowerCase())
);
    list = [...list].sort((a, b) => (sort === "date" ? b.createdAt.localeCompare(a.createdAt) : b.score - a.score));
    return list;
  }, [q, sort, reviews]);

  useEffect(() => {
    const fetchReviewHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await getReviewHistory(token);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error("Error fetching review history:", error);
      }
    };

    fetchReviewHistory();
  }, []);

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
            <li key={r._id} className="flex flex-wrap items-center gap-4 p-4 hover:bg-muted/30">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">
                    {r.language} Review
                  </span>

                  <StatusBadge status="completed" />
                </div>

                <p className="text-xs text-muted-foreground">
                  {r.language} · Score: {r.aiReview?.overallScore ?? "N/A"} ·{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>

              <ScoreBadge score={r.aiReview?.overallScore ?? 0} />

              <div className="flex gap-1">
                <Button asChild size="sm" variant="outline">
                  <Link to="/review/$id" params={{ id: r._id }}>
                    Open
                  </Link>
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  disabled
                  title="Export isn't available yet"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  disabled
                  title="Delete isn't available yet"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </AppShell>
  );
}