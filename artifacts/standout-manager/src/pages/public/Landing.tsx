import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/shared";
import { Shield, Target, TrendingUp, Zap, ChevronRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-display font-bold">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-background">S</div>
            Standout Manager
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">Sign in</Link>
            <Link href="/auth/register">
              <Button variant="premium" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={`${import.meta.env.BASE_URL}images/hero-abstract.png`} 
              alt="Premium abstract background" 
              className="w-full h-full object-cover opacity-40 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </div>
          
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              For first-time managers & ambitious ICs
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 leading-[1.1]">
              Become the manager people <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">trust and respect.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              A private, psychologically intelligent career operating system to build your workplace brand equity, navigate politics, and handle high-pressure situations with calm confidence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button variant="premium" size="lg" className="w-full sm:w-auto group">
                  Start Your Private Journey
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features" className="text-muted-foreground hover:text-foreground font-medium px-6 py-4">
                Explore features
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-card/30 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Not another fluffy leadership course.</h2>
              <p className="text-lg text-muted-foreground">Practical systems, real-world scenarios, and private strategic coaching.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: "Real-World Scenarios",
                  desc: "Navigate difficult conversations, executive pressure, and team tension in safe, decision-tree simulations."
                },
                {
                  icon: Shield,
                  title: "Brand Equity Lab",
                  desc: "Intentionally shape how you're perceived when you're not in the room. Audit behaviors and close perception gaps."
                },
                {
                  icon: TrendingUp,
                  title: "AI Strategic Coach",
                  desc: "A private operator in your pocket. Get sharp, unvarnished advice on workplace politics and exact scripts to use."
                }
              ].map((f, i) => (
                <div key={i} className="bg-background/50 border border-white/5 p-8 rounded-2xl hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
