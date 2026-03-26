import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, Check, Zap, Tag, Lock, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Button, Badge, Card, CardContent } from "@/components/ui/shared";
import { cn } from "@/lib/utils";
import { getToken } from "@/lib/utils";

const VALID_CODES: Record<string, { discount: number; label: string; tier: string }> = {
  "FREE26":     { discount: 100, label: "100% off — Full access, completely free", tier: "premium" },
  "STANDOUT50": { discount: 50,  label: "50% off your first year",                 tier: "premium" },
};

const PRO_BULLETS = [
  "Unlimited Scenarios & Simulations",
  "Full Playbook library",
  "Unlimited AI Coach sessions",
  "All 4 Diagnostics",
  "Brand Lab",
  "Full 30-Day Journey",
];

interface UpgradeModalProps {
  onClose: () => void;
  featureName?: string;
  featureDescription?: string;
}

export function UpgradeModal({ onClose, featureName, featureDescription }: UpgradeModalProps) {
  const queryClient = useQueryClient();
  const [code, setCode] = React.useState("");
  const [applied, setApplied] = React.useState<string | null>(null);
  const [codeError, setCodeError] = React.useState("");
  const [upgrading, setUpgrading] = React.useState(false);
  const [upgraded, setUpgraded] = React.useState(false);
  const [upgradeError, setUpgradeError] = React.useState("");

  const applyCode = () => {
    const upper = code.trim().toUpperCase();
    if (VALID_CODES[upper]) {
      setApplied(upper);
      setCodeError("");
    } else {
      setCodeError("Invalid code. Try FREE26 for 100% off.");
      setApplied(null);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    setUpgradeError("");
    try {
      const res = await fetch("/api/auth/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ code: applied || "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upgrade failed");

      // Success — invalidate all data so pages re-fetch with new tier
      setUpgraded(true);
      await queryClient.invalidateQueries();

      // Close after a moment so the user sees the success message
      setTimeout(() => {
        onClose();
        // Reload to clear all cached premium locks in one go
        window.location.reload();
      }, 1800);
    } catch (err: any) {
      setUpgradeError(err.message || "Something went wrong. Try again.");
    } finally {
      setUpgrading(false);
    }
  };

  const discountInfo = applied ? VALID_CODES[applied] : null;
  const isFree = discountInfo?.discount === 100;

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && !upgrading && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, upgrading]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Upgrade to Pro"
      className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && !upgrading && onClose()}
    >
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-primary/30 shadow-2xl shadow-primary/10 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-amber-500 to-primary" />

          <CardContent className="p-6 md:p-8 relative">
            {/* Close */}
            {!upgrading && !upgraded && (
              <button
                aria-label="Close"
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* ── SUCCESS STATE ── */}
            {upgraded ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-2">You're now Pro! 🎉</h2>
                <p className="text-muted-foreground text-sm mb-1">Full access unlocked. Loading your content...</p>
                <div className="flex justify-center mt-4">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Badge variant="premium" className="mb-2 text-[10px] uppercase tracking-widest">Pro Feature</Badge>
                    <h2 className="text-xl font-display font-bold leading-tight">
                      {featureName ? `Unlock "${featureName}"` : "Unlock Full Access"}
                    </h2>
                    {featureDescription && (
                      <p className="text-sm text-muted-foreground mt-1">{featureDescription}</p>
                    )}
                  </div>
                </div>

                {/* Feature bullets */}
                <div className="mb-5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Pro includes:</p>
                  {PRO_BULLETS.map(b => (
                    <div key={b} className="flex items-center gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing pill */}
                <div className="flex items-center justify-between mb-5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    {isFree ? (
                      <span className="text-2xl font-display font-bold text-green-400">FREE</span>
                    ) : discountInfo ? (
                      <>
                        <span className="text-muted-foreground line-through text-sm mr-2">$19/mo</span>
                        <span className="text-2xl font-display font-bold text-primary">
                          ${Math.round(19 * (1 - discountInfo.discount / 100))}/mo
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl font-display font-bold">$19</span>
                        <span className="text-muted-foreground text-sm">/month</span>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    {!applied && <div className="text-xs text-muted-foreground">or $149/year</div>}
                    {applied && (
                      <div className={cn("text-xs font-bold", isFree ? "text-green-400" : "text-primary")}>
                        {discountInfo?.label}
                      </div>
                    )}
                  </div>
                </div>

                {/* Discount code input */}
                {!applied ? (
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          value={code}
                          onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError(""); }}
                          onKeyDown={e => e.key === "Enter" && applyCode()}
                          placeholder="Discount code"
                          className="w-full bg-background/50 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground uppercase"
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={applyCode} className="px-4 text-xs">
                        Apply
                      </Button>
                    </div>
                    {codeError && <p className="text-xs text-red-400 mt-1.5">{codeError}</p>}
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Have a code? Try{" "}
                      <button onClick={() => { setCode("FREE26"); }} className="text-primary hover:underline font-medium">
                        FREE26
                      </button>{" "}
                      for 100% off.
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/30">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-xs text-green-400 font-medium flex-1">
                      {applied} applied — {discountInfo?.label}
                    </span>
                    <button
                      onClick={() => { setApplied(null); setCode(""); }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {upgradeError && (
                  <p className="text-xs text-red-400 mb-3 text-center">{upgradeError}</p>
                )}

                {/* CTA */}
                {applied ? (
                  <Button
                    variant="premium"
                    className="w-full gap-2 h-11 text-sm"
                    onClick={handleUpgrade}
                    disabled={upgrading}
                  >
                    {upgrading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Activating your access...</>
                    ) : isFree ? (
                      <><Sparkles className="w-4 h-4" /> Activate Free Pro Access</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Activate Standout Pro <ArrowRight className="w-4 h-4" /></>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full gap-2 h-11 text-sm"
                    onClick={() => { setCode("FREE26"); }}
                  >
                    <Tag className="w-4 h-4" /> Enter code FREE26 to unlock for free
                  </Button>
                )}

                <p className="text-[10px] text-muted-foreground text-center mt-3">
                  Instant access · No credit card required with FREE26
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
