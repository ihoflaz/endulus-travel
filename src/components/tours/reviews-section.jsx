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
          <StarIcon key={i} className="h-5 w-5 text-amber-400" aria-hidden="true" />
        ) : (
          <StarOutlineIcon key={i} className="h-5 w-5 text-amber-400" aria-hidden="true" />
        )
      )}
    </div>
  );
};

const ReviewCard = ({ review }) => (
  <div className="flex flex-col h-full bg-[color:var(--color-background)] border border-[color:var(--color-border)] rounded-xl shadow-md p-6 hover-float">
    <StarRating rating={review.rating} />
    <p className="mt-4 flex-1 text-[color:var(--color-text-dark)] leading-relaxed">
      {review.content}
    </p>
    <div className="mt-5 pt-4 border-t border-[color:var(--color-border)]">
      <p className="font-semibold text-[color:var(--color-text-dark)]">{review.authorName}</p>
      {review.location && (
        <p className="text-sm text-[color:var(--color-text-light)] mt-0.5">{review.location}</p>
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
        <StarIcon className="h-7 w-7 text-amber-400" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-[color:var(--color-text-dark)]">
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
