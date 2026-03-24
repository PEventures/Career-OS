import React from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Target, 
  MessageSquare, 
  BookOpen, 
  Compass, 
  Sparkles, 
  LogOut, 
  Menu,
  X,
  ShieldAlert,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/shared";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Journey", href: "/journey", icon: Sparkles },
  { name: "Assess", href: "/assess", icon: Target },
  { name: "Scenarios", href: "/scenarios", icon: Compass },
  { name: "Systems", href: "/systems", icon: BookOpen },
  { name: "Coach", href: "/coach", icon: MessageSquare },
  { name: "Brand Lab", href: "/brand-lab", icon: ShieldAlert },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col border-r border-white/5 bg-card/30 backdrop-blur-2xl fixed h-full z-20">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-display font-bold text-foreground">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center text-background">
              S
            </div>
            Standout
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        {/* Upgrade CTA */}
        <div className="px-4 pb-2">
          <Link href="/pricing">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary/10 to-amber-600/10 border border-primary/20 hover:border-primary/40 transition-all cursor-pointer group">
              <Zap className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-primary">Upgrade to Pro</p>
                <p className="text-[10px] text-muted-foreground truncate">Use code FREE26 for full access</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold border border-white/10">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name || 'Manager'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.tier} plan</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-red-400" onClick={() => logout()}>
            <LogOut className="w-5 h-5 mr-3" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-30 bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-display font-bold text-foreground">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-background text-xs">S</div>
          Standout
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-foreground">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-background pt-16 flex flex-col animate-in fade-in slide-in-from-top-4">
          <nav className="flex-1 p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-4 rounded-xl text-lg",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-6 h-6" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:pl-72 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
