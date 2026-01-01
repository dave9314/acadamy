const { PrismaClient } = require('@prisma/client')

async function testReportsAPI() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing database connection...')
    
    // Test if Report model exists
    const reportCount = await prisma.report.count()
    console.log(`✅ Report model exists. Current count: ${reportCount}`)
    
    // Test creating a report
    const testReport = await prisma.report.create({
      data: {
        title: 'Test Report',
        description: 'This is a test report',
        reporterName: 'Test User',
        reporterEmail: 'test@example.com',
        status: 'PENDING'
      }
    })
    
    console.log('✅ Test report created:', testReport.id)
    
    // Clean up test report
    await prisma.report.delete({
      where: { id: testReport.id }
    })
    
    console.log('✅ Test report cleaned up')
    console.log('✅ Reports API should work correctly!')
    
  } catch (error) {
    console.error('❌ Error testing reports API:', error.message)
    
    if (error.code === 'P2021') {
      console.log('💡 The Report table does not exist. You need to run database migrations.')
      console.log('💡 Run: npx prisma db push')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testReportsAPI()