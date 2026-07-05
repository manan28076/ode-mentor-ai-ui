import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Github, Eye, EyeOff, Mail, Check, X } from "lucide-react";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState("");
  const nav = useNavigate();
  const rules = [
    { ok: pw.length >= 8, text: "At least 8 characters" },
    { ok: /[A-Z]/.test(pw), text: "One uppercase letter" },
    { ok: /\d/.test(pw), text: "One number" },
  ];
  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start reviewing code smarter today</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline"><Github className="mr-2 h-4 w-4" /> GitHub</Button>
        <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Google</Button>
      </div>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: wire to real signup service
          toast.success("Account created (mock)");
          nav({ to: "/dashboard" });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Alex Chen" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPw ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-xs">
            {rules.map((r) => (
              <li key={r.text} className={`flex items-center gap-1.5 ${r.ok ? "text-[oklch(0.65_0.17_155)]" : "text-muted-foreground"}`}>
                {r.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                {r.text}
              </li>
            ))}
          </ul>
        </div>
        <Button type="submit" className="w-full">Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}