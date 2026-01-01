const { PrismaClient } = require('@prisma/client')

async function seedDepartments() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🌱 Seeding departments...')
    
    const departments = [
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
    
    for (const dept of departments) {
      const existing = await prisma.department.findFirst({
        where: { name: dept.name }
      })
      
      if (!existing) {
        await prisma.department.create({
          data: dept
        })
        console.log(`✅ Created department: ${dept.name}`)
      } else {
        console.log(`⏭️ Department already exists: ${dept.name}`)
      }
    }
    
    const totalDepartments = await prisma.department.count()
    console.log(`🎉 Total departments in database: ${totalDepartments}`)
    
  } catch (error) {
    console.error('❌ Error seeding departments:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDepartments()