# Assignment Platform

A professional academic services platform that connects students with verified assignment makers across different departments.

## Features

### Core Features
- **User Authentication**: Secure login/registration for assignment makers and admins
- **Department Management**: Organized by academic departments with custom service fees
- **Assignment Submission**: Easy-to-use interface for submitting assignments with file uploads
- **Admin Dashboard**: Complete management system for users and assignments
- **Maker Dashboard**: Interface for assignment makers to view and manage their assignments
- **Payment Tracking**: Built-in payment and fee management system

### New Features ✨
- **Balance & Earnings Tracking**: Real-time balance and earnings display for assignment makers
- **AI Detection Integration**: Mandatory AI detection screenshots for assignment completion
- **Report System**: Users can report issues with assignment makers or platform problems
- **Announcement System**: Admins can broadcast messages to all users or specific users
- **User Management**: Admin can approve, reject, or delete users with proper safeguards
- **Performance Optimized**: Lazy loading and skeleton components for better user experience
- **Sapphire UI Theme**: Beautiful, consistent color scheme throughout the application

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Upload**: Built-in file handling
- **UI Components**: Lucide React icons, Framer Motion animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd assignment-platform
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your database URL and secrets:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/assignment_platform"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
JWT_SECRET="your-jwt-secret-here"
```

4. Set up the database
```bash
# Push database schema
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed the database with sample data
npm run db:seed
```

**Note**: If you encounter issues with the reports or announcements features, make sure your database schema is up to date:
```bash
# Test if all models exist
node test-reports-api.js

# If you see table errors, run:
npx prisma db push --force-reset
npm run db:seed
```

5. Start the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Default Credentials

After seeding the database:

**Admin Account:**
- Email: `admin@assignmentpro.com`
- Password: `admin123`

**Sample Assignment Maker:**
- Email: `john.cs@example.com`
- Password: `maker123`

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Maker dashboard
│   └── request/           # Assignment submission
├── lib/                   # Utility libraries
├── prisma/               # Database schema and migrations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `GET /api/departments` - List departments
- `GET /api/makers` - List assignment makers by department
- `POST /api/assignments` - Submit assignment
- `GET /api/assignments` - List assignments
- `GET /api/admin/users` - Admin: List users
- `PATCH /api/admin/users/[id]` - Admin: Update user status
- `PATCH /api/admin/assignments/[id]` - Admin: Update assignment status

## Database Schema

The application uses the following main entities:

- **Users**: Assignment makers with department associations
- **Admins**: System administrators
- **Departments**: Academic departments with service fees
- **Assignments**: Assignment submissions with file attachments
- **Payments**: Payment tracking for registration fees and commissions

## Deployment

1. Set up a PostgreSQL database (e.g., on Railway, Supabase, or AWS RDS)
2. Deploy to Vercel, Netlify, or your preferred platform
3. Set environment variables in your deployment platform
4. Run database migrations: `npm run db:push`
5. Seed the database: `npm run db:seed`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.