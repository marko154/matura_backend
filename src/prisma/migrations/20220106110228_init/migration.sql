-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "display_name" TEXT,
    "external_id" TEXT,
    "external_type" TEXT,
    "locale" TEXT NOT NULL DEFAULT E'sl',
    "avatar_url" TEXT,
    "last_login" TIMESTAMP(3),
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registered_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "UserType" (
    "user_type_id" SMALLSERIAL NOT NULL,
    "user_type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "UserType_pkey" PRIMARY KEY ("user_type_id")
);

-- CreateTable
CREATE TABLE "Mentor" (
    "mentor_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "emso" CHAR(13) NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "gender" "Gender" NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("mentor_id")
);

-- CreateTable
CREATE TABLE "Caregiver" (
    "caregiver_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "emso" CHAR(13) NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "gender" "Gender" NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "location_id" TEXT NOT NULL,
    "mentor_id" INTEGER NOT NULL,

    CONSTRAINT "Caregiver_pkey" PRIMARY KEY ("caregiver_id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "patient_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "emso" CHAR(13) NOT NULL,
    "email" TEXT,
    "phone_number" VARCHAR(15),
    "gender" "Gender" NOT NULL,
    "details" TEXT NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "location_id" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "Session" (
    "session_id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "notes" TEXT NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "caregiver_id" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "Location" (
    "location_id" TEXT NOT NULL,
    "coordinates" point NOT NULL,
    "street" TEXT NOT NULL,
    "street_number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "contact_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" VARCHAR(15),
    "patient_id" INTEGER NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("contact_id")
);

-- CreateTable
CREATE TABLE "Term" (
    "term_id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Term_pkey" PRIMARY KEY ("term_id")
);

-- CreateTable
CREATE TABLE "Availibility" (
    "availibilty_id" SERIAL NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "term_id" INTEGER NOT NULL,
    "caregiver_id" INTEGER NOT NULL,

    CONSTRAINT "Availibility_pkey" PRIMARY KEY ("availibilty_id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "skill_id" SMALLSERIAL NOT NULL,
    "skill_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("skill_id")
);

-- CreateTable
CREATE TABLE "CaregiverSkill" (
    "caregiver_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "CaregiverSkill_pkey" PRIMARY KEY ("caregiver_id","skill_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_external_id_key" ON "User"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserType_user_type_key" ON "UserType"("user_type");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_emso_key" ON "Mentor"("emso");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_phone_number_key" ON "Mentor"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_user_id_key" ON "Mentor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Caregiver_emso_key" ON "Caregiver"("emso");

-- CreateIndex
CREATE UNIQUE INDEX "Caregiver_phone_number_key" ON "Caregiver"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Caregiver_user_id_key" ON "Caregiver"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_emso_key" ON "Patient"("emso");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phone_number_key" ON "Patient"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_user_id_key" ON "Patient"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_phone_number_key" ON "Contact"("phone_number");

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caregiver" ADD CONSTRAINT "Caregiver_mentor_id_fkey" FOREIGN KEY ("mentor_id") REFERENCES "Mentor"("mentor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "Caregiver"("caregiver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("patient_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availibility" ADD CONSTRAINT "Availibility_term_id_fkey" FOREIGN KEY ("term_id") REFERENCES "Term"("term_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availibility" ADD CONSTRAINT "Availibility_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "Caregiver"("caregiver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaregiverSkill" ADD CONSTRAINT "CaregiverSkill_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "Caregiver"("caregiver_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaregiverSkill" ADD CONSTRAINT "CaregiverSkill_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "Skill"("skill_id") ON DELETE RESTRICT ON UPDATE CASCADE;
