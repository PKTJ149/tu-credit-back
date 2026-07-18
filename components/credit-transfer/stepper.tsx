import { CircleCheck } from "lucide-react";
import { stepperSteps } from "@/lib/credit-transfer/transfer-state";

type StepperProps = {
  currentStepIndex: number;
};

export function Stepper({ currentStepIndex }: StepperProps) {
  return (
    <ol className="mb-6 flex min-w-max items-center gap-1 overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-2">
      {stepperSteps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isDone = index < currentStepIndex;

        return (
          <li key={step} className="flex items-center">
            <span
              className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium ${
                isActive
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : isDone
                    ? "text-[var(--primary)]"
                    : "text-[var(--ink-muted)]"
              }`}
            >
              {isDone ? <CircleCheck aria-hidden="true" className="h-4 w-4" /> : null}
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
