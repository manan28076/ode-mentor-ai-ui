import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Gauge, GraduationCap, Sparkles, TestTube2 } from "lucide-react";
import { CodeBlock } from "./CodeBlock";
import { ErrorDrawer } from "./ErrorDrawer";
import { DiffFix } from "./DiffFix";
const sevClass: Record<string, string> = {
  high: "bg-destructive/14 text-destructive",
  medium: "bg-[oklch(0.75_0.16_65/0.14)] text-[oklch(0.75_0.16_65)]",
  low: "bg-primary/10 text-primary",
};
interface ReviewResultProps {
  review: any;
  originalCode?: string;
}

export function ReviewResult({ review, originalCode }: ReviewResultProps) {
  const r: any  = review;
  const [drawer, setDrawer] = useState<any>(null);
  return (
    <div>
      <Card className="mb-4">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Overall score</div>
            <div className="text-4xl font-semibold">{r.overallScore}<span className="text-lg text-muted-foreground">/100</span></div>
          </div>
          <div className="hidden gap-4 sm:flex">
            <Metric label="Bugs" value={r.bugs.length} />
            <Metric label="Complexity" value={r.complexity.time} />
            <Metric label="Optimal" value={r.complexity.optimal} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bugs">Bugs</TabsTrigger>
          <TabsTrigger value="optim">Optimization</TabsTrigger>
          <TabsTrigger value="complex">Complexity</TabsTrigger>
          <TabsTrigger value="learn">Learning</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Panel title="Logic Review" icon={GraduationCap}>{r.logic}</Panel>
          <Panel title="Performance Issues" icon={Gauge}>{r.performance}</Panel>
          <Panel title="Best Practices" icon={Sparkles}>
            <ul className="list-disc space-y-1 pl-5">{r.bestPractices.map((b:string) => <li key={b}>{b}</li>)}</ul>
          </Panel>
          <Panel title="Code Explanation" icon={GraduationCap}>{r.codeExplanation}</Panel>
        </TabsContent>

        <TabsContent value="bugs" className="space-y-3">
          {r.bugs.map((b:any) => (
            <button key={b.id} onClick={() => setDrawer(b)} className="block w-full rounded-xl border bg-card p-4 text-left transition-all hover:border-primary/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                  <div>
                    <div className="font-medium">{b.name} <span className="text-xs text-muted-foreground">· line {b.line}</span></div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{b.message}</p>
                  </div>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize ${sevClass[b.severity]}`}>{b.severity}</span>
              </div>
            </button>
          ))}
          <ErrorDrawer bug={drawer} onOpenChange={(v) => !v && setDrawer(null)} />
        </TabsContent>

        <TabsContent value="optim" className="space-y-4">
          <Panel title="Optimization Explanation" icon={Sparkles}>{r.optimizationExplanation}</Panel>
          {originalCode ? (
            <DiffFix oldCode={originalCode} newCode={r.optimizedCode} />
          ) : (
            <div><div className="mb-2 text-sm font-medium">Optimized code</div><CodeBlock code={r.optimizedCode} language="ts" /></div>
          )}
        </TabsContent>

        <TabsContent value="complex" className="grid gap-4 sm:grid-cols-3">
          <Metric big label="Time" value={r.complexity.time} />
          <Metric big label="Space" value={r.complexity.space} />
          <Metric big label="Optimal" value={r.complexity.optimal} />
        </TabsContent>

        <TabsContent value="learn" className="space-y-4">
          <Panel title="Error Explanation" icon={AlertTriangle}>{r.errorExplanation}</Panel>
          <Panel title="How to Avoid" icon={GraduationCap}>{r.howToAvoid}</Panel>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Panel title="Edge Cases" icon={TestTube2}>
            <ul className="list-disc space-y-1 pl-5">{r.edgeCases.map((e:string) => <li key={e}>{e}</li>)}</ul>
          </Panel>
          <div><div className="mb-2 text-sm font-medium">Generated unit tests</div><CodeBlock code={r.unitTests} language="ts" /></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({ label, value, big }: { label: string; value: React.ReactNode; big?: boolean }) {
  return (
    <div className={`rounded-lg border bg-card p-4 ${big ? "" : ""}`}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-semibold ${big ? "text-2xl" : "text-lg"}`}>{value}</div>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </div>
      <div className="text-sm text-muted-foreground">{children}</div>
    </div>
  );
}