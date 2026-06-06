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
          className="absolute top-4 left-0 h-0.5 bg-[#EAE5DF] z-0"
          style={{ width: '100%' }}
          aria-hidden="true"
        />
        <div
          className="absolute top-4 left-0 h-0.5 z-0 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            background: 'linear-gradient(to right, #8C7A6B, #7A9E9F)',
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
                    ? 'bg-[#8C7A6B] border-[#8C7A6B] text-white'
                    : isActive
                    ? 'bg-[#FDFBF7] border-[#8C7A6B] text-[#8C7A6B]'
                    : 'bg-[#FDFBF7] border-[#EAE5DF] text-[#D6D1CB]'
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
                  isActive ? 'text-[#F5E6D3]' : 'text-[#D6D1CB]'
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
