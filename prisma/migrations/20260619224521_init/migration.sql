-- CreateEnum
CREATE TYPE "ImpactArea" AS ENUM ('ENVIRONMENTAL', 'SOCIAL', 'ECONOMIC', 'TECHNICAL', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "ImpactLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "ImpactStatus" AS ENUM ('PROPOSED', 'APPROVED', 'IMPLEMENTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "ImpactItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impactArea" "ImpactArea" NOT NULL,
    "likelihood" "ImpactLevel" NOT NULL,
    "severity" "ImpactLevel" NOT NULL,
    "status" "ImpactStatus" NOT NULL DEFAULT 'PROPOSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImpactItem_pkey" PRIMARY KEY ("id")
);
