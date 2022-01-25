/*
  Warnings:

  - You are about to drop the column `user_id` on the `Patient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_user_id_fkey";

-- DropIndex
DROP INDEX "Patient_user_id_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "user_id";
