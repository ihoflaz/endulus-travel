-- Departure calendar: multiple dates for a single tour.
-- Shape: [{ "label": "24 - 31 Temmuz 2026", "startDate": "2026-07-24", "endDate": "2026-07-31" }]
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "departures" JSONB;
