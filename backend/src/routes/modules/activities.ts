import { Router } from 'express'
import { prisma } from '../../prisma'
import { z } from 'zod'
import { emitRealtime } from '../../index'
import { requireAuth } from '../../middleware/auth'

const router = Router()

const ActivityCreateSchema = z.object({
  leadId: z.string(),
  userId: z.string(),
  type: z.enum(['NOTE','CALL','EMAIL','MEETING','TASK']),
  title: z.string().min(1),
  description: z.string().optional(),
  completedAt: z.string().datetime().optional(),
})

router.get('/lead/:leadId', requireAuth, async (req, res) => {
  const items = await prisma.activity.findMany({ where: { leadId: req.params.leadId }, orderBy: { createdAt: 'desc' } })
  const notes = await prisma.note.findMany({ where: { leadId: req.params.leadId }, orderBy: { createdAt: 'desc' } })
  res.json({ activities: items, notes })
})

router.post('/', requireAuth, async (req, res) => {
  const parsed = ActivityCreateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() })
  const created = await prisma.activity.create({ data: { ...parsed.data, completedAt: parsed.data.completedAt ? new Date(parsed.data.completedAt) : null } as any })
  emitRealtime('activity_added', { activityId: created.id, data: created, userId: created.userId })
  res.status(201).json(created)
})

const NoteCreateSchema = z.object({
  leadId: z.string(),
  userId: z.string(),
  content: z.string().min(1),
  isCollaborative: z.boolean().default(false),
})

router.post('/note', requireAuth, async (req, res) => {
  const parsed = NoteCreateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() })
  const created = await prisma.note.create({ data: parsed.data })
  emitRealtime('note_updated', { leadId: created.leadId, userId: created.userId })
  res.status(201).json(created)
})

export default router


