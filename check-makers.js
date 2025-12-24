const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkMakers() {
  try {
    console.log('🔍 Checking assignment makers in database...\n')
    
    // Get all users
    const allUsers = await prisma.user.findMany({
      include: { department: true }
    })
    
    console.log(`📊 Total registered users: ${allUsers.length}`)
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in database!')
      console.log('💡 You need to register some assignment makers first.')
      return
    }
    
    // Show user details
    console.log('\n👥 All registered users:')
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`)
      console.log(`   Department: ${user.department?.name || 'None'}`)
      console.log(`   Approved: ${user.isApproved ? '✅' : '❌'}`)
      console.log(`   Registration Fee Paid: ${user.registrationFee ? '✅' : '❌'}`)
      console.log('')
    })
    
    // Get approved makers only
    const approvedMakers = await prisma.user.findMany({
      where: {
        isApproved: true,
        registrationFee: true
      },
      include: { department: true }
    })
    
    console.log(`✅ Approved assignment makers: ${approvedMakers.length}`)
    
    if (approvedMakers.length === 0) {
      console.log('⚠️  No approved makers available!')
      console.log('💡 Admin needs to approve users and mark registration fees as paid.')
    } else {
      console.log('\n🎯 Available assignment makers:')
      approvedMakers.forEach((maker, index) => {
        console.log(`${index + 1}. ${maker.name} - ${maker.department?.name}`)
      })
    }
    
    // Check by department
    const departments = await prisma.department.findMany()
    console.log('\n📚 Makers by department:')
    
    for (const dept of departments) {
      const deptMakers = await prisma.user.findMany({
        where: {
          departmentId: dept.id,
          isApproved: true,
          registrationFee: true
        }
      })
      console.log(`${dept.name}: ${deptMakers.length} makers`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkMakers()