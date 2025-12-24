const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createSampleMakers() {
  try {
    console.log('👥 Creating sample assignment makers...\n')
    
    // Get departments
    const departments = await prisma.department.findMany()
    
    if (departments.length === 0) {
      console.log('❌ No departments found! Creating departments first...')
      
      const deptData = [
        { name: 'Computer Science', serviceFee: 500 },
        { name: 'Mathematics', serviceFee: 400 },
        { name: 'Physics', serviceFee: 450 },
        { name: 'Chemistry', serviceFee: 400 },
        { name: 'Biology', serviceFee: 350 }
      ]
      
      for (const dept of deptData) {
        await prisma.department.upsert({
          where: { name: dept.name },
          update: {},
          create: dept
        })
      }
      
      console.log('✅ Departments created!')
      
      // Refresh departments
      const newDepartments = await prisma.department.findMany()
      departments.push(...newDepartments)
    }
    
    const hashedPassword = await bcrypt.hash('maker123', 12)
    
    const sampleMakers = [
      {
        email: 'john.cs@example.com',
        name: 'John Smith',
        phone: '+251911234567',
        telegramUsername: 'johnsmith_cs',
        whatsappNumber: '+251911234567',
        password: hashedPassword,
        isApproved: true,
        registrationFee: true,
        departmentId: departments.find(d => d.name === 'Computer Science')?.id
      },
      {
        email: 'sarah.math@example.com',
        name: 'Sarah Johnson',
        phone: '+251922345678',
        telegramUsername: 'sarah_math',
        whatsappNumber: '+251922345678',
        password: hashedPassword,
        isApproved: true,
        registrationFee: true,
        departmentId: departments.find(d => d.name === 'Mathematics')?.id
      },
      {
        email: 'mike.physics@example.com',
        name: 'Michael Brown',
        phone: '+251933456789',
        telegramUsername: 'mike_physics',
        whatsappNumber: '+251933456789',
        password: hashedPassword,
        isApproved: true,
        registrationFee: true,
        departmentId: departments.find(d => d.name === 'Physics')?.id
      },
      {
        email: 'emma.chem@example.com',
        name: 'Emma Wilson',
        phone: '+251944567890',
        telegramUsername: 'emma_chem',
        whatsappNumber: '+251944567890',
        password: hashedPassword,
        isApproved: true,
        registrationFee: true,
        departmentId: departments.find(d => d.name === 'Chemistry')?.id
      },
      {
        email: 'david.bio@example.com',
        name: 'David Miller',
        phone: '+251955678901',
        telegramUsername: 'david_bio',
        whatsappNumber: '+251955678901',
        password: hashedPassword,
        isApproved: true,
        registrationFee: true,
        departmentId: departments.find(d => d.name === 'Biology')?.id
      }
    ]
    
    for (const maker of sampleMakers) {
      if (!maker.departmentId) continue
      
      const existingUser = await prisma.user.findUnique({
        where: { email: maker.email }
      })
      
      if (existingUser) {
        console.log(`⚠️  User ${maker.email} already exists, updating...`)
        await prisma.user.update({
          where: { email: maker.email },
          data: {
            isApproved: true,
            registrationFee: true
          }
        })
      } else {
        await prisma.user.create({ data: maker })
        console.log(`✅ Created maker: ${maker.name} (${maker.email})`)
      }
    }
    
    console.log('\n🎉 Sample assignment makers created successfully!')
    console.log('\n📋 Login credentials for testing:')
    console.log('Email: john.cs@example.com | Password: maker123')
    console.log('Email: sarah.math@example.com | Password: maker123')
    console.log('Email: mike.physics@example.com | Password: maker123')
    console.log('Email: emma.chem@example.com | Password: maker123')
    console.log('Email: david.bio@example.com | Password: maker123')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleMakers()