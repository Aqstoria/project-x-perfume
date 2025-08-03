# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - For repository hosting
2. **Vercel Account** - For deployment
3. **Supabase Account** - For database and storage
4. **Domain** (Optional) - For custom domain

## 🔧 Step-by-Step Deployment

### 1. **Push to GitHub**

```bash
# Create a new repository on GitHub
# Then push your local repository:

git remote add origin https://github.com/YOUR_USERNAME/project-x-perfume.git
git branch -M main
git push -u origin main
```

### 2. **Connect to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure project settings**

### 3. **Environment Variables Setup**

In Vercel dashboard, add these environment variables:

#### **Required Variables:**
```env
# Database
DATABASE_URL="postgresql://postgres:password@host:port/database"
DATABASE_URL_PRISMA="postgresql://postgres:password@host:port/database"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

#### **Optional Variables:**
```env
# Email (if using SendGrid)
SENDGRID_API_KEY="your-sendgrid-key"
FROM_EMAIL="noreply@yourdomain.com"

# Feature Flags
ENABLE_NOTIFICATIONS="true"
ENABLE_OFFLINE_MODE="true"
ENABLE_PWA="true"

# Development
SKIP_MIDDLEWARE="false"
```

### 4. **Build Configuration**

**Framework Preset:** Next.js
**Build Command:** `npm run build`
**Output Directory:** `.next`
**Install Command:** `npm install`

### 5. **Database Migration**

After deployment, run database migrations:

```bash
# Connect to your production database
npx prisma migrate deploy

# Seed the database
npx prisma db seed
```

### 6. **Custom Domain (Optional)**

1. **Add Domain** in Vercel dashboard
2. **Update DNS** records
3. **Update NEXTAUTH_URL** to your custom domain

## 🔐 Security Checklist

### **Environment Variables**
- [ ] `NEXTAUTH_SECRET` is a strong random string
- [ ] `DATABASE_URL` points to production database
- [ ] Supabase keys are correct
- [ ] `NEXTAUTH_URL` matches your domain

### **Database Security**
- [ ] Production database is properly secured
- [ ] Database user has minimal required permissions
- [ ] Connection uses SSL/TLS

### **Application Security**
- [ ] HTTPS is enabled
- [ ] Security headers are configured
- [ ] Rate limiting is active
- [ ] CSRF protection is enabled

## 📊 Performance Optimization

### **Vercel Settings**
- **Edge Functions:** Enable for API routes
- **Image Optimization:** Next.js Image component
- **Caching:** Configure appropriate cache headers
- **CDN:** Vercel's global CDN

### **Database Optimization**
- **Connection Pooling:** Configure Prisma connection limits
- **Indexes:** Ensure proper database indexes
- **Query Optimization:** Monitor slow queries

## 🔍 Monitoring & Debugging

### **Vercel Analytics**
- Enable Vercel Analytics for performance monitoring
- Monitor Core Web Vitals
- Track user interactions

### **Error Monitoring**
- Set up error tracking (Sentry recommended)
- Monitor API response times
- Check database connection health

### **Logs**
- View deployment logs in Vercel dashboard
- Monitor function execution logs
- Check build logs for issues

## 🚀 Deployment Commands

### **Manual Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### **Database Commands**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Open Prisma Studio (for debugging)
npx prisma studio
```

## 🔄 Continuous Deployment

### **Automatic Deployments**
- **Main Branch:** Deploys to production
- **Feature Branches:** Deploys to preview URLs
- **Pull Requests:** Creates preview deployments

### **Deployment Triggers**
- Push to main branch
- Pull request creation
- Manual deployment

## 📱 PWA Configuration

### **Service Worker**
- Ensure `public/sw.js` is accessible
- Configure caching strategies
- Test offline functionality

### **Manifest**
- Update `public/manifest.json` with your domain
- Configure app icons
- Set up app shortcuts

## 🔧 Troubleshooting

### **Common Issues**

#### **Build Failures**
```bash
# Check build logs
vercel logs

# Test build locally
npm run build
```

#### **Database Connection Issues**
```bash
# Test database connection
npx prisma db pull

# Check environment variables
vercel env ls
```

#### **Authentication Issues**
- Verify `NEXTAUTH_URL` matches your domain
- Check `NEXTAUTH_SECRET` is set
- Ensure Supabase configuration is correct

### **Performance Issues**
- Enable Vercel Analytics
- Monitor Core Web Vitals
- Check database query performance
- Optimize images and assets

## 📈 Post-Deployment Checklist

### **Functionality Tests**
- [ ] Admin login works
- [ ] Buyer login works
- [ ] Product management functions
- [ ] Order management works
- [ ] Picklist system works
- [ ] File uploads work
- [ ] PDF generation works

### **Performance Tests**
- [ ] Page load times are acceptable
- [ ] API response times are good
- [ ] Database queries are optimized
- [ ] Images load properly

### **Security Tests**
- [ ] HTTPS is working
- [ ] Authentication is secure
- [ ] API endpoints are protected
- [ ] Environment variables are secure

## 🎉 Success!

Your Project X B2B Perfume Platform is now live on Vercel!

**Production URL:** `https://your-project.vercel.app`

**Admin Access:** `https://your-project.vercel.app/login/admin`
- Username: `mkalleche@gmail.com`
- Password: `admin123`

**Buyer Access:** `https://your-project.vercel.app/login/buyer`
- Username: `buyer`
- Password: `buyer123`

---

**Need Help?** Contact: info@projectx.nl 