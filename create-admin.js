const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🔍 Checking for existing admin...')
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@assignmentpro.com' }
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists!')
      console.log('Email: admin@assignmentpro.com')
      console.log('Password: admin123')
      return
    }
    
    console.log('👤 Creating admin user...')
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@assignmentpro.com',
        name: 'System Administrator',
        password: hashedPassword
      }
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('Email: admin@assignmentpro.com')
    console.log('Password: admin123')
    
    // Also create some departments if they don't exist
    console.log('📚 Creating departments...')
    
    const departments = [
      { name: 'Computer Science', serviceFee: 500 },
      { name: 'Mathematics', serviceFee: 400 },
      { name: 'Physics', serviceFee: 450 },
      { name: 'Chemistry', serviceFee: 400 },
      { name: 'Biology', serviceFee: 350 }
    ]
    
    for (const dept of departments) {
      await prisma.department.upsert({
        where: { name: dept.name },
        update: {},
        create: dept
      })
    }
    
    console.log('✅ Departments created!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()