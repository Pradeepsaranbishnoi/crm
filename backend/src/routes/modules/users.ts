import { Router } from 'express'
import { prisma } from '../../prisma'
import { z } from 'zod'
import { requireAuth, requireRoles } from '../../middleware/auth'

const router = Router()

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['ADMIN', 'MANAGER', 'SALES_REP']).default('SALES_REP'),
  password: z.string().min(6),
  avatar: z.string().url().optional(),
})

router.get('/', requireAuth, requireRoles(['admin','manager']), async (_req, res) => {
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } })
  res.json(users.map(({ password, ...u }) => u))
})

router.get('/:id', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } })
  if (!user) return res.status(404).json({ error: 'Not found' })
  const { password, ...u } = user
  res.json(u)
})

router.post('/', requireAuth, requireRoles(['admin']), async (req, res) => {
  const parsed = CreateUserSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.format() })
  const data = parsed.data
  const hashed = await (await import('bcryptjs')).default.hash(data.password, 10)
  const created = await prisma.user.create({ data: { ...data, password: hashed } })
  const { password, ...u } = created
  res.status(201).json(u)
})

router.patch('/:id', requireAuth, requireRoles(['admin','manager']), async (req, res) => {
  const updated = await prisma.user.update({ where: { id: req.params.id }, data: req.body })
  const { password, ...u } = updated
  res.json(u)
})

router.delete('/:id', requireAuth, requireRoles(['admin']), async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } })
  res.status(204).end()
})

export default router


