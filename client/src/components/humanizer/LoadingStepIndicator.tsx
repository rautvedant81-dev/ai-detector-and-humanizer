import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface LoadingStepIndicatorProps {
  steps?: string[];
}

export const LoadingStepIndicator: React.FC<LoadingStepIndicatorProps> = ({
  steps = [
    'Analyzing writing patterns...',
    'Improving sentence flow and cadence...',
    'Varying sentence structures...',
    'Preserving factual claims and citations...',
    'Finalizing natural result...'
  ]
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 450);

    return () => clearInterval(interval);
  }, [steps]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-5 animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-inner">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>

      <div className="space-y-3 max-w-xs w-full">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                isDone
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : isCurrent
                  ? 'text-brand-600 dark:text-brand-400 font-bold scale-105'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : isCurrent ? (
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping shrink-0 mx-1" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0 mx-1.5" />
              )}
              <span className="truncate">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
