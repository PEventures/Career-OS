import React from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@/components/ui/shared";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const { login, isLoginPending } = useAuth();
  const [error, setError] = React.useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setError("");
      await login({ data });
    } catch (err: any) {
      setError(err.message || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src={`${import.meta.env.BASE_URL}images/auth-bg.png`} 
          alt="Premium background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/0 to-background" />
        <div className="absolute bottom-12 left-12 max-w-md">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Master the unwritten rules of leadership.</h2>
          <p className="text-white/70">Sign in to your private strategic workspace.</p>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10 relative">
        <div className="w-full max-w-md animate-slide-up">
          <Link href="/" className="inline-block mb-8 text-2xl font-display font-bold">
            <span className="text-primary">S</span>tandout
          </Link>
          
          <Card className="border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Enter your credentials to access your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" {...form.register("email")} />
                  {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                  </div>
                  <Input id="password" type="password" {...form.register("password")} />
                  {form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
                </div>
                
                {error && <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>}
                
                <Button type="submit" className="w-full" variant="premium" isLoading={isLoginPending}>
                  Sign In
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account? <Link href="/auth/register" className="text-primary hover:underline font-medium">Create one</Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
