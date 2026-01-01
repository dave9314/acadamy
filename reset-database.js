const { PrismaClient } = require('@prisma/client')

async function resetDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Resetting database...')
    
    // Connect to database
    await prisma.$connect()
    console.log('✅ Connected to database')
    
    // Delete all data in correct order (respecting foreign keys)
    console.log('🗑️ Clearing existing data...')
    
    await prisma.userAnnouncement.deleteMany({})
    await prisma.announcement.deleteMany({})
    await prisma.report.deleteMany({})
    await prisma.aiDetectionReport.deleteMany({})
    await prisma.payment.deleteMany({})
    await prisma.assignment.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.admin.deleteMany({})
    await prisma.department.deleteMany({})
    
    console.log('✅ All data cleared')
    
    // Recreate schema
    console.log('🔄 Pushing new schema...')
    
    console.log('✅ Database reset complete!')
    console.log('📋 Next steps:')
    console.log('1. Run: npm run db:seed')
    console.log('2. Test the application')
    
  } catch (error) {
    console.error('❌ Database reset failed:', error.message)
    console.log('\n📋 Manual reset steps:')
    console.log('1. npx prisma db push --force-reset')
    console.log('2. npm run db:generate')
    console.log('3. npm run db:seed')
  } finally {
    await prisma.$disconnect()
  }
}

resetDatabase()