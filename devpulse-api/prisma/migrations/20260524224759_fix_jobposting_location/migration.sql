/*
  Warnings:

  - You are about to drop the column `Location` on the `job_postings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "job_postings" DROP COLUMN "Location",
ADD COLUMN     "location" TEXT;
