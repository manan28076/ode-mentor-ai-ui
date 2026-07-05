import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FilePlus, FolderKanban, History, Github, MessageSquare, User, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "New Review", url: "/new-review", icon: FilePlus },
  { title: "Projects", url: "/projects", icon: FolderKanban },
  { title: "History", url: "/history", icon: History },
  { title: "GitHub", url: "/github", icon: Github },
  { title: "AI Chat", url: "/chat", icon: MessageSquare },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-sidebar md:flex md:flex-col">
      <Link to="/" className="flex items-center gap-2 border-b px-5 py-4">
        <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold tracking-tight">CodeMentor AI</span>
      </Link>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link key={item.url} to={item.url} className="relative block">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <div className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <div className="rounded-lg border bg-card p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Free tier · 12/50 reviews</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/4 rounded-full" style={{ background: "var(--gradient-primary)" }} />
          </div>
        </div>
      </div>
    </aside>
  );
}