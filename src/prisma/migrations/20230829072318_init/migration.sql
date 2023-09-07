/*
  Warnings:

  - Added the required column `language` to the `Donor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Language" AS ENUM ('tamil', 'english');

-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "language" "Language" NOT NULL;
