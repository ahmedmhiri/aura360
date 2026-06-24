-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionFr" TEXT NOT NULL,
    "typeEn" TEXT NOT NULL DEFAULT '',
    "typeFr" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL DEFAULT '',
    "year" INTEGER,
    "coverImage" TEXT NOT NULL DEFAULT '',
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "servicesEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "servicesFr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_categoryId_idx" ON "Project"("categoryId");

-- CreateIndex
CREATE INDEX "Project_featured_idx" ON "Project"("featured");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
