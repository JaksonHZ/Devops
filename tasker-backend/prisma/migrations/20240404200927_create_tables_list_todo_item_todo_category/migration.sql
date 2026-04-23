-- CreateTable
CREATE TABLE "ListTODO" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "done" BOOLEAN NOT NULL,
    "orderNumber" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ListTODO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemTODO" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "done" BOOLEAN NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "listTODOId" TEXT NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "ItemTODO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListTODO" ADD CONSTRAINT "ListTODO_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTODO" ADD CONSTRAINT "ItemTODO_listTODOId_fkey" FOREIGN KEY ("listTODOId") REFERENCES "ListTODO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemTODO" ADD CONSTRAINT "ItemTODO_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
