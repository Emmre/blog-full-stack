/*
  Warnings:

  - The `slug` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Post_slug_key";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "slug",
ADD COLUMN     "slug" JSONB;
