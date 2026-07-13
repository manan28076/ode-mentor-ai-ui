import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AuthScene } from "@/components/common/AuthScene";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Form column */}
      <div className="relative flex w-full items-center justify-center px-4 py-10 lg:w-[480px] lg:shrink-0 lg:border-r lg:border-border/60">
        <div className="pointer-events-none absolute inset-0 lg:hidden" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center justify-center gap-2 lg:justify-start">
            <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">CodeMentor AI</span>
          </Link>
          <div className="rounded-2xl border bg-card p-8 shadow-[var(--shadow-elegant)] lg:rounded-lg lg:border-border/60 lg:p-6 lg:shadow-none">
            {children}
          </div>
        </div>
      </div>

      {/* 3D scene column — desktop only */}
      <div className="relative hidden flex-1 overflow-hidden bg-[#0e1013] lg:block">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <AuthScene />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-10">
          <p className="max-w-sm font-mono text-sm text-muted-foreground">
            <span className="text-primary">$</span> every review, tracked as a diff —
            bugs caught before they ship.
          </p>
        </div>
      </div>
    </div>
  );
}