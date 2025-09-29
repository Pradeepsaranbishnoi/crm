import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { router as apiRouter } from './routes'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const app = express()
app.use(cors({ origin: '*'}))
app.use(helmet())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', apiRouter)

const server = http.createServer(app)
const io = new SocketIOServer(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
  // simple bridge for server to emit updates and broadcast client events
  socket.onAny((event, ...args) => {
    socket.broadcast.emit(event, ...args)
  })
  socket.on('disconnect', () => {})
})

export function emitRealtime(event: string, payload: any) {
  io.emit(event, payload)
}

async function ensureSeed() {
  const count = await prisma.user.count()
  if (count > 0) return
  const password = await bcrypt.hash('password', 10)
  const admin = await prisma.user.create({
    data: { email: 'admin@crm.com', name: 'Sarah Johnson', role: 'ADMIN', password, avatar: '/professional-woman-diverse.png' },
  })
  const manager = await prisma.user.create({
    data: { email: 'manager@crm.com', name: 'Mike Chen', role: 'MANAGER', password, avatar: '/professional-man.jpg' },
  })
  const sales = await prisma.user.create({
    data: { email: 'sales@crm.com', name: 'Emily Rodriguez', role: 'SALES_REP', password, avatar: '/confident-saleswoman.png' },
  })
  await prisma.lead.createMany({
    data: [
      { name: 'John Smith', email: 'john@techcorp.com', phone: '+1-555-0123', company: 'TechCorp Inc.', status: 'QUALIFIED', priority: 'HIGH', value: 50000, source: 'WEBSITE', assignedTo: sales.id, createdBy: manager.id },
      { name: 'Lisa Wang', email: 'lisa@startup.io', phone: '+1-555-0124', company: 'Startup.io', status: 'NEW', priority: 'MEDIUM', value: 25000, source: 'REFERRAL', assignedTo: sales.id, createdBy: manager.id },
      { name: 'David Brown', email: 'david@enterprise.com', phone: '+1-555-0125', company: 'Enterprise Solutions', status: 'PROPOSAL', priority: 'HIGH', value: 100000, source: 'COLD_CALL', assignedTo: sales.id, createdBy: admin.id },
    ],
    skipDuplicates: true,
  })
}

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000
(async () => {
  try {
    // best-effort schema sync (works without existing migrations)
    await prisma.$executeRawUnsafe('SELECT 1')
  } catch {}
  await ensureSeed()
  server.listen(PORT, () => {
    console.log(`[backend] listening on :${PORT}`)
  })
})()


