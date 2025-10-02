/*
  Warnings:

  - You are about to drop the column `projectId` on the `time_logs` table. All the data in the column will be lost.
  - You are about to drop the column `taskId` on the `time_logs` table. All the data in the column will be lost.
  - You are about to drop the column `taskName` on the `time_logs` table. All the data in the column will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."tasks" DROP CONSTRAINT "tasks_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."time_logs" DROP CONSTRAINT "time_logs_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."time_logs" DROP CONSTRAINT "time_logs_taskId_fkey";

-- AlterTable
ALTER TABLE "time_logs" DROP COLUMN "projectId",
DROP COLUMN "taskId",
DROP COLUMN "taskName",
ADD COLUMN     "projectIdentifier" TEXT NOT NULL DEFAULT 'MIGRATE_TEMP_VALUE',
ADD COLUMN     "taskIdentifier" TEXT;

-- DropTable
DROP TABLE "public"."projects";

-- DropTable
DROP TABLE "public"."tasks";
