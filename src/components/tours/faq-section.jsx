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
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover-float animate-fade-in">
      <h3 className="text-xl font-bold mb-6 text-[color:var(--color-text-dark)] flex items-center">
        <div className="w-6 h-6 bg-[color:var(--color-primary)] rounded-lg flex items-center justify-center mr-3">
          <QuestionMarkCircleIcon className="w-4 h-4 text-white" />
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
