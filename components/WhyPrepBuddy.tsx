import React from 'react';

const reasons = [
  {
    title: 'Detects exam stress loops, not just mood',
    description: 'Goes beyond "how do you feel" to identify specific cognitive distortions and procrastination loops common in exam prep.',
    icon: '🔁',
  },
  {
    title: 'Gives one safe next action, not long advice',
    description: 'When you\'re overwhelmed, the last thing you need is a 10-step plan. We give you a single, micro-action to reset.',
    icon: '🎯',
  },
  {
    title: 'Works without login or PII',
    description: 'No accounts, no tracking. Your check-ins stay entirely on your device for complete privacy.',
    icon: '🔒',
  },
  {
    title: 'Crisis safety runs before AI',
    description: 'Built-in deterministic safety checks ensure you are directed to human help instantly if a crisis is detected.',
    icon: '🛡️',
  },
  {
    title: 'Local journey stays on device',
    description: 'Track your progress and triggers over time without your data ever leaving your browser.',
    icon: '📱',
  },
];

export default function WhyPrepBuddy() {
  return (
    <section className="py-16 bg-[#111827] border-y border-[#1E293B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] text-center mb-10">
          Built for exam stress, not generic wellness.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, idx) => (
            <div 
              key={idx} 
              className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 flex flex-col items-start gap-4 hover:border-[#818CF8] transition-colors"
            >
              <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center text-2xl border border-[#334155]">
                {reason.icon}
              </div>
              <div>
                <h3 className="text-[#F8FAFC] font-bold text-lg mb-2">
                  {reason.title}
                </h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">
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
