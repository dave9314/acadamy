const fs = require('fs')
const path = require('path')

console.log('🔐 Testing Authentication System...\n')

// Test files exist
const authFiles = [
  'app/auth/signin/page.tsx',
  'app/auth/signout/page.tsx', 
  'app/auth/register/page.tsx',
  'app/auth/error/page.tsx',
  'components/ui/sign-out-button.tsx',
  'lib/auth.ts'
]

let allFilesExist = true

authFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`)
  } else {
    console.log(`❌ ${file} missing`)
    allFilesExist = false
  }
})

// Test auth configuration
console.log('\n📋 Checking auth configuration...')

try {
  const authConfig = fs.readFileSync('lib/auth.ts', 'utf8')
  
  const checks = [
    { name: 'signin page config', pattern: 'signIn.*signin' },
    { name: 'signout page config', pattern: 'signOut.*signout' },
    { name: 'error page config', pattern: 'error.*error' },
    { name: 'payment approval check', pattern: 'paymentApproved' },
    { name: 'session strategy', pattern: 'strategy.*jwt' },
    { name: 'secret configuration', pattern: 'secret.*process.env' }
  ]
  
  checks.forEach(check => {
    const regex = new RegExp(check.pattern, 'i')
    if (regex.test(authConfig)) {
      console.log(`✅ ${check.name} configured`)
    } else {
      console.log(`❌ ${check.name} missing`)
    }
  })
} catch (error) {
  console.log('❌ Error reading auth config:', error.message)
}

// Test SignOutButton component
console.log('\n🔘 Checking SignOutButton component...')

try {
  const signOutButton = fs.readFileSync('components/ui/sign-out-button.tsx', 'utf8')
  
  if (signOutButton.includes('router.push(\'/auth/signout\')')) {
    console.log('✅ SignOutButton redirects to signout page')
  } else {
    console.log('❌ SignOutButton not configured properly')
  }
} catch (error) {
  console.log('❌ Error reading SignOutButton:', error.message)
}

// Test database schema
console.log('\n🗄️ Checking database schema...')

try {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8')
  
  const schemaChecks = [
    { name: 'paymentMethod field', pattern: 'paymentMethod.*String' },
    { name: 'paymentScreenshot field', pattern: 'paymentScreenshot.*String' },
    { name: 'paymentApproved field', pattern: 'paymentApproved.*Boolean' }
  ]
  
  schemaChecks.forEach(check => {
    const regex = new RegExp(check.pattern, 'i')
    if (regex.test(schema)) {
      console.log(`✅ ${check.name} exists`)
    } else {
      console.log(`❌ ${check.name} missing`)
    }
  })
} catch (error) {
  console.log('❌ Error reading schema:', error.message)
}

console.log('\n🎯 Authentication System Test Complete!')

if (allFilesExist) {
  console.log('\n✅ All authentication files are in place')
  console.log('🚀 Ready to test the application!')
} else {
  console.log('\n❌ Some files are missing - please check the setup')
}