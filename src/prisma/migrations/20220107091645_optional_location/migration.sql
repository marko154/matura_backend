-- DropForeignKey
ALTER TABLE "Caregiver" DROP CONSTRAINT "Caregiver_location_id_fkey";

-- DropForeignKey
ALTER TABLE "Patient" DROP CONSTRAINT "Patient_location_id_fkey";

-- AlterTable
ALTER TABLE "Caregiver" ALTER COLUMN "location_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "location_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE SET NULL ON UPDATE CASCADE;
