import { Router } from 'express'
import { prisma } from '../../prisma'
import { z } from 'zod'
import { emitRealtime } from '../../index'
import { requireAuth } from '../../middleware/auth'

const router = Router()

const LeadCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(['NEW','CONTACTED','QUALIFIED','PROPOSAL','NEGOTIATION','CLOSED_WON','CLOSED_LOST']).optional(),
  priority: z.enum(['LOW','MEDIUM','HIGH']).optional(),
  value: z.number().int().optional(),
  source: z.enum(['WEBSITE','REFERRAL','COLD_CALL','EMAIL','SOCIAL','OTHER']).optional(),
  assignedTo: z.string().optional(),
  createdBy: z.string(),
})

router.get('/', requireAuth, async (req, res) => {
  const { status, priority, assignedTo, search } = req.query
  const leads = await prisma.lead.findMany({
    where: {
      status: status ? String(status).toUpperCase() as any : undefined,
      priority: priority ? String(priority).toUpperCase() as any : undefined,
      assignedTo: assignedTo ? String(assignedTo) : undefined,
      OR: search
        ? [
            { name: { contains: String(search), mode: 'insensitive' } },
            { email: { contains: String(search), mode: 'insensitive' } },
            { company: { contains: String(search), mode: 'insensitive' } },
          ]
        : undefined,
    },
    orderBy: { updatedAt: 'desc' },
  })
  res.json(leads)
})

router.get('/:id', requireAuth, async (req, res) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } })
  if (!lead) return res.status(404).json({ error: 'Not found' })
  res.json(lead)
})

router.post('/', requireAuth, async (req, res) => {
  const parsed = LeadCreateSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() })
  const lead = await prisma.lead.create({ data: parsed.data })
  emitRealtime('lead_created', lead)
  res.status(201).json(lead)
})

router.patch('/:id', requireAuth, async (req, res) => {
  const lead = await prisma.lead.update({ where: { id: req.params.id }, data: req.body })
  emitRealtime('lead_updated', { leadId: lead.id, data: lead })
  res.json(lead)
})

router.delete('/:id', requireAuth, async (req, res) => {
  await prisma.lead.delete({ where: { id: req.params.id } })
  emitRealtime('lead_deleted', { id: req.params.id })
  res.status(204).end()
})

export default router


