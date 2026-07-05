import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStats, mockReviews, mockActivity } from "@/lib/mockData";
import { ScoreBadge, StatusBadge } from "@/components/common/ScoreBadge";
import { FilePlus, Github, FolderOpen, FileCheck2, FolderKanban, Gauge, Code2, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

const cards = [
  { label: "Reviews", value: mockStats.reviews, icon: FileCheck2, trend: "+12%" },
  { label: "Projects", value: mockStats.projects, icon: FolderKanban, trend: "+3" },
  { label: "Average Score", value: mockStats.averageScore, icon: Gauge, trend: "+4pt" },
  { label: "Lines Reviewed", value: mockStats.linesReviewed.toLocaleString(), icon: Code2, trend: "+8.2k" },
];

function Dashboard() {
  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Your recent reviews, projects, and activity at a glance."
        actions={
          <>
            <Button asChild variant="outline"><Link to="/github"><Github className="mr-2 h-4 w-4" /> Import from GitHub</Link></Button>
            <Button asChild><Link to="/new-review"><FilePlus className="mr-2 h-4 w-4" /> New Review</Link></Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">{c.label}</div>
                  <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                    <c.icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 text-2xl font-semibold">{c.value}</div>
                <div className="mt-1 text-xs text-[oklch(0.65_0.17_155)]">{c.trend} vs last month</div>
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
                  {mockReviews.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium">
                        <Link to="/review/$id" params={{ id: r.id }} className="hover:text-primary">{r.project}</Link>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{r.language}</td>
                      <td className="px-5 py-3"><ScoreBadge score={r.score} /></td>
                      <td className="px-5 py-3 text-muted-foreground">{r.bugs}</td>
                      <td className="px-5 py-3 text-muted-foreground">{r.createdAt}</td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l pl-5">
              {mockActivity.map((a) => (
                <li key={a.id} className="relative">
                  <span className="absolute -left-[26px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </li>
              ))}
            </ol>
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
    <Link to={to} className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform"><Icon className="h-5 w-5" /></div>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
      </div>
    </Link>
  );
}