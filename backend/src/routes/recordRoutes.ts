import express, { Request, Response } from 'express'
import { RecordService } from '../services/recordService'

const router = express.Router()
const recordService = new RecordService()

// Word Record Routes
router.post('/word-record', async (req: Request, res: Response) => {
  try {
    const { word, dict, chapter, timing, wrongCount, mistakes } = req.body
    const record = await recordService.createWordRecord(word, dict, chapter, timing, wrongCount, mistakes)
    res.json(record)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create word record' })
  }
})

router.delete('/word-record', async (req: Request, res: Response) => {
  try {
    const { word, dict } = req.body
    const success = await recordService.deleteWordRecord(word, dict)
    res.json({ success })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete word record' })
  }
})

router.get('/word-records/:dict/:chapter?', async (req: Request, res: Response) => {
  try {
    const { dict, chapter } = req.params
    const records = await recordService.getWordRecords(dict, chapter ? parseInt(chapter) : null)
    res.json(records)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch word records' })
  }
})

// Chapter Record Routes
router.post('/chapter-record', async (req: Request, res: Response) => {
  try {
    const {
      dict,
      chapter,
      time,
      correctCount,
      wrongCount,
      wordCount,
      correctWordIndexes,
      wordNumber,
      wordRecordIds,
    } = req.body
    const record = await recordService.createChapterRecord(
      dict,
      chapter,
      time,
      correctCount,
      wrongCount,
      wordCount,
      correctWordIndexes,
      wordNumber,
      wordRecordIds
    )
    res.json(record)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chapter record' })
  }
})

router.get('/chapter-records/:dict/:chapter?', async (req: Request, res: Response) => {
  try {
    const { dict, chapter } = req.params
    const records = await recordService.getChapterRecords(dict, chapter ? parseInt(chapter) : null)
    res.json(records)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chapter records' })
  }
})

// Review Record Routes
router.post('/review-record', async (req: Request, res: Response) => {
  try {
    const { dict, words } = req.body
    const record = await recordService.createReviewRecord(dict, words)
    res.json(record)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review record' })
  }
})

router.put('/review-record/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { index, isFinished } = req.body
    const record = await recordService.updateReviewRecord(parseInt(id), index, isFinished)
    res.json(record)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review record' })
  }
})

router.get('/review-records/:dict', async (req: Request, res: Response) => {
  try {
    const { dict } = req.params
    const records = await recordService.getReviewRecords(dict)
    res.json(records)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review records' })
  }
})

// Revision Dict Record Routes
router.post('/revision-dict-record', async (req: Request, res: Response) => {
  try {
    const { dict, revisionIndex } = req.body
    const record = await recordService.createRevisionDictRecord(dict, revisionIndex)
    res.json(record)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create revision dict record' })
  }
})

router.get('/revision-dict-records/:dict', async (req: Request, res: Response) => {
  try {
    const { dict } = req.params
    const records = await recordService.getRevisionDictRecords(dict)
    res.json(records)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revision dict records' })
  }
})

// Revision Word Record Routes
router.post('/revision-word-record', async (req: Request, res: Response) => {
  try {
    const { word, dict, errorCount } = req.body
    const record = await recordService.createRevisionWordRecord(word, dict, errorCount)
    res.json(record)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create revision word record' })
  }
})

router.get('/revision-word-records/:dict', async (req: Request, res: Response) => {
  try {
    const { dict } = req.params
    const records = await recordService.getRevisionWordRecords(dict)
    res.json(records)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revision word records' })
  }
})

export default router
