/*
  Warnings:

  - The `plan` column on the `organizations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `role` on the `organization_members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `project_members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `workspace_members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `ownerType` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('FREELANCER', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('USER', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "OrgRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "WorkspaceRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('LEAD', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PRO', 'TEAM', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "organization_members" DROP COLUMN "role",
ADD COLUMN     "role" "OrgRole" NOT NULL;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "plan",
ADD COLUMN     "plan" "PlanType" NOT NULL DEFAULT 'FREE',
ALTER COLUMN "limits" SET DEFAULT '{"maxWorkspaces": 1, "maxProjects": 1000, "maxMembers": 5, "features": {"teams": true}}';

-- AlterTable
ALTER TABLE "project_members" DROP COLUMN "role",
ADD COLUMN     "role" "ProjectRole" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "accountType" "AccountType" NOT NULL DEFAULT 'FREELANCER',
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "workspace_members" DROP COLUMN "role",
ADD COLUMN     "role" "WorkspaceRole" NOT NULL;

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "ownerType" "OwnerType" NOT NULL,
ALTER COLUMN "organizationId" DROP NOT NULL;
