// import type { IChapterRecord, IReviewRecord, IRevisionDictRecord, IWordRecord, LetterMistakes } from './record'
// import { ChapterRecord, ReviewRecord, WordRecord } from './record'
import { TypingContext, TypingStateActionType } from '@/pages/Typing/store'
import type { TypingState } from '@/pages/Typing/store/type'
import { currentChapterAtom, currentDictIdAtom, isReviewModeAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { useCallback, useContext } from 'react'

const API_BASE_URL = 'http://localhost:3000/api'
interface LetterMistakes {
  // 每个字母被错误输入成什么, index 为字母的索引, 数组内为错误的 e.key
  [index: number]: string[]
}

// API client for making HTTP requests
class RecordAPI {
  // Word Record Methods
  static async createWordRecord(
    word: string,
    dict: string,
    chapter: number | null,
    timing: number[],
    wrongCount: number,
    mistakes: LetterMistakes,
  ) {
    const response = await fetch(`${API_BASE_URL}/word-record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, dict, chapter, timing, wrongCount, mistakes }),
    })
    if (!response.ok) throw new Error('Failed to create word record')
    return response.json()
  }

  static async getWordRecords(dict: string, chapter?: number) {
    const url = chapter !== undefined ? `${API_BASE_URL}/word-records/${dict}/${chapter}` : `${API_BASE_URL}/word-records/${dict}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch word records')
    return response.json()
  }

  // Chapter Record Methods
  static async createChapterRecord(
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
    const response = await fetch(`${API_BASE_URL}/chapter-record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dict,
        chapter,
        time,
        correctCount,
        wrongCount,
        wordCount,
        correctWordIndexes,
        wordNumber,
        wordRecordIds,
      }),
    })
    if (!response.ok) throw new Error('Failed to create chapter record')
    return response.json()
  }

  static async getChapterRecords(dict: string, chapter?: number) {
    const url = chapter !== undefined ? `${API_BASE_URL}/chapter-records/${dict}/${chapter}` : `${API_BASE_URL}/chapter-records/${dict}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Failed to fetch chapter records')
    return response.json()
  }

  // Review Record Methods
  static async createReviewRecord(dict: string, words: string[]) {
    const response = await fetch(`${API_BASE_URL}/review-record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dict, words }),
    })
    if (!response.ok) throw new Error('Failed to create review record')
    return response.json()
  }

  static async updateReviewRecord(id: number, index: number, isFinished: boolean) {
    const response = await fetch(`${API_BASE_URL}/review-record/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index, isFinished }),
    })
    if (!response.ok) throw new Error('Failed to update review record')
    return response.json()
  }

  static async getReviewRecords(dict: string) {
    const response = await fetch(`${API_BASE_URL}/review-records/${dict}`)
    if (!response.ok) throw new Error('Failed to fetch review records')
    return response.json()
  }

  // Revision Dict Record Methods
  static async createRevisionDictRecord(dict: string, revisionIndex: number) {
    const response = await fetch(`${API_BASE_URL}/revision-dict-record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dict, revisionIndex }),
    })
    if (!response.ok) throw new Error('Failed to create revision dict record')
    return response.json()
  }

  static async getRevisionDictRecords(dict: string) {
    const response = await fetch(`${API_BASE_URL}/revision-dict-records/${dict}`)
    if (!response.ok) throw new Error('Failed to fetch revision dict records')
    return response.json()
  }

  // Revision Word Record Methods
  static async createRevisionWordRecord(word: string, dict: string, errorCount: number) {
    const response = await fetch(`${API_BASE_URL}/revision-word-record`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, dict, errorCount }),
    })
    if (!response.ok) throw new Error('Failed to create revision word record')
    return response.json()
  }

  static async getRevisionWordRecords(dict: string) {
    const response = await fetch(`${API_BASE_URL}/revision-word-records/${dict}`)
    if (!response.ok) throw new Error('Failed to fetch revision word records')
    return response.json()
  }
}

// Hook for saving chapter records
export function useSaveChapterRecord() {
  const currentChapter = useAtomValue(currentChapterAtom)
  const isRevision = useAtomValue(isReviewModeAtom)
  const dictID = useAtomValue(currentDictIdAtom)

  const saveChapterRecord = useCallback(
    async (typingState: TypingState) => {
      const {
        chapterData: { correctCount, wrongCount, userInputLogs, wordCount, words, wordRecordIds },
        timerData: { time },
      } = typingState
      const correctWordIndexes = userInputLogs.filter((log) => log.correctCount > 0 && log.wrongCount === 0).map((log) => log.index)

      try {
        await RecordAPI.createChapterRecord(
          dictID,
          isRevision ? -1 : currentChapter,
          time,
          correctCount,
          wrongCount,
          wordCount,
          correctWordIndexes,
          words.length,
          wordRecordIds ?? [],
        )
      } catch (error) {
        console.error('Failed to save chapter record:', error)
      }
    },
    [currentChapter, dictID, isRevision],
  )

  return saveChapterRecord
}

// Hook for saving word records
export function useSaveWordRecord() {
  const isRevision = useAtomValue(isReviewModeAtom)
  const currentChapter = useAtomValue(currentChapterAtom)
  const dictID = useAtomValue(currentDictIdAtom)
  const { dispatch } = useContext(TypingContext) ?? {}

  const saveWordRecord = useCallback(
    async ({
      word,
      wrongCount,
      letterTimeArray,
      letterMistake,
    }: {
      word: string
      wrongCount: number
      letterTimeArray: number[]
      letterMistake: LetterMistakes
    }) => {
      const timing = []
      for (let i = 1; i < letterTimeArray.length; i++) {
        const diff = letterTimeArray[i] - letterTimeArray[i - 1]
        timing.push(diff)
      }

      try {
        const record = await RecordAPI.createWordRecord(word, dictID, isRevision ? -1 : currentChapter, timing, wrongCount, letterMistake)

        if (dispatch) {
          record.id && dispatch({ type: TypingStateActionType.ADD_WORD_RECORD_ID, payload: record.id })
          dispatch({ type: TypingStateActionType.SET_IS_SAVING_RECORD, payload: false })
        }
      } catch (error) {
        console.error('Failed to save word record:', error)
        if (dispatch) {
          dispatch({ type: TypingStateActionType.SET_IS_SAVING_RECORD, payload: false })
        }
      }
    },
    [currentChapter, dictID, dispatch, isRevision],
  )

  return saveWordRecord
}

// Hook for deleting word records
export function useDeleteWordRecord() {
  const deleteWordRecord = useCallback(async (word: string, dict: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/word-record`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, dict }),
      })
      if (!response.ok) throw new Error('Failed to delete word record')
      return response.json()
    } catch (error) {
      console.error('Failed to delete word record:', error)
    }
  }, [])

  return { deleteWordRecord }
}
