import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash('password', 10)

  const [admin, manager, sales] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@crm.com' },
      update: {},
      create: { email: 'admin@crm.com', name: 'Sarah Johnson', role: Role.ADMIN, password, avatar: '/professional-woman-diverse.png' },
    }),
    prisma.user.upsert({
      where: { email: 'manager@crm.com' },
      update: {},
      create: { email: 'manager@crm.com', name: 'Mike Chen', role: Role.MANAGER, password, avatar: '/professional-man.jpg' },
    }),
    prisma.user.upsert({
      where: { email: 'sales@crm.com' },
      update: {},
      create: { email: 'sales@crm.com', name: 'Emily Rodriguez', role: Role.SALES_REP, password, avatar: '/confident-saleswoman.png' },
    }),
  ])

  await prisma.lead.createMany({
    data: [
      { name: 'John Smith', email: 'john@techcorp.com', phone: '+1-555-0123', company: 'TechCorp Inc.', status: 'QUALIFIED', priority: 'HIGH', value: 50000, source: 'WEBSITE', assignedTo: sales.id, createdBy: manager.id },
      { name: 'Lisa Wang', email: 'lisa@startup.io', phone: '+1-555-0124', company: 'Startup.io', status: 'NEW', priority: 'MEDIUM', value: 25000, source: 'REFERRAL', assignedTo: sales.id, createdBy: manager.id },
      { name: 'David Brown', email: 'david@enterprise.com', phone: '+1-555-0125', company: 'Enterprise Solutions', status: 'PROPOSAL', priority: 'HIGH', value: 100000, source: 'COLD_CALL', assignedTo: sales.id, createdBy: admin.id },
    ],
    skipDuplicates: true,
  })
}

main().finally(async () => {
  await prisma.$disconnect()
})


