import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { name: 'Computer Science' },
      update: {},
      create: {
        name: 'Computer Science',
        description: 'Programming, algorithms, software development',
        serviceFee: 500
      }
    }),
    prisma.department.upsert({
      where: { name: 'Mathematics' },
      update: {},
      create: {
        name: 'Mathematics',
        description: 'Calculus, algebra, statistics',
        serviceFee: 400
      }
    }),
    prisma.department.upsert({
      where: { name: 'Physics' },
      update: {},
      create: {
        name: 'Physics',
        description: 'Mechanics, thermodynamics, quantum physics',
        serviceFee: 450
      }
    }),
    prisma.department.upsert({
      where: { name: 'Chemistry' },
      update: {},
      create: {
        name: 'Chemistry',
        description: 'Organic, inorganic, analytical chemistry',
        serviceFee: 400
      }
    }),
    prisma.department.upsert({
      where: { name: 'Biology' },
      update: {},
      create: {
        name: 'Biology',
        description: 'Molecular biology, genetics, ecology',
        serviceFee: 350
      }
    })
  ])

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@assignmentpro.com' },
    update: {},
    create: {
      email: 'admin@assignmentpro.com',
      name: 'System Administrator',
      password: hashedAdminPassword
    }
  })

  // Create sample assignment makers
  const hashedUserPassword = await bcrypt.hash('maker123', 12)
  
  const makers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.cs@example.com' },
      update: {},
      create: {
        email: 'john.cs@example.com',
        name: 'John Smith',
        phone: '+251911234567',
        telegramUsername: 'johnsmith_cs',
        whatsappNumber: '+251911234567',
        password: hashedUserPassword,
        isApproved: true,
        registrationFee: true,
        departmentId: departments[0].id // Computer Science
      }
    }),
    prisma.user.upsert({
      where: { email: 'sarah.math@example.com' },
      update: {},
      create: {
        email: 'sarah.math@example.com',
        name: 'Sarah Johnson',
        phone: '+251922345678',
        telegramUsername: 'sarah_math',
        whatsappNumber: '+251922345678',
        password: hashedUserPassword,
        isApproved: true,
        registrationFee: true,
        departmentId: departments[1].id // Mathematics
      }
    }),
    prisma.user.upsert({
      where: { email: 'mike.physics@example.com' },
      update: {},
      create: {
        email: 'mike.physics@example.com',
        name: 'Michael Brown',
        phone: '+251933456789',
        telegramUsername: 'mike_physics',
        whatsappNumber: '+251933456789',
        password: hashedUserPassword,
        isApproved: true,
        registrationFee: true,
        departmentId: departments[2].id // Physics
      }
    })
  ])

  console.log('Database seeded successfully!')
  console.log('Admin credentials: admin@assignmentpro.com / admin123')
  console.log('Sample maker credentials: john.cs@example.com / maker123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })