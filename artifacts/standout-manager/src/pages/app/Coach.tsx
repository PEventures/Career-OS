import React from "react";
import { Card, Button, Input, Badge } from "@/components/ui/shared";
import { MessageSquare, Send, Sparkles, AlertCircle } from "lucide-react";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useGetMe } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

// Dummy ID for MVP if not storing multiple conversations yet, or assume a fixed one
const CONV_ID = "main_coach_thread"; 

export default function Coach() {
  const { user } = useGetMe();
  const [input, setInput] = React.useState("");
  const { messages, sendMessage, isStreaming, error } = useChatStream(CONV_ID);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          Strategic Coach
        </h1>
        <p className="text-muted-foreground mt-2">Your private operator for navigating complex workplace situations.</p>
      </div>

      <Card className="flex-1 flex flex-col border-white/10 overflow-hidden shadow-2xl">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-70">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-amber-600/20 border border-primary/30 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">How can I help?</h3>
              <p className="text-sm text-muted-foreground mb-8">
                Describe a situation, a difficult conversation you need to have, or a political dynamic you're trying to navigate.
              </p>
              <div className="space-y-2 w-full">
                {["How do I handle an underperforming peer?", "My boss threw me under the bus in a meeting.", "I need a script to push back on scope creep."].map((prompt, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(prompt)}
                    className="block w-full text-left p-3 rounded-lg border border-white/5 bg-background/50 hover:bg-white/5 text-sm transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-2xl p-5",
                msg.role === "user" 
                  ? "bg-primary/10 border border-primary/20 text-foreground ml-12 rounded-tr-sm" 
                  : "bg-secondary border border-white/5 text-foreground mr-12 rounded-tl-sm prose prose-invert max-w-none"
              )}>
                {msg.role === "assistant" && <Badge variant="outline" className="mb-3 text-[10px] uppercase border-primary/30 text-primary">Strategic Analysis</Badge>}
                <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content || <span className="animate-pulse">Analyzing...</span>}</div>
              </div>
            </div>
          ))}
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
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Describe the situation..."
                className="w-full bg-card border border-white/10 rounded-xl px-4 py-4 pr-12 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground resize-none min-h-[56px] max-h-32 custom-scrollbar transition-all"
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
            <span className="text-[11px] text-muted-foreground/60 uppercase tracking-widest font-medium">Confidential Workspace</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
