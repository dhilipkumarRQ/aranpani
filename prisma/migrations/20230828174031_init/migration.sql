-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('proposed', 'planned', 'active', 'completed', 'scrapped');

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "register_no" TEXT NOT NULL,
    "temple_name" TEXT NOT NULL,
    "temple_incharge_name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'proposed',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "estimate_amount" INTEGER NOT NULL,
    "expensed_amount" INTEGER NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectActivity" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "content_english" TEXT NOT NULL,
    "content_tamil" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_register_no_key" ON "Project"("register_no");

-- AddForeignKey
ALTER TABLE "ProjectActivity" ADD CONSTRAINT "ProjectActivity_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
