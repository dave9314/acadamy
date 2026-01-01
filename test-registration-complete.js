const { PrismaClient } = require('@prisma/client')

async function testRegistrationSystem() {
  console.log('🧪 Testing Complete Registration System...\n')
  
  const prisma = new PrismaClient()
  
  try {
    // Test 1: Database Connection
    console.log('1️⃣ Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully\n')

    // Test 2: Check if departments exist
    console.log('2️⃣ Testing departments...')
    const departments = await prisma.department.findMany()
    console.log(`✅ Found ${departments.length} departments:`)
    departments.forEach(dept => {
      console.log(`   - ${dept.name} (ID: ${dept.id})`)
    })
    
    if (departments.length === 0) {
      console.log('⚠️ No departments found! Creating sample departments...')
      
      const sampleDepts = [
        { name: 'Computer Science', description: 'Programming and software', serviceFee: 50 },
        { name: 'Mathematics', description: 'Math and statistics', serviceFee: 40 },
        { name: 'Physics', description: 'Physics and engineering', serviceFee: 45 }
      ]
      
      for (const dept of sampleDepts) {
        await prisma.department.create({ data: dept })
        console.log(`   ✅ Created: ${dept.name}`)
      }
    }
    console.log('')

    // Test 3: Test departments API endpoint
    console.log('3️⃣ Testing departments API...')
    try {
      const response = await fetch('http://localhost:3000/api/departments')
      if (response.ok) {
        const apiDepts = await response.json()
        console.log(`✅ Departments API working - returned ${apiDepts.length} departments`)
      } else {
        console.log(`❌ Departments API failed with status: ${response.status}`)
      }
    } catch (apiError) {
      console.log('❌ Departments API test failed - server might not be running')
      console.log('   Make sure to run: npm run dev')
    }
    console.log('')

    // Test 4: Test user creation directly
    console.log('4️⃣ Testing user creation...')
    const testEmail = `test_${Date.now()}@example.com`
    const testDept = departments[0] || await prisma.department.findFirst()
    
    if (testDept) {
      try {
        const testUser = await prisma.user.create({
          data: {
            email: testEmail,
            password: 'hashedpassword123',
            name: 'Test User',
            phone: '+1234567890',
            telegramUsername: 'testuser',
            whatsappNumber: '+1234567890',
            departmentId: testDept.id,
            isApproved: false,
            registrationFee: false,
            paymentApproved: false
          }
        })
        console.log(`✅ User created successfully: ${testUser.email}`)
        
        // Clean up test user
        await prisma.user.delete({ where: { id: testUser.id } })
        console.log('🧹 Test user cleaned up')
      } catch (userError) {
        console.log('❌ User creation failed:', userError.message)
      }
    } else {
      console.log('❌ No departments available for user creation test')
    }
    console.log('')

    // Test 5: Check file upload directory
    console.log('5️⃣ Testing file upload setup...')
    const fs = require('fs')
    const path = require('path')
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
        console.log('✅ Created uploads directory')
      } else {
        console.log('✅ Uploads directory exists')
      }
      
      // Test write permissions
      const testFile = path.join(uploadsDir, 'test.txt')
      fs.writeFileSync(testFile, 'test')
      fs.unlinkSync(testFile)
      console.log('✅ File upload permissions working')
    } catch (fileError) {
      console.log('❌ File upload setup failed:', fileError.message)
    }
    console.log('')

    // Test 6: Registration API test
    console.log('6️⃣ Testing registration API...')
    try {
      const testData = {
        email: `apitest_${Date.now()}@example.com`,
        password: 'testpassword123',
        name: 'API Test User',
        phone: '+1234567890',
        telegramUsername: 'apitestuser',
        whatsappNumber: '+1234567890',
        departmentId: testDept?.id || '',
        paymentMethod: 'CBE'
      }

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      })

      const result = await response.json()
      
      if (response.ok) {
        console.log('✅ Registration API working')
        console.log(`   Message: ${result.message}`)
        
        // Clean up test user
        if (result.user?.id) {
          await prisma.user.delete({ where: { id: result.user.id } })
          console.log('🧹 API test user cleaned up')
        }
      } else {
        console.log(`❌ Registration API failed: ${result.error}`)
      }
    } catch (apiError) {
      console.log('❌ Registration API test failed - server might not be running')
    }

    console.log('\n🎉 Registration system test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if called directly
if (require.main === module) {
  testRegistrationSystem()
}

module.exports = { testRegistrationSystem }