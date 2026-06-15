import { useTranslation } from 'react-i18next';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Accordion, AccordionItem } from '../ui/accordion';

// FAQ accordion for the tour detail page. Renders a list of question/answer
// pairs using the shared accordion primitive. Renders nothing when there are
// no entries to show.
const FaqSection = ({ faq = [] }) => {
  const { t } = useTranslation();

  if (!faq || faq.length === 0) return null;

  return (
    <div className="ds-glass rounded-2xl p-8">
      <h3 className="text-xl font-bold mb-6 text-[var(--ds-text)] flex items-center">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center mr-3" style={{ background: 'var(--ds-gold)' }}>
          <QuestionMarkCircleIcon className="w-4 h-4" style={{ color: 'var(--ds-bg, #0a0a12)' }} />
        </div>
        {t('tourDetail.faqTitle', 'Sıkça Sorulan Sorular')}
      </h3>
      <Accordion>
        {faq.map((item, index) => (
          <AccordionItem key={index} title={item.question} defaultOpen={index === 0}>
            {item.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqSection;
