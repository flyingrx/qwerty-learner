-- CreateTable
CREATE TABLE "WordRecord" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "timeStamp" INTEGER NOT NULL,
    "dict" TEXT NOT NULL,
    "chapter" INTEGER,
    "timing" INTEGER[],
    "wrongCount" INTEGER NOT NULL,
    "mistakes" JSONB NOT NULL,

    CONSTRAINT "WordRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterRecord" (
    "id" SERIAL NOT NULL,
    "dict" TEXT NOT NULL,
    "chapter" INTEGER,
    "timeStamp" INTEGER NOT NULL,
    "time" INTEGER NOT NULL,
    "correctCount" INTEGER NOT NULL,
    "wrongCount" INTEGER NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "correctWordIndexes" INTEGER[],
    "wordNumber" INTEGER NOT NULL,

    CONSTRAINT "ChapterRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewRecord" (
    "id" SERIAL NOT NULL,
    "dict" TEXT NOT NULL,
    "index" INTEGER NOT NULL DEFAULT 0,
    "createTime" INTEGER NOT NULL,
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "words" JSONB NOT NULL,

    CONSTRAINT "ReviewRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevisionDictRecord" (
    "id" SERIAL NOT NULL,
    "dict" TEXT NOT NULL,
    "revisionIndex" INTEGER NOT NULL,
    "createdTime" INTEGER NOT NULL,

    CONSTRAINT "RevisionDictRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevisionWordRecord" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "timeStamp" INTEGER NOT NULL,
    "dict" TEXT NOT NULL,
    "errorCount" INTEGER NOT NULL,

    CONSTRAINT "RevisionWordRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChapterRecordToWordRecord" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChapterRecordToWordRecord_AB_unique" ON "_ChapterRecordToWordRecord"("A", "B");

-- CreateIndex
CREATE INDEX "_ChapterRecordToWordRecord_B_index" ON "_ChapterRecordToWordRecord"("B");

-- AddForeignKey
ALTER TABLE "_ChapterRecordToWordRecord" ADD CONSTRAINT "_ChapterRecordToWordRecord_A_fkey" FOREIGN KEY ("A") REFERENCES "ChapterRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChapterRecordToWordRecord" ADD CONSTRAINT "_ChapterRecordToWordRecord_B_fkey" FOREIGN KEY ("B") REFERENCES "WordRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
