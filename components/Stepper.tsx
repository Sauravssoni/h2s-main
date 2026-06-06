'use client';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function Stepper({ currentStep, totalSteps, labels }: StepperProps) {
  return (
    <nav aria-label="Check-in progress" className="w-full mb-8">
      <ol className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div
          className="absolute top-4 left-0 h-0.5 bg-[#1E293B] z-0"
          style={{ width: '100%' }}
          aria-hidden="true"
        />
        <div
          className="absolute top-4 left-0 h-0.5 z-0 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            background: 'linear-gradient(to right, #818CF8, #2DD4BF)',
          }}
          aria-hidden="true"
        />

        {labels.map((label, idx) => {
          const step = idx + 1;
          const isComplete = step < currentStep;
          const isActive = step === currentStep;

          return (
            <li
              key={label}
              className="flex flex-col items-center gap-2 z-10"
              aria-current={isActive ? 'step' : undefined}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                  isComplete
                    ? 'bg-[#818CF8] border-[#818CF8] text-white'
                    : isActive
                    ? 'bg-[#0F172A] border-[#818CF8] text-[#818CF8]'
                    : 'bg-[#0F172A] border-[#1E293B] text-[#475569]'
                }`}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isActive ? 'text-[#C7D2FE]' : 'text-[#475569]'
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
