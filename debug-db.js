const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function debugDatabase() {
  try {
    console.log('🔍 Debugging database connection and schema...\n')
    
    // Test database connection
    console.log('1. Testing database connection...')
    const adminCount = await prisma.admin.count()
    console.log(`✅ Database connected. Admin count: ${adminCount}`)
    
    // Check if admin exists
    console.log('\n2. Checking admin user...')
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@assignmentpro.com' }
    })
    
    if (admin) {
      console.log('✅ Admin user exists:', admin.email)
    } else {
      console.log('❌ Admin user not found!')
    }
    
    // Check users
    console.log('\n3. Checking users...')
    const users = await prisma.user.findMany({
      include: { department: true }
    })
    console.log(`📊 Total users: ${users.length}`)
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.department?.name || 'No dept'} - Approved: ${user.isApproved}`)
    })
    
    // Check departments
    console.log('\n4. Checking departments...')
    const departments = await prisma.department.findMany()
    console.log(`📚 Total departments: ${departments.length}`)
    
    departments.forEach((dept, index) => {
      console.log(`${index + 1}. ${dept.name} - ${dept.serviceFee} Birr`)
    })
    
    // Check assignments
    console.log('\n5. Checking assignments...')
    const assignments = await prisma.assignment.findMany({
      include: {
        department: true,
        assignedTo: true
      }
    })
    console.log(`📝 Total assignments: ${assignments.length}`)
    
    if (assignments.length > 0) {
      console.log('Sample assignment fields:')
      const sample = assignments[0]
      console.log('- Has submitterTelegram field:', 'submitterTelegram' in sample)
      console.log('- Has submitterWhatsApp field:', 'submitterWhatsApp' in sample)
    }
    
    console.log('\n✅ Database debug complete!')
    
  } catch (error) {
    console.error('❌ Database error:', error.message)
    console.log('\nPossible issues:')
    console.log('1. Database not running')
    console.log('2. Wrong connection string in .env')
    console.log('3. Schema not pushed to database')
    console.log('4. Missing database migrations')
    
    console.log('\nTry running:')
    console.log('npx prisma db push')
    console.log('npx prisma generate')
  } finally {
    await prisma.$disconnect()
  }
}

debugDatabase()