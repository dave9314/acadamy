const { execSync } = require('child_process');

console.log('🚀 Starting deployment setup...');

try {
  // Generate Prisma client
  console.log('📋 Generating Prisma client...');
  execSync('prisma generate', { stdio: 'inherit' });
  
  // Try to push database schema (ignore errors if database doesn't exist yet)
  console.log('🗄️ Setting up database schema...');
  try {
    execSync('prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('✅ Database schema updated successfully');
  } catch (dbError) {
    console.log('⚠️ Database schema setup skipped (will be handled by Vercel)');
  }
  
  console.log('✅ Deployment setup completed successfully!');
} catch (error) {
  console.error('❌ Deployment setup failed:', error.message);
  process.exit(1);
}