import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { sendChatMessage, listConversations, getConversation } from "@/services/chatService";
import { Bot, Plus, Send, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/chat")({ component: ChatPage });

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ConversationSummary {
  _id: string;
  title: string;
  updatedAt: string;
}

const suggestedPrompts = [
  "Explain this concept",
  "Can this be optimized?",
  "Why is this O(n²)?",
  "How do I fix this bug?",
];

function formatRelativeTime(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ChatPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("token");

  const loadConversations = async () => {
    if (!token) {
      setConversationsLoading(false);
      return;
    }
    try {
      const res = await listConversations(token);
      setConversations(res.data.conversations);
    } catch (err) {
      console.error(err);
    } finally {
      setConversationsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const openConversation = async (id: string) => {
    if (!token) return;
    setError(null);
    setActiveConversationId(id);
    setMessagesLoading(true);
    try {
      const res = await getConversation(id, token);
      setMessages(res.data.conversation.messages);
    } catch (err) {
      console.error(err);
      setError("Failed to load this conversation. Please try again.");
    } finally {
      setMessagesLoading(false);
    }
  };

  const startNewChat = () => {
    setActiveConversationId(null);
    setMessages([]);
    setError(null);
    setInput("");
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    if (!token) {
      setError("You need to be logged in to chat with your AI mentor.");
      return;
    }

    setError(null);
    setMessages((m) => [...m, { role: "user", content: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const res = await sendChatMessage(trimmed, activeConversationId ?? undefined, token);
      setMessages((m) => [...m, { role: "assistant", content: res.data.reply }]);

      if (!activeConversationId) {
        setActiveConversationId(res.data.conversationId);
      }

      await loadConversations();
    } catch (err) {
      console.error(err);
      setError("The AI mentor couldn't respond right now. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <AppShell>
      <PageHeader title="AI Chat" description="Ask your AI coding mentor anything." />
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-xl border bg-card">
          <div className="border-b p-3">
            <Button className="w-full justify-start" variant="outline" onClick={startNewChat}>
              <Plus className="mr-2 h-4 w-4" /> New chat
            </Button>
          </div>
          <ul className="p-2">
            {conversationsLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="px-3 py-2">
                  <Skeleton className="h-8 w-full" />
                </li>
              ))}

            {!conversationsLoading && conversations.length === 0 && (
              <li className="px-3 py-4 text-center text-xs text-muted-foreground">
                No conversations yet. Start chatting below.
              </li>
            )}

            {!conversationsLoading &&
              conversations.map((c) => (
                <li key={c._id}>
                  <button
                    onClick={() => openConversation(c._id)}
                    className={`flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted/50 ${
                      activeConversationId === c._id ? "bg-muted/60" : ""
                    }`}
                  >
                    <Bot className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="truncate">{c.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatRelativeTime(c.updatedAt)}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
          </ul>
        </aside>

        <section className="flex h-[70vh] flex-col rounded-xl border bg-card">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
            {messagesLoading && (
              <div className="space-y-4">
                <Skeleton className="h-12 w-2/3" />
                <Skeleton className="ml-auto h-12 w-1/2" />
                <Skeleton className="h-12 w-3/5" />
              </div>
            )}

            {!messagesLoading && messages.length === 0 && (
              <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
                Ask a question to start the conversation.
              </div>
            )}

            {!messagesLoading &&
              messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans">{m.content}</pre>
                  </div>
                  {m.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

            {sending && (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:240ms]" />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="border-t bg-destructive/10 px-4 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="border-t p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                >
                  {p}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your code…"
                disabled={sending}
              />
              <Button type="submit" size="icon" disabled={sending || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      </div>
    </AppShell>
  );
}