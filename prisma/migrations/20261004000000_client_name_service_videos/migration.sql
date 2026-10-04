-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "clientName" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "ServiceVideo" (
    "service" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceVideo_pkey" PRIMARY KEY ("service")
);
