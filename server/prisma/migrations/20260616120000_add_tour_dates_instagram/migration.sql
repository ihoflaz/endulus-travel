-- Structured departure window (auto past/upcoming + sorting) and Instagram recap.
ALTER TABLE "Tour" ADD COLUMN "startDate" TIMESTAMP(3);
ALTER TABLE "Tour" ADD COLUMN "endDate" TIMESTAMP(3);
ALTER TABLE "Tour" ADD COLUMN "instagramUrl" TEXT;
ALTER TABLE "Tour" ADD COLUMN "instagramData" JSONB;

CREATE INDEX "Tour_startDate_idx" ON "Tour"("startDate");
