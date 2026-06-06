'use client';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'PrepBuddy is building your wellness plan...' }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] py-16 gap-8"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      {/* Premium Shimmer graphic */}
      <div className="relative w-24 h-24" aria-hidden="true">
        <div className="absolute inset-0 border-4 border-[#EAE5DF] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#8C7A6B] rounded-full animate-spin shadow-[0_0_15px_rgba(140,122,107,0.5)]"></div>
        <div className="absolute inset-2 bg-[#FDFBF7] rounded-full flex items-center justify-center overflow-hidden">
          <div className="absolute w-[200%] h-full animate-shimmer opacity-30"></div>
          <span className="relative text-2xl drop-shadow-md">✨</span>
        </div>
      </div>

      <div className="text-center space-y-3 max-w-sm px-4">
        <p className="text-xl font-bold text-[#1C1917] tracking-tight">
          {message}
        </p>
        
        {/* Loading skeleton bars */}
        <div className="w-full space-y-3 mt-4" aria-hidden="true">
          {['w-3/4', 'w-full', 'w-5/6'].map((w, i) => (
            <div
              key={i}
              className={`h-3 ${w} rounded-full bg-[#EAE5DF] overflow-hidden relative mx-auto`}
            >
              <div 
                className="absolute inset-0 w-[200%] animate-shimmer"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <p className="sr-only">Loading your personalised wellness plan. Please wait.</p>
    </div>
  );
}
