/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "groups_userId_name_key" ON "groups"("userId", "name");
