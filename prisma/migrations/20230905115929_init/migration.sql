-- AlterEnum
ALTER TYPE "payment_mode" ADD VALUE 'stripe';

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "payment_session_id" SET DATA TYPE TEXT;
