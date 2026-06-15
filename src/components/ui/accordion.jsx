import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// Lightweight, accessible accordion. Each item manages its own open state.
//
// <Accordion>
//   <AccordionItem title="..." defaultOpen>...body...</AccordionItem>
// </Accordion>

export const AccordionItem = ({ title, subtitle, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[color:var(--color-border)] rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[color:var(--color-background-alt)] transition-colors"
      >
        <span className="min-w-0">
          <span className="block font-semibold text-[color:var(--color-text-dark)]">{title}</span>
          {subtitle ? (
            <span className="block text-sm text-[color:var(--color-text-light)] mt-0.5">{subtitle}</span>
          ) : null}
        </span>
        <ChevronDownIcon
          className={`w-5 h-5 shrink-0 text-[color:var(--color-primary)] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <div className="px-5 pb-5 pt-0 text-[color:var(--color-text-light)] leading-relaxed">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export const Accordion = ({ children, className = '' }) => (
  <div className={`space-y-3 ${className}`}>{children}</div>
);

export default Accordion;
