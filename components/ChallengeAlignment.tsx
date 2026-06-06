'use client';

const CHALLENGE_CARDS = [
  {
    icon: '📊',
    title: 'Track Mood',
    description: 'Stress, anxiety, energy, sleep, focus, and confidence — all in 60 seconds.',
    color: '#7A9E9F',
    bg: 'rgba(45, 212, 191, 0.08)',
    border: 'rgba(45, 212, 191, 0.2)',
  },
  {
    icon: '🧩',
    title: 'Identify Stress Triggers',
    description:
      'Mock scores, syllabus backlog, comparison, parental pressure, result uncertainty — and 9 more.',
    color: '#8C7A6B',
    bg: 'rgba(129, 140, 248, 0.08)',
    border: 'rgba(129, 140, 248, 0.2)',
  },
  {
    icon: '💭',
    title: 'Reflect Safely',
    description: 'Short, guided reflection with non-diagnostic, exam-specific prompts.',
    color: '#F4A261',
    bg: 'rgba(244, 162, 97, 0.08)',
    border: 'rgba(244, 162, 97, 0.2)',
  },
  {
    icon: '✨',
    title: 'Get Personalized Support',
    description:
      'A reset plan, study recovery suggestions, and safety resources — tailored to your exam and phase.',
    color: '#729C7C',
    bg: 'rgba(52, 211, 153, 0.08)',
    border: 'rgba(52, 211, 153, 0.2)',
  },
];

export default function ChallengeAlignment() {
  return (
    <section
      aria-labelledby="challenge-heading"
      className="w-full max-w-4xl mx-auto px-4 py-12"
    >
      <div className="text-center mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#8C7A6B] mb-2">
          Hack2Skill Challenge Alignment
        </p>
        <h2
          id="challenge-heading"
          className="text-2xl sm:text-3xl font-bold text-[#1C1917]"
        >
          How PrepBuddy solves the challenge
        </h2>
        <p className="text-[#78716C] mt-2 text-sm max-w-lg mx-auto">
          The challenge asks for mood tracking, stress trigger identification, emotion reflection,
          and personalized wellness support. PrepBuddy delivers all four — exam-specifically.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CHALLENGE_CARDS.map(({ icon, title, description, color, bg, border }) => (
          <div
            key={title}
            className="rounded-2xl p-5 border transition-all card-hover"
            style={{ background: bg, borderColor: border }}
          >
            <div className="flex items-start gap-3">
              <div
                className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: `${color}18` }}
                aria-hidden="true"
              >
                {icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1C1917]">{title}</h3>
                <p className="text-sm text-[#78716C] mt-1">{description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
