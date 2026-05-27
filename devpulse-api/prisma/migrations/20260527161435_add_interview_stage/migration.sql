/*
  Warnings:

  - The values [interveiew] on the enum `ApplicationStage` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStage_new" AS ENUM ('applied', 'screening', 'interview', 'offer', 'hired', 'rejected');
ALTER TABLE "public"."applications" ALTER COLUMN "stage" DROP DEFAULT;
ALTER TABLE "applications" ALTER COLUMN "stage" TYPE "ApplicationStage_new" USING ("stage"::text::"ApplicationStage_new");
ALTER TABLE "stage_transitions" ALTER COLUMN "from_stage" TYPE "ApplicationStage_new" USING ("from_stage"::text::"ApplicationStage_new");
ALTER TABLE "stage_transitions" ALTER COLUMN "to_stage" TYPE "ApplicationStage_new" USING ("to_stage"::text::"ApplicationStage_new");
ALTER TYPE "ApplicationStage" RENAME TO "ApplicationStage_old";
ALTER TYPE "ApplicationStage_new" RENAME TO "ApplicationStage";
DROP TYPE "public"."ApplicationStage_old";
ALTER TABLE "applications" ALTER COLUMN "stage" SET DEFAULT 'applied';
COMMIT;
