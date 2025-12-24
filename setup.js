#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Assignment Platform...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from .env.example...');
  fs.copyFileSync('.env.example', '.env');
  console.log('✅ .env file created. Please update it with your database credentials.\n');
} else {
  console.log('✅ .env file already exists.\n');
}

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed.\n');

  console.log('🗄️  Generating Prisma client...');
  execSync('npm run db:generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated.\n');

  console.log('🏗️  Setting up database schema...');
  execSync('npm run db:push', { stdio: 'inherit' });
  console.log('✅ Database schema created.\n');

  console.log('🌱 Seeding database with initial data...');
  execSync('npm run db:seed', { stdio: 'inherit' });
  console.log('✅ Database seeded.\n');

  console.log('🎉 Setup complete!\n');
  console.log('Default credentials:');
  console.log('Admin: admin@assignmentpro.com / admin123');
  console.log('Maker: john.cs@example.com / maker123\n');
  console.log('Run "npm run dev" to start the development server.');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('\nPlease ensure:');
  console.log('1. PostgreSQL is running');
  console.log('2. Database credentials in .env are correct');
  console.log('3. Database exists and is accessible');
}