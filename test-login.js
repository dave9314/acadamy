const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function testLogin() {
  try {
    console.log('🔍 Testing admin login...')
    
    // Find admin user
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@assignmentpro.com' }
    })
    
    if (!admin) {
      console.log('❌ Admin user not found!')
      console.log('Run: node create-admin.js first')
      return
    }
    
    console.log('✅ Admin user found:', admin.email)
    
    // Test password
    const isValidPassword = await bcrypt.compare('admin123', admin.password)
    
    if (isValidPassword) {
      console.log('✅ Password is correct!')
      console.log('Login credentials:')
      console.log('Email: admin@assignmentpro.com')
      console.log('Password: admin123')
      console.log('User Type: Admin')
    } else {
      console.log('❌ Password is incorrect!')
    }
    
    // Check database connection
    console.log('🔍 Testing database connection...')
    const adminCount = await prisma.admin.count()
    const userCount = await prisma.user.count()
    const deptCount = await prisma.department.count()
    
    console.log(`📊 Database stats:`)
    console.log(`- Admins: ${adminCount}`)
    console.log(`- Users: ${userCount}`)
    console.log(`- Departments: ${deptCount}`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.log('Make sure your database is running and accessible')
  } finally {
    await prisma.$disconnect()
  }
}

testLogin()