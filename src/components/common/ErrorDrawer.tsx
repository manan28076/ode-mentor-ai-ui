import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CodeBlock } from "./CodeBlock";
import { AlertTriangle } from "lucide-react";

interface Bug {
  name: string;
  meaning: string;
  why: string;
  fix: string;
  example: string;
  avoid: string;
  difficulty: string;
  related: string[];
}

export function ErrorDrawer({ bug, onOpenChange }: { bug: Bug | null; onOpenChange: (v: boolean) => void }) {
  return (
    <Sheet open={!!bug} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {bug && (
          <>
            <SheetHeader>
              <div className="mb-2 flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Error details</span>
              </div>
              <SheetTitle>{bug.name}</SheetTitle>
              <SheetDescription>{bug.meaning}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-5 text-sm">
              <Section title="Why it happens">{bug.why}</Section>
              <Section title="How to fix">{bug.fix}</Section>
              <div>
                <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Example</div>
                <CodeBlock code={bug.example} />
              </div>
              <Section title="How to avoid it">{bug.avoid}</Section>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs">Difficulty: {bug.difficulty}</span>
                {bug.related.map((r) => (
                  <span key={r} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">{r}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
      <p className="text-sm">{children}</p>
    </div>
  );
}