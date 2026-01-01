const { PrismaClient } = require('@prisma/client')

async function updateDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Updating database schema...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Check if new tables exist by trying to count records
    try {
      const reportCount = await prisma.report.count()
      console.log(`✅ Report table exists with ${reportCount} records`)
    } catch (error) {
      console.log('❌ Report table does not exist')
      throw new Error('Database schema needs to be updated')
    }
    
    try {
      const announcementCount = await prisma.announcement.count()
      console.log(`✅ Announcement table exists with ${announcementCount} records`)
    } catch (error) {
      console.log('❌ Announcement table does not exist')
      throw new Error('Database schema needs to be updated')
    }
    
    try {
      const userAnnouncementCount = await prisma.userAnnouncement.count()
      console.log(`✅ UserAnnouncement table exists with ${userAnnouncementCount} records`)
    } catch (error) {
      console.log('❌ UserAnnouncement table does not exist')
      throw new Error('Database schema needs to be updated')
    }
    
    // Check if User table has new columns
    const sampleUser = await prisma.user.findFirst({
      select: {
        id: true,
        balance: true,
        totalEarnings: true
      }
    })
    
    if (sampleUser) {
      console.log('✅ User table has balance and totalEarnings columns')
    }
    
    // Check if Assignment table has new columns
    const sampleAssignment = await prisma.assignment.findFirst({
      select: {
        id: true,
        aiDetectionScreenshot: true
      }
    })
    
    if (sampleAssignment !== undefined) {
      console.log('✅ Assignment table has aiDetectionScreenshot column')
    }
    
    console.log('🎉 Database schema is up to date!')
    console.log('🚀 All new features should work correctly now!')
    
  } catch (error) {
    console.error('❌ Database update failed:', error.message)
    console.log('\n📋 To fix this issue, run the following commands:')
    console.log('1. npx prisma db push')
    console.log('2. npm run db:generate')
    console.log('3. npm run db:seed')
    console.log('\nThis will update your database schema with all the new features.')
  } finally {
    await prisma.$disconnect()
  }
}

updateDatabase()