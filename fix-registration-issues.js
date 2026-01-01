const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

async function fixRegistrationIssues() {
  console.log('🔧 Fixing Registration Issues...\n')
  
  const prisma = new PrismaClient()
  
  try {
    // Fix 1: Ensure database connection
    console.log('1️⃣ Checking database connection...')
    await prisma.$connect()
    console.log('✅ Database connected\n')

    // Fix 2: Ensure departments exist
    console.log('2️⃣ Ensuring departments exist...')
    const departmentCount = await prisma.department.count()
    
    if (departmentCount === 0) {
      console.log('⚠️ No departments found. Creating default departments...')
      
      const defaultDepartments = [
        {
          name: 'Computer Science',
          description: 'Programming, algorithms, data structures, software engineering',
          serviceFee: 50
        },
        {
          name: 'Mathematics',
          description: 'Calculus, algebra, statistics, discrete mathematics',
          serviceFee: 40
        },
        {
          name: 'Physics',
          description: 'Classical mechanics, thermodynamics, electromagnetism',
          serviceFee: 45
        },
        {
          name: 'Chemistry',
          description: 'Organic, inorganic, physical chemistry',
          serviceFee: 45
        },
        {
          name: 'Biology',
          description: 'Cell biology, genetics, ecology, anatomy',
          serviceFee: 40
        },
        {
          name: 'Engineering',
          description: 'Mechanical, electrical, civil engineering',
          serviceFee: 55
        },
        {
          name: 'Business',
          description: 'Management, marketing, finance, economics',
          serviceFee: 35
        },
        {
          name: 'English',
          description: 'Literature, writing, grammar, composition',
          serviceFee: 30
        }
      ]
      
      for (const dept of defaultDepartments) {
        await prisma.department.create({ data: dept })
        console.log(`   ✅ Created: ${dept.name}`)
      }
      
      console.log(`✅ Created ${defaultDepartments.length} departments`)
    } else {
      console.log(`✅ Found ${departmentCount} existing departments`)
    }
    console.log('')

    // Fix 3: Ensure uploads directory exists with proper permissions
    console.log('3️⃣ Setting up file upload directory...')
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
        console.log('✅ Created uploads directory')
      } else {
        console.log('✅ Uploads directory exists')
      }
      
      // Test write permissions
      const testFile = path.join(uploadsDir, `test_${Date.now()}.txt`)
      fs.writeFileSync(testFile, 'test file upload')
      fs.unlinkSync(testFile)
      console.log('✅ File upload permissions verified')
      
    } catch (error) {
      console.log('❌ File upload setup failed:', error.message)
      console.log('   Try running as administrator or check folder permissions')
    }
    console.log('')

    // Fix 4: Check database schema
    console.log('4️⃣ Verifying database schema...')
    try {
      // Test if all required tables exist
      const userCount = await prisma.user.count()
      const adminCount = await prisma.admin.count()
      const deptCount = await prisma.department.count()
      
      console.log(`✅ Database schema verified:`)
      console.log(`   - Users: ${userCount}`)
      console.log(`   - Admins: ${adminCount}`)
      console.log(`   - Departments: ${deptCount}`)
      
    } catch (schemaError) {
      console.log('❌ Database schema issue:', schemaError.message)
      console.log('   Run: npx prisma db push')
    }
    console.log('')

    // Fix 5: Create a test admin if none exists
    console.log('5️⃣ Ensuring admin user exists...')
    const adminCount = await prisma.admin.count()
    
    if (adminCount === 0) {
      console.log('⚠️ No admin users found. Creating default admin...')
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      const admin = await prisma.admin.create({
        data: {
          email: 'admin@example.com',
          name: 'System Admin',
          password: hashedPassword
        }
      })
      
      console.log('✅ Created default admin:')
      console.log(`   Email: admin@example.com`)
      console.log(`   Password: admin123`)
      console.log('   ⚠️ Please change this password after first login!')
    } else {
      console.log(`✅ Found ${adminCount} admin user(s)`)
    }

    console.log('\n🎉 Registration system fixes completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Start your development server: npm run dev')
    console.log('2. Test registration at: http://localhost:3000/auth/register')
    console.log('3. Check admin panel at: http://localhost:3000/admin')
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message)
    console.log('\n🔧 Manual steps to try:')
    console.log('1. Run: npx prisma db push')
    console.log('2. Run: npx prisma generate')
    console.log('3. Check your DATABASE_URL in .env file')
  } finally {
    await prisma.$disconnect()
  }
}

fixRegistrationIssues()