-- CreateIndex
CREATE INDEX "BlogPost_active_publishedAt_idx" ON "BlogPost"("active", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_category_idx" ON "BlogPost"("category");
