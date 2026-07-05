import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockChats, mockMessages, suggestedPrompts } from "@/lib/mockData";
import { Bot, Plus, Send, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/chat")({ component: ChatPage });

function ChatPage() {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: `u${m.length}`, role: "user", content: text }]);
    setInput("");
    setTyping(true);
    // TODO: replace with real AI streaming API
    setTimeout(() => {
      setMessages((m) => [...m, { id: `a${m.length}`, role: "assistant", content: "Great question — here's what I'd consider… (mock response). This flow will call the AI backend later." }]);
      setTyping(false);
    }, 900);
  };

  return (
    <AppShell>
      <PageHeader title="AI Chat" description="Ask your AI coding mentor anything." />
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-xl border bg-card">
          <div className="border-b p-3">
            <Button className="w-full justify-start" variant="outline"><Plus className="mr-2 h-4 w-4" /> New chat</Button>
          </div>
          <ul className="p-2">
            {mockChats.map((c) => (
              <li key={c.id}>
                <button className="flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted/50">
                  <Bot className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground">{c.updated}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex h-[70vh] flex-col rounded-xl border bg-card">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <Avatar className="h-8 w-8 shrink-0"><AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback></Avatar>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                </div>
                {m.role === "user" && (
                  <Avatar className="h-8 w-8 shrink-0"><AvatarFallback><User className="h-4 w-4" /></AvatarFallback></Avatar>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary"><Bot className="h-4 w-4" /></AvatarFallback></Avatar>
                <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>
          <div className="border-t p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {suggestedPrompts.map((p) => (
                <button key={p} onClick={() => send(p)} className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary">{p}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your code…" />
              <Button type="submit" size="icon"><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </section>
      </div>
    </AppShell>
  );
}