'use client';

import { useState } from 'react';
import type { SupportResource, ExamType } from '@/lib/types';
import { ALL_SUPPORT_RESOURCES } from '@/lib/constants';

interface SupportResourcesProps {
  examType?: ExamType;
  showAll?: boolean;
}

export default function SupportResources({
  examType,
  showAll = false,
}: SupportResourcesProps) {
  const [expanded, setExpanded] = useState(showAll);

  const resources: SupportResource[] = ALL_SUPPORT_RESOURCES.filter(
    (r) => !r.showFor || !examType || r.showFor.includes(examType),
  );

  const primaryResources = resources.slice(0, 3);
  const displayed = expanded ? resources : primaryResources;

  return (
    <section
      aria-labelledby="support-resources-heading"
      className="rounded-2xl p-5 border border-[#EAE5DF] bg-[#FFFFFF]"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#729C7C] mb-1">
          Support Resources
        </p>
        <h3 id="support-resources-heading" className="text-base font-bold text-[#1C1917]">
          If you need to talk to someone
        </h3>
        <p className="text-xs text-[#A8A29E] mt-1">
          Reaching out to a trusted person is always the safest first step.
        </p>
      </div>

      <div className="space-y-3" role="list" aria-label="Support resources">
        {displayed.map((resource) => (
          <div
            key={resource.name}
            role="listitem"
            className="flex items-start gap-3 p-3.5 rounded-xl border border-[#EAE5DF] bg-[#FDFBF7]/60"
          >
            <div className="w-8 h-8 rounded-lg bg-[#729C7C]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              {resource.telLink ? '📞' : '🤝'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1C1917]">{resource.name}</p>
              {resource.telLink ? (
                <a
                  href={resource.telLink}
                  className="text-sm text-[#7A9E9F] hover:text-[#729C7C] transition-colors font-medium mt-0.5 block"
                  aria-label={`Call ${resource.name} at ${resource.contact}`}
                >
                  {resource.contact}
                </a>
              ) : (
                <p className="text-sm text-[#78716C] mt-0.5">{resource.contact}</p>
              )}
              <p className="text-xs text-[#D6D1CB] mt-1">{resource.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Show more / less */}
      {resources.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-[#8C7A6B] hover:text-[#F5E6D3] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7A6B] rounded"
          aria-expanded={expanded}
          aria-controls="support-resources-heading"
        >
          {expanded ? 'Show fewer resources' : `Show ${resources.length - 3} more resources`}
        </button>
      )}

      <p className="mt-4 text-xs text-[#D6D1CB] border-t border-[#EAE5DF] pt-3">
        ⚠️ Availability may vary. If you are in immediate danger, contact local emergency services or a trusted adult immediately.
      </p>
    </section>
  );
}
