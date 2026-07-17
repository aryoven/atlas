"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Calculator,
  Code2,
  Headphones,
  Loader2,
  Megaphone,
  Sparkles,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { createEmployeeForOnboarding } from "@/app/actions/employees";
import { uploadEmployeeDocument } from "@/app/actions/documents";
import {
  buildOnboardingInstructions,
  getOnboardingTemperature,
  ONBOARDING_PERSONALITIES,
  ONBOARDING_ROLES,
  ONBOARDING_TOTAL_STEPS,
  type OnboardingPersonality,
  type OnboardingRole,
} from "@/lib/onboarding/constants";
import OnboardingFilePicker from "@/components/onboarding/OnboardingFilePicker";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ROLE_ICONS = {
  Sales: TrendingUp,
  Support: Headphones,
  Marketing: Megaphone,
  Programmer: Code2,
  Accountant: Calculator,
  Custom: Wrench,
} as const;

const PERSONALITY_HINTS: Record<OnboardingPersonality, string> = {
  Professional: "Clear and polished",
  Friendly: "Warm and approachable",
  Concise: "Short and direct",
  Expert: "Precise and insightful",
  Custom: "Adapt to context",
};

type OnboardingState = {
  name: string;
  role: OnboardingRole | "";
  goal: string;
  files: File[];
  personality: OnboardingPersonality | "";
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<OnboardingState>({
    name: "",
    role: "",
    goal: "",
    files: [],
    personality: "",
  });

  const goTo = (nextStep: number) => {
    setDirection(nextStep > step ? 1 : -1);
    setError(null);
    setStep(nextStep);
  };

  const handleCreate = async () => {
    if (
      !state.name.trim() ||
      !state.role ||
      !state.goal.trim() ||
      !state.personality
    ) {
      setError("Please complete all required steps.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await createEmployeeForOnboarding({
      name: state.name.trim(),
      role: state.role,
      instructions: buildOnboardingInstructions(
        state.goal,
        state.personality
      ),
      model: "OpenRouter Free",
      temperature: getOnboardingTemperature(state.personality),
    });

    if ("error" in result && result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    if (!("employeeId" in result)) {
      setError("Failed to create AI Employee.");
      setIsSubmitting(false);
      return;
    }

    const { employeeId } = result;

    for (const file of state.files) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadResult = await uploadEmployeeDocument(employeeId, formData);

      if ("error" in uploadResult) {
        setError(
          `Employee created, but ${file.name} failed to upload: ${uploadResult.error}`
        );
        setIsSubmitting(false);
        router.push(`/dashboard/employees/${employeeId}`);
        return;
      }
    }

    router.push(`/dashboard/employees/${employeeId}`);
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <div className="mb-8">
        <div
          className="mb-3 flex items-center justify-between text-xs text-muted"
          aria-live="polite"
        >
          <span>
            Step {step} of {ONBOARDING_TOTAL_STEPS}
          </span>
          {step > 1 && (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-white"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back
            </button>
          )}
        </div>
        <div
          className="h-1 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={ONBOARDING_TOTAL_STEPS}
          aria-label="Onboarding progress"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${(step / ONBOARDING_TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {step === 1 && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Welcome to Aryoven
              </h1>
              <p className="mt-3 text-base text-muted">
                Let&apos;s build your first AI Employee.
              </p>
              <Button
                type="button"
                size="lg"
                className="mt-10 w-full sm:w-auto"
                onClick={() => goTo(2)}
              >
                Create AI Employee
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white">Employee Name</h2>
              <div className="mt-8 space-y-2">
                <Label htmlFor="employee-name">Employee Name</Label>
                <Input
                  id="employee-name"
                  value={state.name}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Sales Assistant"
                  autoFocus
                  autoComplete="off"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && state.name.trim()) {
                      event.preventDefault();
                      goTo(3);
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                className="mt-8 w-full"
                disabled={!state.name.trim()}
                onClick={() => goTo(3)}
              >
                Next
              </Button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white">Role</h2>
              <p className="mt-2 text-sm text-muted">Choose what this employee does.</p>
              <div
                className="mt-8 grid grid-cols-2 gap-3"
                role="listbox"
                aria-label="Employee role"
              >
                {ONBOARDING_ROLES.map((role) => {
                  const Icon = ROLE_ICONS[role];
                  const selected = state.role === role;

                  return (
                    <button
                      key={role}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        setState((current) => ({ ...current, role }));
                        goTo(4);
                      }}
                      className={cn(
                        "flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
                        selected
                          ? "border-primary/50 bg-primary/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      )}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-white">{role}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-white">Goal</h2>
              <div className="mt-8 space-y-2">
                <Label htmlFor="employee-goal">What should this AI Employee do?</Label>
                <textarea
                  id="employee-goal"
                  value={state.goal}
                  onChange={(event) =>
                    setState((current) => ({
                      ...current,
                      goal: event.target.value,
                    }))
                  }
                  placeholder="Describe what this AI Employee should do..."
                  rows={5}
                  autoFocus
                  className="flex w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button
                type="button"
                className="mt-8 w-full"
                disabled={!state.goal.trim()}
                onClick={() => goTo(5)}
              >
                Next
              </Button>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-white">Knowledge</h2>
              <div className="mt-8">
                <OnboardingFilePicker
                  files={state.files}
                  onChange={(files) =>
                    setState((current) => ({ ...current, files }))
                  }
                  disabled={isSubmitting}
                />
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => goTo(6)}
                >
                  Skip
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => goTo(6)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-2xl font-bold text-white">Personality</h2>
              <p className="mt-2 text-sm text-muted">How should this employee communicate?</p>
              <div
                className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
                role="listbox"
                aria-label="Employee personality"
              >
                {ONBOARDING_PERSONALITIES.map((personality) => {
                  const selected = state.personality === personality;

                  return (
                    <button
                      key={personality}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() =>
                        setState((current) => ({
                          ...current,
                          personality,
                        }))
                      }
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-colors",
                        selected
                          ? "border-primary/50 bg-primary/10"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]"
                      )}
                    >
                      <span className="block text-sm font-medium text-white">
                        {personality}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {PERSONALITY_HINTS[personality]}
                      </span>
                    </button>
                  );
                })}
              </div>
              <Button
                type="button"
                className="mt-8 w-full"
                disabled={!state.personality}
                onClick={() => goTo(7)}
              >
                Next
              </Button>
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="text-2xl font-bold text-white">Review</h2>
              <dl className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm text-muted">Name</dt>
                  <dd className="text-right text-sm font-medium text-white">
                    {state.name}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-white/10 pt-4">
                  <dt className="text-sm text-muted">Role</dt>
                  <dd className="text-right text-sm font-medium text-white">
                    {state.role}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-white/10 pt-4">
                  <dt className="text-sm text-muted">Personality</dt>
                  <dd className="text-right text-sm font-medium text-white">
                    {state.personality}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 border-t border-white/10 pt-4">
                  <dt className="text-sm text-muted">Knowledge files</dt>
                  <dd className="text-right text-sm font-medium text-white">
                    {state.files.length}
                  </dd>
                </div>
              </dl>

              {error && (
                <p
                  className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <Button
                type="button"
                className="mt-8 w-full"
                disabled={isSubmitting}
                onClick={() => void handleCreate()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Briefcase className="h-4 w-4" aria-hidden="true" />
                    Create AI Employee
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
