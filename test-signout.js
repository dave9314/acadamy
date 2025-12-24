// Test script to check NextAuth configuration
console.log('🔍 Testing NextAuth Sign Out Configuration...\n')

// Check environment variables
console.log('1. Environment Variables:')
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set')
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set')
console.log('')

// Check if NextAuth API route exists
const fs = require('fs')
const path = require('path')

console.log('2. NextAuth API Route:')
const nextAuthPath = 'app/api/auth/[...nextauth]/route.ts'
if (fs.existsSync(nextAuthPath)) {
  console.log('✅ NextAuth API route exists')
  const content = fs.readFileSync(nextAuthPath, 'utf8')
  if (content.includes('authOptions')) {
    console.log('✅ Auth options imported correctly')
  } else {
    console.log('❌ Auth options not found in API route')
  }
} else {
  console.log('❌ NextAuth API route missing!')
  console.log('Expected path:', nextAuthPath)
}
console.log('')

// Check auth configuration
console.log('3. Auth Configuration:')
const authPath = 'lib/auth.ts'
if (fs.existsSync(authPath)) {
  console.log('✅ Auth configuration file exists')
  const authContent = fs.readFileSync(authPath, 'utf8')
  
  const checks = [
    { name: 'signOut callback', pattern: 'signOut.*{' },
    { name: 'signOut page config', pattern: 'signOut.*:' },
    { name: 'session strategy', pattern: 'strategy.*jwt' },
    { name: 'secret configuration', pattern: 'secret.*process.env' }
  ]
  
  checks.forEach(check => {
    const regex = new RegExp(check.pattern, 'i')
    if (regex.test(authContent)) {
      console.log(`✅ ${check.name} configured`)
    } else {
      console.log(`❌ ${check.name} missing`)
    }
  })
} else {
  console.log('❌ Auth configuration file missing!')
}
console.log('')

// Check providers setup
console.log('4. Session Provider:')
const providersPath = 'components/providers.tsx'
if (fs.existsSync(providersPath)) {
  console.log('✅ Providers component exists')
  const providersContent = fs.readFileSync(providersPath, 'utf8')
  if (providersContent.includes('SessionProvider')) {
    console.log('✅ SessionProvider configured')
  } else {
    console.log('❌ SessionProvider not found')
  }
} else {
  console.log('❌ Providers component missing!')
}
console.log('')

console.log('🎯 Sign Out Test Complete!')
console.log('')
console.log('If sign out still doesn\'t work, try:')
console.log('1. Clear browser cookies and localStorage')
console.log('2. Restart the development server')
console.log('3. Check browser console for JavaScript errors')
console.log('4. Verify NEXTAUTH_SECRET is set in .env')