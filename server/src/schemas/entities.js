// Centralized Zod schemas for all CRUD entities. Both routes and the CRUD
// factory consume these — keeping them in one place avoids drift.
import { z } from 'zod';

// Accepts "" / null / "YYYY-MM-DD" / full ISO; yields a Date or null.
const dateField = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  });

export const tourSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  pricePerPerson: z.number().nullable().optional(),
  originalPrice: z.number().nullable().optional(),
  campaignPrice: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  priceStatus: z.string().nullable().optional(),
  priceNote: z.string().nullable().optional(),
  groupSize: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  type: z.enum(['international', 'domestic']).nullable().optional(),
  destination: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  gallery: z.array(z.string()).default([]),
  specialOffer: z.boolean().optional().default(false),
  dates: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  highlights: z.array(z.string()).default([]),
  included: z.array(z.string()).default([]),
  notIncluded: z.array(z.string()).default([]),
  itinerary: z
    .array(
      z.object({
        day: z.string().optional(),
        date: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        activities: z.array(z.string()).optional(),
      })
    )
    .nullable()
    .optional(),
  faq: z
    .array(
      z.object({
        question: z.string().optional(),
        answer: z.string().optional(),
      })
    )
    .nullable()
    .optional(),
  // Per-locale content overrides (e.g. { en: { title, description, ... } }).
  // Kept loose on purpose — the admin sends a structured object; the frontend
  // falls back to the base (Turkish) columns for any missing field/locale.
  translations: z.record(z.any()).nullable().optional(),
  whatsappMessage: z.string().nullable().optional(),
  startDate: dateField,
  endDate: dateField,
  // Departure calendar — multiple dates for one tour. Dates kept as plain
  // strings (YYYY-MM-DD) inside the JSON column; the frontend parses them.
  departures: z
    .array(
      z.object({
        label: z.string().nullable().optional(),
        startDate: z.string().nullable().optional(),
        endDate: z.string().nullable().optional(),
      })
    )
    .nullable()
    .optional(),
  instagramUrl: z.string().nullable().optional(),
  instagramData: z.any().nullable().optional(),
  active: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});

export const reviewSchema = z.object({
  tourSlug: z.string().nullable().optional(),
  authorName: z.string().min(1),
  location: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5).optional().default(5),
  content: z.string().min(1),
  isPublished: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
});

export const blogSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  publishedAt: z
    .string()
    .datetime()
    .nullable()
    .optional()
    .transform((v) => (v ? new Date(v) : null)),
  author: z.string().nullable().optional(),
  active: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

export const serviceSchema = z.object({
  serviceId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  fullDescription: z.string().nullable().optional(),
  features: z.array(z.string()).default([]),
  isWomenGroup: z.boolean().optional().default(false),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const heroSlideSchema = z.object({
  image: z.string().min(1),
  alt: z.string().nullable().optional(),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const heroButtonSchema = z.object({
  label: z.string().min(1),
  labelKey: z.string().nullable().optional(),
  href: z.string().min(1),
  style: z.string().nullable().optional(),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const categorySchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().nullable().optional(),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const formOptionSchema = z.object({
  groupName: z.string().min(1),
  value: z.string().min(1),
  label: z.string().min(1),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const budgetRouteSchema = z.object({
  persons: z.number().int().min(1),
  budget: z.number(),
  destination: z.string().min(1),
  days: z.number().int().min(1),
  departure: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  highlights: z.array(z.string()).default([]),
  price: z.number(),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});

export const tourWizardOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
});

export const tourWizardStepSchema = z.object({
  step: z.string().min(1),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  options: z.array(tourWizardOptionSchema).default([]),
  order: z.number().int().optional().default(0),
  active: z.boolean().optional().default(true),
});
