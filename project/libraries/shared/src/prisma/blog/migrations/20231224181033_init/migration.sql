-- CreateEnum
CREATE TYPE "EPostType" AS ENUM ('video', 'text', 'citation', 'photo', 'link');

-- CreateEnum
CREATE TYPE "EPostState" AS ENUM ('published', 'draft');

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "EPostType" NOT NULL,
    "state" "EPostState" NOT NULL DEFAULT 'published',
    "body" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_postsTotags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_postsTotags_AB_unique" ON "_postsTotags"("A", "B");

-- CreateIndex
CREATE INDEX "_postsTotags_B_index" ON "_postsTotags"("B");

-- AddForeignKey
ALTER TABLE "_postsTotags" ADD CONSTRAINT "_postsTotags_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_postsTotags" ADD CONSTRAINT "_postsTotags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
