/*
  Warnings:

  - The `status` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('todo', 'in_progress', 'review', 'done');

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'todo';

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");
