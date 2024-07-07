-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organisation" (
    "id" SERIAL NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrganisationToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_orgId_key" ON "Organisation"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganisationToUser_AB_unique" ON "_OrganisationToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganisationToUser_B_index" ON "_OrganisationToUser"("B");

-- AddForeignKey
ALTER TABLE "_OrganisationToUser" ADD CONSTRAINT "_OrganisationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganisationToUser" ADD CONSTRAINT "_OrganisationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
