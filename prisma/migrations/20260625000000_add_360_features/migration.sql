-- AlterTable: add 360 panorama flag to cover image
ALTER TABLE "Project" ADD COLUMN "coverImage360" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: add array of 360 panorama image URLs
ALTER TABLE "Project" ADD COLUMN "panoramas" TEXT[] DEFAULT ARRAY[]::TEXT[];
