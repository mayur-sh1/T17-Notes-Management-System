const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Notes Management System Backend...\n');

// Step 1: Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  // Default .env content
  const envContent = `# Database Configuration
# Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notes_db?schema=public"

# Redis Configuration (Optional - for production/scaling)
# Leave as is for development if Redis is not installed
REDIS_URL="redis://localhost:6379"

# JWT Configuration
# IMPORTANT: Change this to a random string in production!
JWT_SECRET="notes-management-system-secret-key-change-in-production-2024"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created!\n');
  console.log('⚠️  Please edit backend/.env with your database credentials!\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Step 2: Generate Prisma Client
console.log('📦 Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit', cwd: __dirname });
  console.log('✅ Prisma Client generated!\n');
} catch (error) {
  console.log('⚠️  Prisma generate failed. Make sure database is accessible.\n');
}

// Step 3: Check database connection and run migrations
console.log('🗄️  Setting up database...');
console.log('   Run the following commands manually:');
console.log('   1. Create PostgreSQL database: CREATE DATABASE notes_db;');
console.log('   2. Update DATABASE_URL in backend/.env');
console.log('   3. Run: npx prisma migrate dev --name init\n');

console.log('✨ Backend setup complete!');
console.log('\n📋 Next steps:');
console.log('   1. Edit backend/.env with your database credentials');
console.log('   2. Create PostgreSQL database: notes_db');
console.log('   3. Run: npx prisma migrate dev --name init');
console.log('   4. Start server: npm run dev\n');

