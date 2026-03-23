import React from "react";
import { useLocation } from "wouter";
import { useSubmitOnboarding } from "@workspace/api-client-react";
import { Button, Card, CardContent } from "@/components/ui/shared";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "role", title: "Current Role", type: "single", options: [{id: "first_time_manager", label: "First-Time Manager (0-2 yrs)"}, {id: "individual_contributor", label: "Ambitious Individual Contributor"}] },
  { id: "biggest_challenge", title: "Biggest Challenge", type: "single", options: [{id: "politics", label: "Workplace Politics"}, {id: "imposter_syndrome", label: "Imposter Syndrome"}, {id: "difficult_conversations", label: "Difficult Conversations"}, {id: "visibility", label: "Visibility & Recognition"}] },
  { id: "confidence", title: "Confidence Level (1-10)", type: "scale", min: 1, max: 10 },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState<any>({ fearAreas: [], desiredReputation: [], teamSize: "1-5", industry: "Tech", yearsExperience: "0-2" });
  const submitMutation = useSubmitOnboarding();

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      try {
        await submitMutation.mutateAsync({
          data: {
            roleType: data.role || "first_time_manager",
            biggestChallenge: data.biggest_challenge || "politics",
            confidenceLevel: data.confidence || 5,
            yearsExperience: data.yearsExperience,
            teamSize: data.teamSize,
            industry: data.industry,
            fearAreas: data.fearAreas,
            desiredReputation: data.desiredReputation
          }
        });
        setLocation("/dashboard");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const currentStep = STEPS[step];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex gap-2 justify-center">
          {STEPS.map((_, i) => (
            <div key={i} className={cn("h-1.5 w-12 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-white/10")} />
          ))}
        </div>
        
        <Card className="animate-slide-up bg-card/60 backdrop-blur-xl border-white/5 p-8">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">{currentStep.title}</h2>
          
          <div className="space-y-3 mb-8">
            {currentStep.type === "single" && currentStep.options?.map(opt => (
              <button
                key={opt.id}
                onClick={() => setData({ ...data, [currentStep.id]: opt.id })}
                className={cn(
                  "w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-200",
                  data[currentStep.id] === opt.id 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-background/50 border-white/5 hover:border-white/20 text-foreground"
                )}
              >
                <span className="font-medium">{opt.label}</span>
                {data[currentStep.id] === opt.id && <CheckCircle2 className="w-5 h-5" />}
              </button>
            ))}

            {currentStep.type === "scale" && (
              <div className="px-4 py-8">
                <input 
                  type="range" 
                  min="1" max="10" 
                  value={data[currentStep.id] || 5} 
                  onChange={(e) => setData({ ...data, [currentStep.id]: parseInt(e.target.value) })}
                  className="w-full accent-primary" 
                />
                <div className="flex justify-between text-muted-foreground mt-4 font-medium">
                  <span>Low</span>
                  <span className="text-primary font-bold text-xl">{data[currentStep.id] || 5}</span>
                  <span>High</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-white/5">
            <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            <Button variant="premium" onClick={handleNext} disabled={!data[currentStep.id] && currentStep.type !== 'scale'} isLoading={submitMutation.isPending}>
              {step === STEPS.length - 1 ? "Complete Setup" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
