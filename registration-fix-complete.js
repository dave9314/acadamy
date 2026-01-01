const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

async function completeRegistrationFix() {
  console.log('🚀 Complete Registration System Fix\n')
  
  const prisma = new PrismaClient()
  
  try {
    // Step 1: Database connection and schema
    console.log('1️⃣ Checking database and schema...')
    await prisma.$connect()
    
    // Test all required models
    try {
      await prisma.user.findFirst()
      await prisma.admin.findFirst()
      await prisma.department.findFirst()
      console.log('✅ Database schema is correct')
    } catch (schemaError) {
      console.log('❌ Database schema issue. Run these commands:')
      console.log('   npx prisma db push')
      console.log('   npx prisma generate')
      return
    }

    // Step 2: Create essential departments
    console.log('\n2️⃣ Setting up departments...')
    const existingDepts = await prisma.department.findMany()
    
    if (existingDepts.length === 0) {
      const departments = [
        { name: 'Computer Science', description: 'Programming and Software', serviceFee: 50 },
        { name: 'Mathematics', description: 'Math and Statistics', serviceFee: 40 },
        { name: 'Physics', description: 'Physics and Engineering', serviceFee: 45 },
        { name: 'Chemistry', description: 'Chemistry and Lab Work', serviceFee: 45 },
        { name: 'Biology', description: 'Biology and Life Sciences', serviceFee: 40 },
        { name: 'Business', description: 'Business and Economics', serviceFee: 35 },
        { name: 'English', description: 'English and Literature', serviceFee: 30 },
        { name: 'Engineering', description: 'Engineering Projects', serviceFee: 55 }
      ]
      
      for (const dept of departments) {
        await prisma.department.create({ data: dept })
        console.log(`   ✅ Created: ${dept.name}`)
      }
    } else {
      console.log(`✅ Found ${existingDepts.length} departments`)
    }

    // Step 3: Create admin user
    console.log('\n3️⃣ Setting up admin user...')
    const adminCount = await prisma.admin.count()
    
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12)
      await prisma.admin.create({
        data: {
          email: 'admin@platform.com',
          name: 'Platform Admin',
          password: hashedPassword
        }
      })
      console.log('✅ Created admin user:')
      console.log('   📧 Email: admin@platform.com')
      console.log('   🔑 Password: admin123')
      console.log('   ⚠️ Change password after first login!')
    } else {
      console.log(`✅ Found ${adminCount} admin user(s)`)
    }

    // Step 4: Setup file upload directory
    console.log('\n4️⃣ Setting up file uploads...')
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
      console.log('✅ Created uploads directory')
    }
    
    // Test file permissions
    try {
      const testFile = path.join(uploadsDir, 'test.txt')
      fs.writeFileSync(testFile, 'test')
      fs.unlinkSync(testFile)
      console.log('✅ File upload permissions working')
    } catch (permError) {
      console.log('❌ File permission issue:', permError.message)
    }

    // Step 5: Test registration flow
    console.log('\n5️⃣ Testing registration flow...')
    const testEmail = `test_${Date.now()}@example.com`
    const firstDept = await prisma.department.findFirst()
    
    if (firstDept) {
      try {
        // Test user creation
        const testUser = await prisma.user.create({
          data: {
            email: testEmail,
            password: await bcrypt.hash('test123', 12),
            name: 'Test User',
            phone: '+1234567890',
            telegramUsername: 'testuser',
            departmentId: firstDept.id,
            isApproved: false,
            registrationFee: false,
            paymentApproved: false
          }
        })
        
        console.log('✅ User creation test passed')
        
        // Clean up
        await prisma.user.delete({ where: { id: testUser.id } })
        console.log('✅ Test cleanup completed')
        
      } catch (userError) {
        console.log('❌ User creation failed:', userError.message)
      }
    }

    console.log('\n🎉 Registration system is now ready!')
    console.log('\n📋 What to do next:')
    console.log('1. Start your server: npm run dev')
    console.log('2. Visit: http://localhost:3000/auth/register')
    console.log('3. Test the complete registration flow')
    console.log('4. Check admin panel: http://localhost:3000/admin')
    console.log('\n💡 If issues persist:')
    console.log('- Check browser console for errors')
    console.log('- Check server logs for API errors')
    console.log('- Ensure all environment variables are set')

  } catch (error) {
    console.error('❌ Fix failed:', error)
    console.log('\n🔧 Manual troubleshooting:')
    console.log('1. Check DATABASE_URL in .env')
    console.log('2. Run: npx prisma db push')
    console.log('3. Run: npx prisma generate')
    console.log('4. Restart your development server')
  } finally {
    await prisma.$disconnect()
  }
}

completeRegistrationFix()