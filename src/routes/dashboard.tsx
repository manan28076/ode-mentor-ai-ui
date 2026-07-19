import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/services/reviewService";
import { ScoreBadge, StatusBadge } from "@/components/common/ScoreBadge";
import { FilePlus, Github, FolderOpen, FileCheck2, FolderKanban, Gauge, Code2, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });



function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const res = await getDashboardStats(token);

        setStats(res.data);
        setRecentReviews(res.data.recentReviews);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);
  const cards = [
  {
    label: "Reviews",
    value: stats?.totalReviews ?? 0,
    icon: FileCheck2,
    trend: "Live",
  },
  {
    label: "Languages",
    value: stats?.languagesReviewed ?? 0,
    icon: FolderKanban,
    trend: "Live",
  },
  {
    label: "Average Score",
    value: stats?.averageScore ?? 0,
    icon: Gauge,
    trend: "Live",
  },
  {
    label: "Lines Reviewed",
    value: stats?.linesReviewed ?? 0,
    icon: Code2,
    trend: "Live",
  },
];
  return (
    <AppShell>
      <div className="relative -mx-4 -mt-4 mb-8 overflow-hidden border-b px-4 pb-8 pt-6 sm:-mx-6 sm:-mt-6 sm:px-6 lg:-mx-8 lg:-mt-8 lg:px-8">
        <div className="bg-blueprint pointer-events-none absolute inset-0" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              System status: live
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {stats?.totalReviews ? (
                <>
                  <span className="text-primary">{stats.totalReviews}</span> reviews run.
                  <br className="hidden sm:block" /> <span className="text-primary">{stats?.averageScore ?? 0}</span> avg score.
                </>
              ) : (
                "Nothing reviewed yet."
              )}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              {stats?.totalReviews
                ? `${stats.linesReviewed ?? 0} lines analyzed across ${stats.languagesReviewed ?? 0} languages so far.`
                : "Paste your first snippet or import a repo to see it here."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button asChild variant="outline"><Link to="/github"><Github className="mr-2 h-4 w-4" /> Import from GitHub</Link></Button>
            <Button asChild><Link to="/new-review"><FilePlus className="mr-2 h-4 w-4" /> New Review</Link></Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="group relative overflow-hidden border-border/60 transition-all hover:border-primary/40">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
                    <c.icon className="h-3.5 w-3.5 text-primary" />
                    {c.label}
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground/60">#{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="mt-3 font-mono text-3xl font-semibold tabular-nums">{c.value}</div>
                <div className="mt-1.5 flex items-center gap-1 font-mono text-xs text-primary">
                  <span>+</span>{c.trend.toLowerCase()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Reviews</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/history">View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-2 text-left font-medium">Project</th>
                    <th className="px-5 py-2 text-left font-medium">Language</th>
                    <th className="px-5 py-2 text-left font-medium">Score</th>
                    <th className="px-5 py-2 text-left font-medium">Bugs</th>
                    <th className="px-5 py-2 text-left font-medium">Date</th>
                    <th className="px-5 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
  {recentReviews.map((r: any) => (
    <tr key={r._id} className="border-b last:border-0 hover:bg-muted/30">

      <td className="px-5 py-3 font-medium">
        <Link
          to="/review/$id"
          params={{ id: r._id }}
          className="hover:text-primary"
        >
          Review
        </Link>
      </td>

      <td className="px-5 py-3 text-muted-foreground">
        {r.language}
      </td>

      <td className="px-5 py-3">
        <ScoreBadge score={r.aiReview?.overallScore || 0} />
      </td>

      <td className="px-5 py-3 text-muted-foreground">
        {r.aiReview?.bugs?.length || 0}
      </td>

      <td className="px-5 py-3 text-muted-foreground">
        {new Date(r.createdAt).toLocaleDateString()}
      </td>

      <td className="px-5 py-3">
        <StatusBadge status="completed" />
      </td>

    </tr>
  ))}
</tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <QuickAction to="/new-review" icon={FilePlus} title="Create Review" desc="Paste, upload, or import code." />
        <QuickAction to="/github" icon={Github} title="Import GitHub" desc="Bring a repo in one click." />
        <QuickAction to="/history" icon={FolderOpen} title="Open Previous" desc="Continue where you left off." />
      </div>
    </AppShell>
  );
}

function QuickAction({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) {
  return (
    <Link to={to} className="group flex items-start gap-3 rounded-md border border-border/60 bg-card p-5 transition-all hover:border-primary/40">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
      <div>
        <div className="font-medium">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
    </Link>
  );
}