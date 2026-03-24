import React from "react";
import { useParams, Link } from "wouter";
import { useGetSystem } from "@workspace/api-client-react";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import { ArrowLeft, Lock, Copy, Check, BookOpen, Lightbulb, MessageSquare, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-primary/10"
    >
      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function SystemDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: system, isLoading } = useGetSystem(id!);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
        <div className="p-8 text-center text-muted-foreground">Loading playbook...</div>
      </div>
    );
  }

  if (!system) {
    return (
      <div className="max-w-4xl mx-auto pb-12">
        <Link href="/systems" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Systems
        </Link>
        <div className="text-center py-12 text-muted-foreground">Playbook not found.</div>
      </div>
    );
  }

  const s = system as any;
  const steps: Array<{ order: number; title: string; description: string }> = s.steps || [];
  const principles: string[] = s.keyPrinciples || [];
  const scripts: Array<{ tone: string; text: string }> = s.scripts || [];

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <Link href="/systems" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Playbooks
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline" className="uppercase text-[10px] tracking-widest">{s.category}</Badge>
          {s.isPremium && (
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
              <Lock className="w-3 h-3 mr-1" /> Premium Playbook
            </Badge>
          )}
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">{s.title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">{s.description}</p>
        <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> {s.estimatedMinutes} min read
          </span>
          <span>{steps.length} steps</span>
          {scripts.length > 0 && <span>{scripts.length} scripts included</span>}
        </div>
      </div>

      {/* Key Principles */}
      {principles.length > 0 && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Core Principles
            </h2>
            <ul className="space-y-3">
              {principles.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Steps */}
      {steps.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
            <ChevronRight className="w-6 h-6 text-primary" />
            The System
          </h2>
          <div className="space-y-4">
            {steps.sort((a, b) => a.order - b.order).map((step, i) => (
              <div key={i} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-5 top-14 bottom-0 w-px bg-white/5" />
                )}
                <Card className="border-white/10 hover:border-white/20 transition-colors">
                  <CardContent className="p-6 flex gap-5">
                    <div className="w-10 h-10 rounded-xl bg-secondary border border-white/5 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                      {step.order}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scripts */}
      {scripts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Ready-Made Scripts
          </h2>
          <p className="text-muted-foreground mb-6">
            Exact language you can use. Adapt the tone to your situation — the substance stays the same.
          </p>
          <div className="space-y-4">
            {scripts.map((script, i) => (
              <Card key={i} className="border-white/10">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-secondary/30 rounded-t-xl">
                    <Badge variant="outline" className="capitalize text-[10px] tracking-wide">
                      {script.tone} tone
                    </Badge>
                    <CopyButton text={script.text} />
                  </div>
                  <div className="p-5">
                    <p className="text-foreground/90 leading-relaxed italic text-sm font-light whitespace-pre-wrap">
                      "{script.text}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked premium content */}
      {s.isPremium && scripts.length === 0 && (
        <Card className="border-amber-500/20 bg-amber-500/5 mb-8">
          <CardContent className="p-8 text-center">
            <Lock className="w-8 h-8 text-amber-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Full Scripts Locked</h3>
            <p className="text-muted-foreground text-sm mb-4">Upgrade to Core or Premium to access the complete script library for this playbook.</p>
            <Button variant="premium">Upgrade to Unlock</Button>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between pt-8 border-t border-white/5">
        <Link href="/systems">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Playbooks
          </Button>
        </Link>
        <Link href="/coach">
          <Button variant="premium">
            Apply with AI Coach →
          </Button>
        </Link>
      </div>
    </div>
  );
}
