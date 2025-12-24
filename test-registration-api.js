const fs = require('fs')

console.log('🧪 Testing Registration API Directly...\n')

// Simulate a registration request
async function testRegistration() {
  try {
    // First, let's check if we can connect to the database
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()
    
    console.log('📊 Checking database...')
    
    // Check if departments exist
    const departments = await prisma.department.findMany()
    console.log(`✅ Found ${departments.length} departments`)
    
    if (departments.length === 0) {
      console.log('⚠️  No departments found, creating sample department...')
      await prisma.department.create({
        data: {
          name: 'Computer Science',
          description: 'Computer Science and IT related assignments',
          serviceFee: 500
        }
      })
      console.log('✅ Sample department created')
    }
    
    // List available departments
    const allDepts = await prisma.department.findMany()
    console.log('\n📋 Available departments:')
    allDepts.forEach(dept => {
      console.log(`   - ${dept.name} (ID: ${dept.id})`)
    })
    
    await prisma.$disconnect()
    
    console.log('\n✅ Database is ready for registration!')
    console.log('\n🔧 If registration still fails:')
    console.log('1. Check browser console (F12) for error details')
    console.log('2. Check server terminal for error logs')
    console.log('3. Make sure you fill all required fields:')
    console.log('   - Name, Email, Password, Phone')
    console.log('   - Either Telegram OR WhatsApp')
    console.log('   - Department selection')
    console.log('   - Payment method (CBE or Telebirr)')
    console.log('   - Payment screenshot upload')
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    console.log('\n💡 Possible solutions:')
    console.log('1. Check DATABASE_URL in .env file')
    console.log('2. Make sure database is running')
    console.log('3. Run: npx prisma db push')
  }
}

testRegistration()