-- AlterTable: add array of project video URLs (Vercel Blob)
ALTER TABLE "Project" ADD COLUMN "videos" TEXT[] DEFAULT ARRAY[]::TEXT[];
