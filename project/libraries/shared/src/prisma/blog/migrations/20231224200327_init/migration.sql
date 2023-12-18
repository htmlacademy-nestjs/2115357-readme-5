/*
  Warnings:

  - You are about to drop the column `userId` on the `posts` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "originalAuthorId" TEXT,
ADD COLUMN     "originalPostId" TEXT,
ADD COLUMN     "rePosted" BOOLEAN NOT NULL DEFAULT false;
