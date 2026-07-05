import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Bug, Code2, FileCode2, Gauge, Github, GraduationCap, Languages, Sparkles, TestTube2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { icon: Bot, title: "AI Code Review", desc: "Deep, context-aware review of your code — style, bugs, and structure." },
  { icon: Gauge, title: "Complexity Analysis", desc: "Time and space complexity with optimal alternatives." },
  { icon: Bug, title: "Error Explanation", desc: "Understand why an error happened and how to prevent it." },
  { icon: Sparkles, title: "Optimized Code", desc: "Get an improved version with a clear explanation of the changes." },
  { icon: TestTube2, title: "Unit Test Generation", desc: "Auto-generated tests covering edge cases you'd miss." },
  { icon: Languages, title: "Language Conversion", desc: "Translate code across TypeScript, Python, Go, Rust, and more." },
  { icon: Github, title: "GitHub Integration", desc: "Import repositories and review changes on any branch." },
  { icon: GraduationCap, title: "AI Coding Mentor", desc: "A senior engineer who never gets tired of your questions." },
];

const steps = [
  { n: "01", title: "Import or paste code", desc: "Bring code from GitHub, upload a file, or paste it into the editor." },
  { n: "02", title: "AI reviews your code", desc: "Get a detailed report with bugs, complexity, and improvements." },
  { n: "03", title: "Improve & learn", desc: "Apply fixes, generate tests, and understand the reasoning." },
];

const testimonials = [
  { name: "Sarah Kim", role: "Staff Engineer, Vercel-scale startup", text: "It caught a subtle race condition our team missed for weeks. Feels like a senior reviewer on standby." },
  { name: "Marcus Reed", role: "CTO, fintech", text: "The complexity analysis alone paid for itself. Our hot paths went from O(n²) to O(n)." },
  { name: "Priya Sharma", role: "Bootcamp graduate", text: "It's like pairing with a patient mentor. My code reviews at work are so much smoother now." },
];

function Landing() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold tracking-tight">CodeMentor AI</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#home" className="hover:text-foreground">Home</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
            <Button asChild size="sm"><Link to="/register">Get Started</Link></Button>
          </div>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Powered by frontier AI models
            </span>
            <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>AI Code Reviewer</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Review, optimize, understand, and improve your code using AI.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="shadow-[var(--shadow-elegant)]">
                <Link to="/register">Get Started <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/dashboard">View Demo</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border bg-card/60 p-1 shadow-[var(--shadow-elegant)] backdrop-blur">
              <div className="rounded-xl bg-[oklch(0.16_0.02_265)] p-6 text-left font-mono text-sm text-white/90">
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/70" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                  <span className="h-3 w-3 rounded-full bg-green-500/70" />
                  <span className="ml-3 text-xs text-white/50">review.ts · TypeScript</span>
                </div>
                <pre className="overflow-x-auto text-[13px] leading-relaxed"><code>{`// AI: Detected O(n²) nested loop in aggregate()
// AI: Suggestion — use Map for O(n)
function aggregate(items) {
  const map = new Map();
  for (const item of items) {
    map.set(item.key, (map.get(item.key) ?? 0) + item.value);
  }
  return map;
}`}</code></pre>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Everything you need to ship better code</h2>
          <p className="mt-3 text-muted-foreground">Built for engineers who want deeper feedback, not just linting.</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]">
              <div className="mb-4 inline-grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-3 text-muted-foreground">From code to insight in three steps.</p>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border bg-card p-6">
                <div className="text-sm font-semibold text-primary">{s.n}</div>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Loved by engineers</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-xl border bg-card p-6">
              <blockquote className="text-sm leading-relaxed">"{t.text}"</blockquote>
              <figcaption className="mt-4 text-sm">
                <div className="font-medium">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Ready to review smarter?</h2>
          <p className="mt-3 text-muted-foreground">Start free — no credit card required.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg"><Link to="/register">Get Started <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/dashboard">Explore the Demo</Link></Button>
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            <span>© {new Date().getFullYear()} CodeMentor AI</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// unused imports guard for tree-shaking
void FileCode2;
