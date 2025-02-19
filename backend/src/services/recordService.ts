import type { Word } from '../types'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class RecordService {
  // Word Record Operations
  async createWordRecord(
    word: string,
    dict: string,
    chapter: number | null,
    timing: number[],
    wrongCount: number,
    mistakes: { [key: number]: string[] },
  ) {
    return prisma.wordRecord.create({
      data: {
        word,
        timeStamp: Math.floor(Date.now() / 1000),
        dict,
        chapter,
        timing,
        wrongCount,
        mistakes: mistakes,
      },
    })
  }

  async deleteWordRecord(word: string, dict: string) {
    const deletedRecord = await prisma.wordRecord.deleteMany({
      where: {
        word,
        dict,
      },
    })
    return deletedRecord.count > 0
  }

  async getWordRecords(dict: string, chapter: number | null) {
    return prisma.wordRecord.findMany({
      where: {
        dict,
        chapter,
      },
      orderBy: {
        timeStamp: 'desc',
      },
    })
  }

  // Chapter Record Operations
  async createChapterRecord(
    dict: string,
    chapter: number | null,
    time: number,
    correctCount: number,
    wrongCount: number,
    wordCount: number,
    correctWordIndexes: number[],
    wordNumber: number,
    wordRecordIds: number[],
  ) {
    return prisma.chapterRecord.create({
      data: {
        dict,
        chapter,
        timeStamp: Math.floor(Date.now() / 1000),
        time,
        correctCount,
        wrongCount,
        wordCount,
        correctWordIndexes,
        wordNumber,
        wordRecords: {
          connect: wordRecordIds.map((id) => ({ id })),
        },
      },
    })
  }

  async getChapterRecords(dict: string, chapter: number | null) {
    return prisma.chapterRecord.findMany({
      where: {
        dict,
        chapter,
      },
      include: {
        wordRecords: true,
      },
      orderBy: {
        timeStamp: 'desc',
      },
    })
  }

  // Review Record Operations
  async createReviewRecord(dict: string, words: Word[]) {
    return prisma.reviewRecord.create({
      data: {
        dict,
        createTime: Math.floor(Date.now() / 1000),
        words: JSON.stringify(words),
      },
    })
  }

  async updateReviewRecord(id: number, index: number, isFinished: boolean) {
    return prisma.reviewRecord.update({
      where: { id },
      data: {
        index,
        isFinished,
      },
    })
  }

  async getReviewRecords(dict: string) {
    return prisma.reviewRecord.findMany({
      where: {
        dict,
      },
      orderBy: {
        createTime: 'desc',
      },
    })
  }

  // Revision Dict Record Operations
  async createRevisionDictRecord(dict: string, revisionIndex: number) {
    return prisma.revisionDictRecord.create({
      data: {
        dict,
        revisionIndex,
        createdTime: Math.floor(Date.now() / 1000),
      },
    })
  }

  async getRevisionDictRecords(dict: string) {
    return prisma.revisionDictRecord.findMany({
      where: {
        dict,
      },
      orderBy: {
        createdTime: 'desc',
      },
    })
  }

  // Revision Word Record Operations
  async createRevisionWordRecord(word: string, dict: string, errorCount: number) {
    return prisma.revisionWordRecord.create({
      data: {
        word,
        timeStamp: Math.floor(Date.now() / 1000),
        dict,
        errorCount,
      },
    })
  }

  async getRevisionWordRecords(dict: string) {
    return prisma.revisionWordRecord.findMany({
      where: {
        dict,
      },
      orderBy: {
        timeStamp: 'desc',
      },
    })
  }
}
