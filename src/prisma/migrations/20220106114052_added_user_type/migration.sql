/*
  Warnings:

  - Added the required column `user_type_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Caregiver" DROP CONSTRAINT "Caregiver_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Mentor" DROP CONSTRAINT "Mentor_user_id_fkey";

-- AlterTable
ALTER TABLE "Caregiver" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Mentor" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "user_type_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "UserType"("user_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
