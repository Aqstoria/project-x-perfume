# 🌐 Vercel Environment Variables Setup

## 📋 Complete Environment Variables for Vercel

Copy these exact values into your Vercel dashboard:

### **Required Variables:**

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:Ahmadkhan123+@db.dsqdwpivbzlppfqqxkbq.supabase.co:5432/postgres"
DATABASE_URL_PRISMA="postgresql://postgres:Ahmadkhan123+@db.dsqdwpivbzlppfqqxkbq.supabase.co:5432/postgres"

# Authentication
NEXTAUTH_SECRET="28c0f7715bb9dd69b624a14513bccaf5a4beb96fcfcf3201f4f766846a265a3"
NEXTAUTH_URL="https://your-project.vercel.app"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://dsqdwpivbzlppfqqxkbq.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcWR3cGl2YnpscHBmcXF4a2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwODQ2OTksImV4cCI6MjA2OTY2MDY5OX0.YR9uV4JOXsTKwTv7MTWIFa0GbFcUjON2CBorm94kMhs"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcWR3cGl2YnpscHBmcXF4a2JxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA4NDY5OSwiZXhwIjoyMDY5NjYwNjk5fQ.fRQyOelO7d10hOP5JV1gloJfdc4lWoR-A-ZJpWfjP8g"
```

### **Optional Variables (Recommended):**

```env
# Feature Flags
ENABLE_NOTIFICATIONS="true"
ENABLE_OFFLINE_MODE="true"
ENABLE_PWA="true"

# Development
SKIP_MIDDLEWARE="false"

# Email (if you want to add email functionality later)
SENDGRID_API_KEY=""
FROM_EMAIL="noreply@yourdomain.com"
```

## 🚀 How to Set These in Vercel:

### **Step 1: Go to Vercel Dashboard**
1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"

### **Step 2: Import Your Repository**
1. Select "Import Git Repository"
2. Choose `Aqstoria/project-x-perfume`
3. Click "Import"

### **Step 3: Configure Environment Variables**
1. In the project settings, go to "Environment Variables"
2. Add each variable one by one:

| Variable Name | Value |
|---------------|-------|
| `DATABASE_URL` | `postgresql://postgres:Ahmadkhan123+@db.dsqdwpivbzlppfqqxkbq.supabase.co:5432/postgres` |
| `DATABASE_URL_PRISMA` | `postgresql://postgres:Ahmadkhan123+@db.dsqdwpivbzlppfqqxkbq.supabase.co:5432/postgres` |
| `NEXTAUTH_SECRET` | `28c0f7715bb9dd69b624a14513bccaf5a4beb96fcfcf3201f4f766846a265a3` |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` (update after deployment) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dsqdwpivbzlppfqqxkbq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcWR3cGl2YnpscHBmcXF4a2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwODQ2OTksImV4cCI6MjA2OTY2MDY5OX0.YR9uV4JOXsTKwTv7MTWIFa0GbFcUjON2CBorm94kMhs` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzcWR3cGl2YnpscHBmcXF4a2JxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA4NDY5OSwiZXhwIjoyMDY5NjYwNjk5fQ.fRQyOelO7d10hOP5JV1gloJfdc4lWoR-A-ZJpWfjP8g` |

### **Step 4: Deploy**
1. Click "Deploy"
2. Wait for build to complete
3. Update `NEXTAUTH_URL` with your actual Vercel URL

## 🔐 Important Notes:

### **After First Deployment:**
1. **Update NEXTAUTH_URL** with your actual Vercel URL
2. **Run Database Migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### **Security Checklist:**
- ✅ Database connection is secure
- ✅ NextAuth secret is strong (32 bytes)
- ✅ Supabase keys are correct
- ✅ Environment variables are set

## 🎯 Your Project Will Be Available At:

**Production URL:** `https://your-project.vercel.app`

**Admin Access:** `https://your-project.vercel.app/login/admin`
- Username: `mkalleche@gmail.com`
- Password: `admin123`

**Buyer Access:** `https://your-project.vercel.app/login/buyer`
- Username: `buyer`
- Password: `buyer123`

---

**Ready to deploy! Just copy these values into Vercel!** 🚀 