const fs = require('fs')

console.log('🔐 Testing NextAuth Configuration...\n')

// Check if NextAuth API route exists
const nextAuthRoute = 'app/api/auth/[...nextauth]/route.ts'
if (fs.existsSync(nextAuthRoute)) {
  console.log('✅ NextAuth API route exists')
  
  const content = fs.readFileSync(nextAuthRoute, 'utf8')
  if (content.includes('NextAuth') && content.includes('authOptions')) {
    console.log('✅ NextAuth route properly configured')
  } else {
    console.log('❌ NextAuth route missing configuration')
  }
} else {
  console.log('❌ NextAuth API route missing')
}

// Check auth configuration
try {
  const authConfig = fs.readFileSync('lib/auth.ts', 'utf8')
  
  const checks = [
    { name: 'NextAuthOptions import', pattern: 'NextAuthOptions' },
    { name: 'CredentialsProvider', pattern: 'CredentialsProvider' },
    { name: 'bcrypt import', pattern: 'bcrypt' },
    { name: 'prisma import', pattern: 'prisma' },
    { name: 'JWT strategy', pattern: 'jwt' },
    { name: 'Session callback', pattern: 'session.*callback' },
    { name: 'JWT callback', pattern: 'jwt.*callback' },
    { name: 'Pages configuration', pattern: 'pages.*{' }
  ]
  
  console.log('\n📋 Auth Configuration:')
  checks.forEach(check => {
    const regex = new RegExp(check.pattern, 'i')
    if (regex.test(authConfig)) {
      console.log(`✅ ${check.name}`)
    } else {
      console.log(`❌ ${check.name}`)
    }
  })
} catch (error) {
  console.log('❌ Error reading auth config:', error.message)
}

// Check environment variables
console.log('\n🔧 Environment Variables:')
if (fs.existsSync('.env')) {
  const env = fs.readFileSync('.env', 'utf8')
  console.log(`   ${env.includes('NEXTAUTH_SECRET') ? '✅' : '❌'} NEXTAUTH_SECRET`)
  console.log(`   ${env.includes('NEXTAUTH_URL') ? '✅' : '❌'} NEXTAUTH_URL`)
  console.log(`   ${env.includes('DATABASE_URL') ? '✅' : '❌'} DATABASE_URL`)
} else {
  console.log('   ❌ .env file not found')
}

console.log('\n🎯 NextAuth Test Complete!')
console.log('\n💡 If you\'re still getting errors:')
console.log('1. Clear .next folder: rm -rf .next')
console.log('2. Reinstall dependencies: npm install')
console.log('3. Generate Prisma client: npx prisma generate')
console.log('4. Push database schema: npx prisma db push')
console.log('5. Restart dev server: npm run dev')