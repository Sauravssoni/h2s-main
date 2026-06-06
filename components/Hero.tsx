'use client';

interface HeroProps {
  onStart: () => void;
  onSampleStudent: () => void;
  onReset: () => void;
}

const DIFFERENTIATORS = [
  { icon: '🎯', text: 'Built for exam stress, not generic wellness' },
  { icon: '🔄', text: 'Detects stress loops, not just mood' },
  { icon: '⚡', text: 'Gives one safe next action, not long advice' },
  { icon: '🔒', text: 'Stores check-ins locally, not on a server' },
];

export default function Hero({ onStart, onSampleStudent, onReset }: HeroProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center relative overflow-hidden">
      {/* Background blobs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8C7A6B 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7A9E9F 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F4A261 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto relative z-10 space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#EAE5DF] px-4 py-2 rounded-full text-sm font-medium text-[#F5E6D3]">
          <span aria-hidden="true">🎓</span>
          For JEE · NEET · CUET · CAT · GATE · UPSC · Board Exams
        </div>

        {/* Logo + Name */}
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight">
            <span className="gradient-text">PrepBuddy</span>
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-[#CBD5E1]">
            Your exam stress reset, in 90 seconds.
          </p>
        </div>

        {/* Core line */}
        <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed max-w-xl mx-auto">
          PrepBuddy does not just ask how you feel. It identifies{' '}
          <strong className="text-[#F5E6D3]">what exam-stress loop you are stuck in</strong>{' '}
          and gives one safe next action.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2" aria-label="Key features">
          {[
            '📊 Track Mood',
            '🧩 Identify Triggers',
            '💭 Reflect Safely',
            '✨ Personalized Support',
            '📈 Academic Journey',
            '🔒 Private & Local',
          ].map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center gap-1 bg-[#FFFFFF] border border-[#EAE5DF] text-[#78716C] text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-4 text-white text-lg font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
            style={{ background: 'linear-gradient(135deg, #8C7A6B, #7A6A5C)' }}
            aria-label="Start your 60-second wellness check-in"
            id="start-checkin-btn"
          >
            Start Check-In →
          </button>
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-4 bg-[#FFFFFF] text-[#7A9E9F] text-base font-semibold rounded-2xl border border-[#7A9E9F]/30 hover:border-[#7A9E9F]/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7A9E9F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
            aria-label="Try the 90-second exam stress reset"
            id="start-reset-btn"
          >
            ⏱ 90-Sec Reset
          </button>
          <button
            onClick={onSampleStudent}
            className="w-full sm:w-auto px-6 py-4 bg-transparent text-[#A8A29E] text-sm font-medium rounded-2xl border border-[#EAE5DF] hover:text-[#78716C] hover:border-[#D6D1CB] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
            aria-label="Try sample student demo — JEE Mock Test Week"
            id="try-sample-btn"
          >
            Try Demo Student
          </button>
        </div>

        {/* Privacy note */}
        <p className="text-xs text-[#D6D1CB]">
          Your check-ins stay on this device. PrepBuddy does not store your journal on a server.
        </p>
      </div>

      {/* Why PrepBuddy is different */}
      <section
        className="mt-16 w-full max-w-2xl mx-auto relative z-10"
        aria-labelledby="differentiator-heading"
      >
        <h2
          id="differentiator-heading"
          className="text-lg font-bold text-[#78716C] mb-4 text-center"
        >
          Why PrepBuddy is different
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DIFFERENTIATORS.map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 bg-[#FFFFFF] border border-[#EAE5DF] rounded-xl px-4 py-3"
            >
              <span className="text-xl flex-shrink-0" aria-hidden="true">{icon}</span>
              <p className="text-sm text-[#CBD5E1]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        className="mt-12 w-full max-w-3xl mx-auto relative z-10"
        aria-labelledby="how-it-works"
      >
        <h2 id="how-it-works" className="text-lg font-bold text-[#78716C] mb-4 text-center">
          How it works
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0">
          {[
            { icon: '📝', label: 'Check-In', desc: '60-second mood snapshot' },
            { icon: '🧩', label: 'Trigger Map', desc: 'Find your stress loop' },
            { icon: '💭', label: 'Reflect', desc: 'Safe guided journal' },
            { icon: '✨', label: 'Your Plan', desc: 'Personalised support' },
            { icon: '📈', label: 'Journey', desc: '7-day trend tracking' },
          ].map(({ icon, label, desc }, i, arr) => (
            <div key={label} className="flex sm:flex-col items-center sm:items-center flex-1">
              <div className="flex flex-row sm:flex-col items-center gap-2 bg-[#FFFFFF] border border-[#EAE5DF] rounded-2xl p-3 sm:p-4 text-center sm:w-full">
                <div className="text-2xl" aria-hidden="true">{icon}</div>
                <div>
                  <p className="text-xs font-bold text-[#1C1917]">{label}</p>
                  <p className="text-xs text-[#A8A29E] mt-0.5 hidden sm:block">{desc}</p>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div
                  className="text-[#D6D1CB] mx-1 sm:mx-0 sm:my-1 flex-shrink-0 font-bold text-sm rotate-0 sm:rotate-90"
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
