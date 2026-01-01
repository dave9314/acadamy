// Debug script to test registration API directly
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function debugRegistrationAPI() {
  console.log('🔍 Debug Registration API\n')
  
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    console.log('✅ Database connected')

    // Test 1: Check departments
    console.log('\n📋 Available Departments:')
    const departments = await prisma.department.findMany()
    if (departments.length === 0) {
      console.log('❌ No departments found!')
      console.log('Run: node registration-fix-complete.js')
      return
    }
    
    departments.forEach((dept, index) => {
      console.log(`${index + 1}. ${dept.name} (ID: ${dept.id})`)
    })

    // Test 2: Simulate registration data
    const testData = {
      email: `debug_${Date.now()}@test.com`,
      password: 'testpass123',
      name: 'Debug Test User',
      phone: '+1234567890',
      telegramUsername: 'debuguser',
      whatsappNumber: '+1234567890',
      departmentId: departments[0].id,
      paymentMethod: 'CBE'
    }

    console.log('\n📝 Test Registration Data:')
    console.log(JSON.stringify(testData, null, 2))

    // Test 3: Validate required fields
    console.log('\n✅ Field Validation:')
    console.log(`Email: ${testData.email ? '✅' : '❌'}`)
    console.log(`Password: ${testData.password ? '✅' : '❌'}`)
    console.log(`Name: ${testData.name ? '✅' : '❌'}`)
    console.log(`Phone: ${testData.phone ? '✅' : '❌'}`)
    console.log(`Department: ${testData.departmentId ? '✅' : '❌'}`)
    
    // Contact method validation
    const hasValidTelegram = testData.telegramUsername && testData.telegramUsername.length >= 3
    const hasValidWhatsApp = testData.whatsappNumber && testData.whatsappNumber.length >= 8
    console.log(`Contact Methods: ${hasValidTelegram || hasValidWhatsApp ? '✅' : '❌'}`)

    // Test 4: Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testData.email }
    })
    console.log(`User Exists: ${existingUser ? '❌ Already exists' : '✅ New user'}`)

    // Test 5: Verify department exists
    const department = await prisma.department.findUnique({
      where: { id: testData.departmentId }
    })
    console.log(`Department Valid: ${department ? '✅' : '❌'}`)

    // Test 6: Try creating user
    if (!existingUser && department) {
      console.log('\n👤 Creating test user...')
      
      const hashedPassword = await bcrypt.hash(testData.password, 12)
      
      const user = await prisma.user.create({
        data: {
          email: testData.email,
          password: hashedPassword,
          name: testData.name,
          phone: testData.phone,
          telegramUsername: testData.telegramUsername || null,
          whatsappNumber: testData.whatsappNumber || null,
          departmentId: testData.departmentId,
          isApproved: false,
          registrationFee: false,
          paymentMethod: testData.paymentMethod || null,
          paymentScreenshot: null,
          paymentApproved: false
        },
        include: {
          department: true
        }
      })

      console.log('✅ User created successfully!')
      console.log(`   ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Department: ${user.department?.name}`)

      // Clean up
      await prisma.user.delete({ where: { id: user.id } })
      console.log('🧹 Test user cleaned up')
    }

    console.log('\n🎉 Registration API debug completed!')
    console.log('\nIf registration still fails:')
    console.log('1. Check browser network tab for API errors')
    console.log('2. Check server console for detailed error logs')
    console.log('3. Verify all form fields are filled correctly')
    console.log('4. Make sure file upload (if any) is under 5MB and is an image')

  } catch (error) {
    console.error('❌ Debug failed:', error)
    console.log('\nCommon issues:')
    console.log('- Database connection problems')
    console.log('- Missing environment variables')
    console.log('- Prisma schema not synced')
  } finally {
    await prisma.$disconnect()
  }
}

debugRegistrationAPI()