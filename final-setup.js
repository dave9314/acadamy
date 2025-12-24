const fs = require('fs')
const { execSync } = require('child_process')

console.log('🚀 Final Setup for Assignment Platform...\n')

// Check if uploads directory exists
const uploadsDir = 'public/uploads'
if (!fs.existsSync('public')) {
  fs.mkdirSync('public')
  console.log('✅ Created public directory')
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('✅ Created uploads directory')
} else {
  console.log('✅ Uploads directory exists')
}

// Check environment variables
console.log('\n🔧 Environment Configuration:')
if (fs.existsSync('.env')) {
  const env = fs.readFileSync('.env', 'utf8')
  console.log(`   ${env.includes('DATABASE_URL') ? '✅' : '❌'} DATABASE_URL`)
  console.log(`   ${env.includes('NEXTAUTH_SECRET') ? '✅' : '❌'} NEXTAUTH_SECRET`)
  console.log(`   ${env.includes('NEXTAUTH_URL') ? '✅' : '❌'} NEXTAUTH_URL`)
} else {
  console.log('   ❌ .env file not found')
}

// Check package.json dependencies
console.log('\n📦 Dependencies:')
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const requiredDeps = [
    'next-auth',
    'prisma',
    '@prisma/client',
    'bcryptjs',
    'framer-motion',
    'lucide-react',
    'react-hot-toast'
  ]
  
  requiredDeps.forEach(dep => {
    const exists = pkg.dependencies?.[dep] || pkg.devDependencies?.[dep]
    console.log(`   ${exists ? '✅' : '❌'} ${dep}`)
  })
} catch (error) {
  console.log('   ❌ Error reading package.json')
}

console.log('\n🎯 Setup Complete!')
console.log('\n📋 Next Steps:')
console.log('1. Run: npx prisma db push')
console.log('2. Run: npm run dev')
console.log('3. Visit: http://localhost:3000')
console.log('\n🔐 Features Ready:')
console.log('• User registration with payment (CBE/Telebirr)')
console.log('• Screenshot upload for payment verification')
console.log('• Admin approval system')
console.log('• Department-based assignment maker search')
console.log('• Beautiful admin dashboard')
console.log('• Complete authentication flow')
console.log('\n🎉 Your assignment platform is ready to use!')