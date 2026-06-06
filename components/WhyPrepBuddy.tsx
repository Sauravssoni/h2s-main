const reasons = [
  {
    title: 'Mock Hangover Detector',
    description: 'Identifies specific exam-stress loops and procrastination cycles common in exam prep after a bad mock score.',
    icon: '🔁',
  },
  {
    title: 'Backlog Paralysis Breaker',
    description: 'When the syllabus feels infinite, we give you a micro-action to reset and start moving forward again.',
    icon: '🎯',
  },
  {
    title: 'Local-Only Journey',
    description: 'No accounts, no tracking. Your check-ins stay entirely on your device for complete privacy.',
    icon: '🔒',
  },
  {
    title: 'Crisis Safety Before AI',
    description: 'Built-in deterministic safety checks ensure you are directed to human help instantly if a crisis is detected.',
    icon: '🛡️',
  },
  {
    title: 'One Safe Next Step',
    description: 'Track your progress and triggers over time and get exactly one safe next step to focus on.',
    icon: '📱',
  },
];

export default function WhyPrepBuddy() {
  return (
    <section className="py-16 bg-[var(--color-bg)] border-y border-[var(--color-card-border)] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text)] text-center mb-10">
          Built for exam stress, not generic wellness.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, idx) => (
            <div 
              key={idx} 
              className="bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-2xl p-6 flex flex-col items-start gap-4 hover:border-[var(--color-lavender)]/50 transition-colors shadow-sm glass-card"
            >
              <div className="w-12 h-12 bg-[var(--color-bg)] rounded-xl flex items-center justify-center text-2xl border border-[var(--color-card-border)] shadow-sm">
                {reason.icon}
              </div>
              <div>
                <h3 className="text-[var(--color-text)] font-bold text-lg mb-2">
                  {reason.title}
                </h3>
                <p className="text-[var(--color-muted)] text-sm leading-relaxed font-medium">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
