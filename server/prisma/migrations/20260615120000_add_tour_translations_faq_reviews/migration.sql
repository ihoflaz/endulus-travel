-- AlterTable
ALTER TABLE "Tour" ADD COLUMN     "faq" JSONB,
ADD COLUMN     "translations" JSONB;

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "tourSlug" TEXT,
    "authorName" TEXT NOT NULL,
    "location" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_tourSlug_idx" ON "Review"("tourSlug");

-- CreateIndex
CREATE INDEX "Review_isPublished_idx" ON "Review"("isPublished");
