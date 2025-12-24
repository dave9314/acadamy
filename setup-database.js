
const { PrismaClient } = require('@prisma/client')

async function setupDatabase() {
  console.log('🗄️ Setting up database...')
  
  try {
    const prisma = new PrismaClient()
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Create admin if not exists
    const adminExists = await prisma.admin.findFirst()
    if (!adminExists) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      await prisma.admin.create({
        data: {
          email: 'admin@assignmentpro.com',
          name: 'Admin',
          password: hashedPassword
        }
      })
      console.log('✅ Admin user created')
      console.log('   Email: admin@assignmentpro.com')
      console.log('   Password: admin123')
    }
    
    // Create sample department if not exists
    const deptExists = await prisma.department.findFirst()
    if (!deptExists) {
      await prisma.department.create({
        data: {
          name: 'Computer Science',
          description: 'Computer Science and IT related assignments',
          serviceFee: 500
        }
      })
      console.log('✅ Sample department created')
    }
    
    await prisma.$disconnect()
    console.log('🎉 Database setup complete!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.log('💡 Make sure your DATABASE_URL is correct in .env file')
  }
}

setupDatabase()
