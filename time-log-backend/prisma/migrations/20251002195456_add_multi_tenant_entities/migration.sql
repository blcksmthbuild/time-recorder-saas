-- AlterTable
ALTER TABLE "time_logs" ALTER COLUMN "projectIdentifier" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Entity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEntity" (
    "userId" INTEGER NOT NULL,
    "entityId" INTEGER NOT NULL,

    CONSTRAINT "UserEntity_pkey" PRIMARY KEY ("userId","entityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entity_name_key" ON "Entity"("name");

-- AddForeignKey
ALTER TABLE "UserEntity" ADD CONSTRAINT "UserEntity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEntity" ADD CONSTRAINT "UserEntity_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
