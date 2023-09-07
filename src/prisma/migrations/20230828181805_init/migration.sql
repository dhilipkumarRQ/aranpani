-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('file', 'image');

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "attachment_type" "AttachmentType" NOT NULL DEFAULT 'image',
    "attachment_type_id" INTEGER NOT NULL,
    "attachment_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "projectId" FOREIGN KEY ("attachment_type_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "projectActivityId" FOREIGN KEY ("attachment_type_id") REFERENCES "ProjectActivity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
