/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,donorId]` on the table `feeds` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "feeds_ownerId_donorId_key" ON "feeds"("ownerId", "donorId");
