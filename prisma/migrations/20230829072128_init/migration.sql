/*
  Warnings:

  - Added the required column `is_verified` to the `DonorGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DonorGroup" ADD COLUMN     "is_verified" BOOLEAN NOT NULL;
