# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Set up a PostgreSQL database (recommended: Neon, Supabase, or Railway)
3. **Environment Variables**: Prepare all required environment variables

## Environment Variables

Create these environment variables in your Vercel project settings:

### Database
```
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

### NextAuth.js
```
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-super-secret-key-here"
```

### File Upload (Optional - for local file storage)
```
UPLOAD_DIR="/tmp/uploads"
```

## Deployment Steps

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository containing this code

### 2. Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (if code is in root)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3. Add Environment Variables
1. In project settings, go to "Environment Variables"
2. Add all the environment variables listed above
3. Make sure to add them for all environments (Production, Preview, Development)

### 4. Database Setup
1. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
2. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```

### 5. Deploy
1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## Post-Deployment Setup

### 1. Create Admin Account
Run the admin creation script:
```bash
node create-admin.js
```

### 2. Test the Application
1. Visit your deployed URL
2. Test user registration
3. Test admin login
4. Verify all features work correctly

### 3. Configure Domain (Optional)
1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed

## File Upload Considerations

For production, consider using cloud storage:

### Option 1: Vercel Blob Storage
```bash
npm install @vercel/blob
```

### Option 2: AWS S3
```bash
npm install aws-sdk
```

### Option 3: Cloudinary
```bash
npm install cloudinary
```

## Database Considerations

### Recommended Providers:
1. **Neon** - Serverless PostgreSQL
2. **Supabase** - Open source Firebase alternative
3. **Railway** - Simple database hosting
4. **PlanetScale** - MySQL-compatible

### Connection Pooling
For production, enable connection pooling in your DATABASE_URL:
```
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require&pgbouncer=true&connection_limit=1"
```

## Monitoring and Maintenance

### 1. Set up Monitoring
- Enable Vercel Analytics
- Set up error tracking (Sentry recommended)
- Monitor database performance

### 2. Regular Maintenance
- Monitor database size and performance
- Clean up old files and data
- Update dependencies regularly

### 3. Backup Strategy
- Set up automated database backups
- Test restore procedures
- Document recovery processes

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check environment variables
   - Verify database connection
   - Review build logs

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server status
   - Ensure SSL is properly configured

3. **File Upload Issues**
   - Verify upload directory permissions
   - Check file size limits
   - Consider using cloud storage

4. **Authentication Issues**
   - Verify NEXTAUTH_URL matches your domain
   - Check NEXTAUTH_SECRET is set
   - Ensure database tables are created

## Support

For deployment issues:
1. Check Vercel documentation
2. Review application logs
3. Test locally first
4. Contact support if needed

## Security Checklist

- [ ] All environment variables are secure
- [ ] Database has proper access controls
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] File uploads are validated
- [ ] Rate limiting is implemented
- [ ] Error messages don't expose sensitive data