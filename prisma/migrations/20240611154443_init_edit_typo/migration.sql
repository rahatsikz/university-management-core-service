/*
  Warnings:

  - You are about to drop the column `currentlyEnrolledStudnet` on the `offered_course_sections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "offered_course_sections" DROP COLUMN "currentlyEnrolledStudnet",
ADD COLUMN     "currentlyEnrolledStudent" INTEGER NOT NULL DEFAULT 0;
