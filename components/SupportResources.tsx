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
      className="rounded-2xl p-5 border border-[#1E293B] bg-[#111827]"
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#34D399] mb-1">
          Support Resources
        </p>
        <h3 id="support-resources-heading" className="text-base font-bold text-[#F8FAFC]">
          If you need to talk to someone
        </h3>
        <p className="text-xs text-[#64748B] mt-1">
          Reaching out to a trusted person is always the safest first step.
        </p>
      </div>

      <div className="space-y-3" role="list" aria-label="Support resources">
        {displayed.map((resource) => (
          <div
            key={resource.name}
            role="listitem"
            className="flex items-start gap-3 p-3.5 rounded-xl border border-[#1E293B] bg-[#0F172A]/60"
          >
            <div className="w-8 h-8 rounded-lg bg-[#34D399]/10 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              {resource.telLink ? '📞' : '🤝'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#F8FAFC]">{resource.name}</p>
              {resource.telLink ? (
                <a
                  href={resource.telLink}
                  className="text-sm text-[#2DD4BF] hover:text-[#34D399] transition-colors font-medium mt-0.5 block"
                  aria-label={`Call ${resource.name} at ${resource.contact}`}
                >
                  {resource.contact}
                </a>
              ) : (
                <p className="text-sm text-[#94A3B8] mt-0.5">{resource.contact}</p>
              )}
              <p className="text-xs text-[#475569] mt-1">{resource.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Show more / less */}
      {resources.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs text-[#818CF8] hover:text-[#C7D2FE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818CF8] rounded"
          aria-expanded={expanded}
          aria-controls="support-resources-heading"
        >
          {expanded ? 'Show fewer resources' : `Show ${resources.length - 3} more resources`}
        </button>
      )}

      <p className="mt-4 text-xs text-[#475569] border-t border-[#1E293B] pt-3">
        ⚠️ Availability may vary. If you are in immediate danger, contact local emergency services or a trusted adult immediately.
      </p>
    </section>
  );
}
