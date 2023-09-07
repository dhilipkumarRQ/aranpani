/*
  Warnings:

  - A unique constraint covering the columns `[phone_number]` on the table `Donor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plan_name` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donor" ALTER COLUMN "otp" DROP NOT NULL,
ALTER COLUMN "is_active" SET DEFAULT true,
ALTER COLUMN "language" SET DEFAULT 'english';

-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "plan_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Donor_phone_number_key" ON "Donor"("phone_number");
