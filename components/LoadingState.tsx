'use client';

export default function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-6"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      {/* Animated pulse rings */}
      <div className="relative flex items-center justify-center w-24 h-24" aria-hidden="true">
        <div className="absolute w-24 h-24 rounded-full border-2 border-[#818CF8]/20 animate-ping" />
        <div className="absolute w-16 h-16 rounded-full border-2 border-[#818CF8]/30 animate-ping [animation-delay:0.3s]" />
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #818CF8, #2DD4BF)' }}
        >
          <span className="text-white text-xl" aria-hidden="true">💫</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-lg font-semibold text-[#F8FAFC]">
          PrepBuddy is building your wellness plan…
        </p>
        <p className="text-sm text-[#64748B]">
          Analysing your check-in and preparing personalised support
        </p>
      </div>

      {/* Loading skeleton bars */}
      <div className="w-full max-w-md space-y-3 mt-2" aria-hidden="true">
        {['w-3/4', 'w-full', 'w-5/6', 'w-2/3'].map((w, i) => (
          <div
            key={i}
            className={`h-3 ${w} rounded-full bg-[#1E293B] animate-pulse mx-auto`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <p className="sr-only">Loading your personalised wellness plan. Please wait.</p>
    </div>
  );
}
