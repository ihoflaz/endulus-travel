import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

// Müşteri yorumları bölümü - tur sayfasında yayınlanmış yorumları gösterir.
// Sadece görüntüleme amaçlıdır; yorum gönderme formu içermez.

// Tek bir yorum için 5 üzerinden yıldız derecelendirmesi.
const StarRating = ({ rating }) => {
  const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value}/5`}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= value ? (
          <StarIcon key={i} className="h-5 w-5 text-[var(--ds-gold-bright)]" aria-hidden="true" />
        ) : (
          <StarOutlineIcon key={i} className="h-5 w-5 text-[var(--ds-gold-bright)]/50" aria-hidden="true" />
        )
      )}
    </div>
  );
};

const ReviewCard = ({ review }) => (
  <div className="ds-glass flex flex-col h-full rounded-2xl p-6">
    <StarRating rating={review.rating} />
    <p className="mt-4 flex-1 text-[var(--ds-text)] leading-relaxed">
      {review.content}
    </p>
    <div className="mt-5 pt-4 border-t border-white/10">
      <p className="font-semibold text-[var(--ds-text)]">{review.authorName}</p>
      {review.location && (
        <p className="text-sm text-[var(--ds-text-muted)] mt-0.5">{review.location}</p>
      )}
    </div>
  </div>
);

const ReviewsSection = ({ tourSlug }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let active = true;
    fetch('/data/reviews.json')
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        if (!active || !Array.isArray(data)) return;
        const filtered = data.filter(
          (r) => r && (r.tourSlug === tourSlug || !r.tourSlug)
        );
        setReviews(filtered);
      })
      .catch(() => {
        // Yükleme hataları sessizce yok sayılır.
      });
    return () => {
      active = false;
    };
  }, [tourSlug]);

  if (!reviews.length) return null;

  return (
    <section className="py-10">
      <div className="flex items-center gap-2 mb-6">
        <StarIcon className="h-7 w-7 text-[var(--ds-gold-bright)]" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-[var(--ds-text)]">
          {t('tourDetail.reviewsTitle', 'Müşteri Yorumları')}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </section>
  );
};

export default ReviewsSection;
