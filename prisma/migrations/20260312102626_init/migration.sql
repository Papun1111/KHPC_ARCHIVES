-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "aspectRatio" DOUBLE PRECISION NOT NULL,
    "caption" TEXT,
    "eventName" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvasNode" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "scale" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "edges" TEXT NOT NULL,

    CONSTRAINT "CanvasNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ImageLabels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ImageLabels_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name");

-- CreateIndex
CREATE INDEX "_ImageLabels_B_index" ON "_ImageLabels"("B");

-- AddForeignKey
ALTER TABLE "CanvasNode" ADD CONSTRAINT "CanvasNode_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageLabels" ADD CONSTRAINT "_ImageLabels_A_fkey" FOREIGN KEY ("A") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImageLabels" ADD CONSTRAINT "_ImageLabels_B_fkey" FOREIGN KEY ("B") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;
