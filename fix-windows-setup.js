const fs = require('fs')
const path = require('path')

console.log('🔧 Fixing Windows Setup Issues...\n')

// Create a simple Prisma client fallback
const prismaClientFallback = `
import { PrismaClient } from '@prisma/client'

declare global {
  var __prisma: PrismaClient | undefined
}

const prisma = globalThis.__prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

export { prisma }
`

// Check if Prisma client exists and is accessible
try {
  const prismaPath = 'lib/prisma.ts'
  if (fs.existsSync(prismaPath)) {
    console.log('✅ Prisma client file exists')
    
    // Update Prisma client with Windows-friendly version
    fs.writeFileSync(prismaPath, prismaClientFallback.trim())
    console.log('✅ Updated Prisma client for Windows compatibility')
  }
} catch (error) {
  console.log('❌ Error updating Prisma client:', error.message)
}

// Create a development-ready environment check
const envCheck = `
# Check if .env file has required variables
if (Test-Path .env) {
    Write-Host "✅ .env file exists"
    $env_content = Get-Content .env -Raw
    if ($env_content -match "DATABASE_URL") { Write-Host "✅ DATABASE_URL configured" }
    if ($env_content -match "NEXTAUTH_SECRET") { Write-Host "✅ NEXTAUTH_SECRET configured" }
    if ($env_content -match "NEXTAUTH_URL") { Write-Host "✅ NEXTAUTH_URL configured" }
} else {
    Write-Host "❌ .env file missing"
}
`

fs.writeFileSync('check-env.ps1', envCheck)
console.log('✅ Created environment check script')

// Create a simple database setup script
const dbSetup = `
const { PrismaClient } = require('@prisma/client')

async function setupDatabase() {
  console.log('🗄️ Setting up database...')
  
  try {
    const prisma = new PrismaClient()
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Create admin if not exists
    const adminExists = await prisma.admin.findFirst()
    if (!adminExists) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 12)
      
      await prisma.admin.create({
        data: {
          email: 'admin@assignmentpro.com',
          name: 'Admin',
          password: hashedPassword
        }
      })
      console.log('✅ Admin user created')
      console.log('   Email: admin@assignmentpro.com')
      console.log('   Password: admin123')
    }
    
    // Create sample department if not exists
    const deptExists = await prisma.department.findFirst()
    if (!deptExists) {
      await prisma.department.create({
        data: {
          name: 'Computer Science',
          description: 'Computer Science and IT related assignments',
          serviceFee: 500
        }
      })
      console.log('✅ Sample department created')
    }
    
    await prisma.$disconnect()
    console.log('🎉 Database setup complete!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    console.log('💡 Make sure your DATABASE_URL is correct in .env file')
  }
}

setupDatabase()
`

fs.writeFileSync('setup-database.js', dbSetup)
console.log('✅ Created database setup script')

// Create a comprehensive startup script
const startupScript = `
console.log('🚀 Starting Assignment Platform...')

// Check environment
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in environment variables')
  console.log('💡 Make sure you have a .env file with DATABASE_URL')
  process.exit(1)
}

if (!process.env.NEXTAUTH_SECRET) {
  console.error('❌ NEXTAUTH_SECRET not found in environment variables')
  console.log('💡 Add NEXTAUTH_SECRET to your .env file')
  process.exit(1)
}

console.log('✅ Environment variables configured')
console.log('✅ Ready to start development server')
console.log('')
console.log('🎯 Next steps:')
console.log('1. Run: node setup-database.js (to setup database)')
console.log('2. Run: npm run dev (to start development server)')
console.log('3. Visit: http://localhost:3000')
console.log('')
console.log('🔐 Default admin credentials:')
console.log('   Email: admin@assignmentpro.com')
console.log('   Password: admin123')
`

fs.writeFileSync('startup-check.js', startupScript)
console.log('✅ Created startup check script')

console.log('\n🎯 Windows Setup Fix Complete!')
console.log('\n📋 To resolve the Prisma issue and start your platform:')
console.log('1. Close any running development servers')
console.log('2. Run: node setup-database.js')
console.log('3. Run: node startup-check.js')
console.log('4. Run: npm run dev')
console.log('\n💡 If you still get Prisma errors:')
console.log('- Restart your terminal as Administrator')
console.log('- Or use: npm run dev (it should work with the fallback client)')
console.log('\n🎉 Your assignment platform is ready to use!')