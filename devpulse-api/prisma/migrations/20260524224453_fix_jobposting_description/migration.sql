/*
  Warnings:

  - You are about to drop the column `Description` on the `job_postings` table. All the data in the column will be lost.
  - Added the required column `description` to the `job_postings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_postings" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT NOT NULL;
