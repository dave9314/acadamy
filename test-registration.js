const fs = require('fs')

console.log('🧪 Testing Registration System...\n')

// Test 1: Check if registration API exists
const regApiPath = 'app/api/auth/register/route.ts'
if (fs.existsSync(regApiPath)) {
  console.log('✅ Registration API exists')
  
  const content = fs.readFileSync(regApiPath, 'utf8')
  
  // Check for key components
  const checks = [
    { name: 'FormData handling', pattern: 'formData' },
    { name: 'JSON handling', pattern: 'request\\.json' },
    { name: 'File upload handling', pattern: 'paymentScreenshot' },
    { name: 'Password hashing', pattern: 'bcrypt\\.hash' },
    { name: 'Database creation', pattern: 'prisma\\.user\\.create' },
    { name: 'Error handling', pattern: 'catch.*error' },
    { name: 'Validation', pattern: 'if.*!email' }
  ]
  
  checks.forEach(check => {
    const regex = new RegExp(check.pattern, 'i')
    console.log(`   ${regex.test(content) ? '✅' : '❌'} ${check.name}`)
  })
} else {
  console.log('❌ Registration API missing')
}

// Test 2: Check database schema
console.log('\n🗄️ Database Schema:')
try {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8')
  
  const schemaChecks = [
    { name: 'User model', pattern: 'model User' },
    { name: 'Department relation', pattern: 'department.*Department' },
    { name: 'Payment fields', pattern: 'paymentMethod' },
    { name: 'Screenshot field', pattern: 'paymentScreenshot' },
    { name: 'Approval fields', pattern: 'paymentApproved' }
  ]
  
  schemaChecks.forEach(check => {
    const regex = new RegExp(check.pattern, 'i')
    console.log(`   ${regex.test(schema) ? '✅' : '❌'} ${check.name}`)
  })
} catch (error) {
  console.log('   ❌ Error reading schema')
}

// Test 3: Check uploads directory
console.log('\n📁 File Upload Setup:')
if (fs.existsSync('public')) {
  console.log('   ✅ Public directory exists')
  
  if (fs.existsSync('public/uploads')) {
    console.log('   ✅ Uploads directory exists')
  } else {
    console.log('   ⚠️  Uploads directory missing (will be created automatically)')
  }
} else {
  console.log('   ❌ Public directory missing')
}

// Test 4: Check registration page
console.log('\n📄 Registration Page:')
const regPagePath = 'app/auth/register/page.tsx'
if (fs.existsSync(regPagePath)) {
  console.log('   ✅ Registration page exists')
  
  const pageContent = fs.readFileSync(regPagePath, 'utf8')
  
  const pageChecks = [
    { name: 'FormData submission', pattern: 'FormData' },
    { name: 'File input', pattern: 'type="file"' },
    { name: 'Payment method selection', pattern: 'paymentMethod' },
    { name: 'Error handling', pattern: 'toast\\.error' },
    { name: 'Success handling', pattern: 'toast\\.success' }
  ]
  
  pageChecks.forEach(check => {
    const regex = new RegExp(check.pattern, 'i')
    console.log(`   ${regex.test(pageContent) ? '✅' : '❌'} ${check.name}`)
  })
} else {
  console.log('   ❌ Registration page missing')
}

console.log('\n🎯 Registration Test Complete!')
console.log('\n💡 Common registration issues:')
console.log('1. Database not connected - check DATABASE_URL in .env')
console.log('2. Missing departments - run: node setup-database.js')
console.log('3. File upload permissions - check public/uploads folder')
console.log('4. Network errors - check browser console for details')
console.log('\n🔧 To debug registration:')
console.log('1. Open browser developer tools (F12)')
console.log('2. Go to Network tab')
console.log('3. Try registering and check the API response')
console.log('4. Check server console for error logs')