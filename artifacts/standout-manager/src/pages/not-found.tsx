import { Link } from "wouter";
import { Button } from "@/components/ui/shared";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-display font-bold text-primary mb-6">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-4">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          The strategic resource you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="premium" size="lg">Return to Base</Button>
        </Link>
      </div>
    </div>
  );
}
