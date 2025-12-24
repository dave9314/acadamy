
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
