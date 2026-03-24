import React from "react";
import { Card, Button, Badge } from "@/components/ui/shared";
import { MessageSquare, Send, Sparkles, AlertCircle, Plus, ChevronLeft, X, Clock } from "lucide-react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { cn, getToken, formatDate } from "@/lib/utils";

type ConversationType = { id: string; title: string; createdAt: string; updatedAt: string; messageCount: number };
type MessageType = { id: string; role: string; content: string; createdAt: string };

async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(path, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

const STARTER_PROMPTS = [
  "How do I handle an underperforming team member everyone likes?",
  "My boss challenged my judgment in front of senior stakeholders.",
  "I need a script to push back on scope creep diplomatically.",
  "How do I build influence without a title?",
  "I'm being excluded from key meetings — what's happening and what do I do?",
];

const TONE_OPTIONS = [
  { key: "diplomatic", label: "Diplomatic" },
  { key: "firm", label: "Direct & Firm" },
  { key: "executive_ready", label: "Executive-Ready" },
  { key: "empathetic", label: "Empathetic" },
  { key: "politically_careful", label: "Politically Careful" },
];

export default function Coach() {
  const [conversations, setConversations] = React.useState<ConversationType[]>([]);
  const [activeConvId, setActiveConvId] = React.useState<string | null>(null);
  const [historyMessages, setHistoryMessages] = React.useState<MessageType[]>([]);
  const [input, setInput] = React.useState("");
  const [toneMode, setToneMode] = React.useState<string | undefined>(undefined);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [loadingConvs, setLoadingConvs] = React.useState(true);
  const [loadingHistory, setLoadingHistory] = React.useState(false);
  const [creatingConv, setCreatingConv] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const { messages: streamMessages, setMessages: setStreamMessages, sendMessage, isStreaming, error } = useChatStream(activeConvId || "");

  const allMessages = activeConvId ? [
    ...historyMessages.map(m => ({ id: m.id, role: m.role, content: m.content })),
    ...streamMessages,
  ] : streamMessages;

  React.useEffect(() => {
    loadConversations();
  }, []);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, isStreaming]);

  async function loadConversations() {
    setLoadingConvs(true);
    try {
      const data = await apiFetch("/api/openai/conversations");
      setConversations(data);
      if (data.length > 0 && !activeConvId) {
        await loadConversation(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoadingConvs(false);
    }
  }

  async function loadConversation(id: string) {
    setLoadingHistory(true);
    setActiveConvId(id);
    setStreamMessages([]);
    try {
      const data = await apiFetch(`/api/openai/conversations/${id}`);
      setHistoryMessages(data.messages || []);
    } catch (err) {
      console.error("Failed to load conversation", err);
      setHistoryMessages([]);
    } finally {
      setLoadingHistory(false);
    }
  }

  async function createConversation(title?: string) {
    setCreatingConv(true);
    try {
      const conv = await apiFetch("/api/openai/conversations", {
        method: "POST",
        body: JSON.stringify({ title: title || "New Conversation" }),
      });
      setConversations(prev => [conv, ...prev]);
      setActiveConvId(conv.id);
      setHistoryMessages([]);
      setStreamMessages([]);
      return conv.id;
    } catch (err) {
      console.error("Failed to create conversation", err);
    } finally {
      setCreatingConv(false);
      setShowSidebar(false);
    }
  }

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault();
    const text = (overrideInput || input).trim();
    if (!text || isStreaming) return;

    let convId = activeConvId;
    if (!convId) {
      convId = await createConversation(text.slice(0, 60)) || null;
      if (!convId) return;
    }

    setInput("");
    sendMessage(text, toneMode);

    // Update conversation list
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, updatedAt: new Date().toISOString(), messageCount: c.messageCount + 2 } : c
    ));
  };

  const handleStarterPrompt = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const showEmptyState = allMessages.length === 0 && !loadingHistory;

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-primary" />
            Strategic Coach
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Your private operator for navigating complex workplace situations.</p>
        </div>
        <Button variant="outline" size="sm" className="hidden md:flex gap-2" onClick={() => setShowSidebar(!showSidebar)}>
          <Clock className="w-4 h-4" /> History
        </Button>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-72 flex-shrink-0 bg-card border border-white/10 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <span className="font-semibold text-sm">Conversations</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => createConversation()} isLoading={creatingConv} className="h-8 w-8 p-0">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)} className="h-8 w-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {loadingConvs ? (
                <div className="p-4 text-center text-muted-foreground text-sm">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">No conversations yet</div>
              ) : conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => { loadConversation(conv.id); setShowSidebar(false); }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl transition-colors text-sm",
                    activeConvId === conv.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5"
                  )}
                >
                  <p className="font-medium truncate">{conv.title}</p>
                  <p className="text-xs opacity-60 mt-0.5">{conv.messageCount} messages · {formatDate(conv.updatedAt)}</p>
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-white/5">
              <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => createConversation()} isLoading={creatingConv}>
                <Plus className="w-4 h-4" /> New Conversation
              </Button>
            </div>
          </div>
        )}

        {/* Main Chat */}
        <Card className="flex-1 flex flex-col border-white/10 overflow-hidden shadow-2xl min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-card/50">
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSidebar(!showSidebar)} className="md:hidden p-1 text-muted-foreground hover:text-foreground">
                {showSidebar ? <X className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                {activeConvId ? conversations.find(c => c.id === activeConvId)?.title || "Active Session" : "New Session"}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="gap-2 text-xs" onClick={() => createConversation()} isLoading={creatingConv}>
              <Plus className="w-3 h-3" /> New
            </Button>
          </div>

          {/* Tone selector */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 overflow-x-auto scrollbar-hide">
            <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">Response tone:</span>
            <button
              onClick={() => setToneMode(undefined)}
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border flex-shrink-0",
                !toneMode ? "bg-primary/20 border-primary text-primary" : "border-white/5 text-muted-foreground hover:bg-white/5"
              )}
            >
              Default
            </button>
            {TONE_OPTIONS.map(t => (
              <button
                key={t.key}
                onClick={() => setToneMode(toneMode === t.key ? undefined : t.key)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border flex-shrink-0",
                  toneMode === t.key ? "bg-primary/20 border-primary text-primary" : "border-white/5 text-muted-foreground hover:bg-white/5"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
            {loadingHistory ? (
              <div className="h-full flex items-center justify-center text-muted-foreground animate-pulse text-sm">Loading conversation...</div>
            ) : showEmptyState ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-amber-600/20 border border-primary/30 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Where should we start?</h3>
                <p className="text-sm text-muted-foreground mb-8">
                  Describe a situation, a difficult conversation you need to have, or a political dynamic you're trying to navigate.
                </p>
                <div className="space-y-2 w-full">
                  {STARTER_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleStarterPrompt(prompt)}
                      className="block w-full text-left p-3 rounded-xl border border-white/5 bg-background/50 hover:bg-white/5 hover:border-white/10 text-sm transition-colors text-muted-foreground hover:text-foreground"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {allMessages.map((msg, i) => (
                  <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-amber-600/20 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[85%] rounded-2xl p-5",
                      msg.role === "user"
                        ? "bg-primary/10 border border-primary/20 text-foreground ml-12 rounded-tr-sm"
                        : "bg-secondary border border-white/5 text-foreground mr-4 rounded-tl-sm"
                    )}>
                      {msg.role === "assistant" && (
                        <Badge variant="outline" className="mb-3 text-[10px] uppercase border-primary/30 text-primary">
                          Strategic Analysis
                        </Badge>
                      )}
                      <div className={cn(
                        "whitespace-pre-wrap leading-relaxed text-[15px]",
                        msg.role === "assistant" && "prose-sm"
                      )}>
                        {msg.content || (isStreaming && i === allMessages.length - 1 ? (
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <span className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                            </span>
                            Analyzing your situation...
                          </span>
                        ) : "")}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {error && (
              <div className="flex justify-center">
                <div className="bg-destructive/20 border border-destructive/50 text-red-300 px-4 py-2 rounded-lg text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" /> {error}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-background/50 border-t border-white/5 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  placeholder="Describe the situation you're navigating..."
                  className="w-full bg-card border border-white/10 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground resize-none min-h-[56px] max-h-32 transition-all"
                  rows={1}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                variant="premium"
                disabled={!input.trim() || isStreaming}
                className="h-14 w-14 rounded-xl flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
            <div className="text-center mt-3">
              <span className="text-[11px] text-muted-foreground/50 uppercase tracking-widest font-medium">
                Confidential Workspace · AI-Powered Strategic Analysis
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
