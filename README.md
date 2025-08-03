# Project X - B2B Perfume Wholesale Platform

A comprehensive B2B wholesale platform for perfumes with customer-specific pricing, order approval workflows, and advanced inventory management.

## 🚀 Features

### Core Features
- **Product Management** - Full CRUD with image upload
- **Order Management** - Approval workflows with customer-specific pricing
- **Customer Management** - Margins, discounts, and pricing overrides
- **User Management** - Role-based access control (Admin/Buyer)

### Post-MVP Features
- **📦 Picklist System** - Warehouse management with barcode scanning
- **📱 Mobile Interface** - PWA and touch-optimized picking
- **🌍 Multilingual Support** - i18n ready (Dutch/English)
- **🔗 External Integrations** - Shopify, Bol, Amazon support
- **👥 Client Roles** - Granular permission management
- **📊 Advanced Analytics** - Comprehensive reporting and exports

### Technical Features
- **Next.js 15** - App Router with TypeScript
- **Prisma ORM** - PostgreSQL database with migrations
- **NextAuth.js** - Authentication with role-based access
- **Supabase** - Database and file storage
- **TailwindCSS** - Modern responsive design
- **PWA Support** - Progressive Web App capabilities

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Styling**: TailwindCSS
- **File Storage**: Supabase Storage
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- npm or yarn

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd perfume_selling-main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://..."
DATABASE_URL_PRISMA="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 👥 Default Users

### Admin User
- **Username**: `mkalleche@gmail.com`
- **Password**: `admin123`
- **Access**: Full admin panel

### Buyer User
- **Username**: `buyer`
- **Password**: `buyer123`
- **Access**: Customer portal

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── dashboard/         # Buyer dashboard
│   └── products/          # Product catalog
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
└── tests/                # Test files
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:seed          # Seed database
npm run db:setup         # Setup database

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run E2E tests
npm run test:coverage    # Run tests with coverage

# Linting
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript check
```

## 🌐 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   - Push to GitHub
   - Connect repository to Vercel
   - Configure environment variables

2. **Environment Variables**
   Set these in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - Supabase credentials

3. **Database Migration**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## 🔐 Security Features

- **Role-based Access Control** - Admin/Buyer roles
- **CSRF Protection** - Built-in NextAuth protection
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Prisma ORM
- **XSS Protection** - React built-in protection

## 📊 Database Schema

### Core Models
- **User** - Authentication and roles
- **Customer** - Customer information and margins
- **Product** - Product catalog with images
- **Order** - Order management with approval workflow
- **Picklist** - Warehouse management system

### Advanced Features
- **CustomerPrice** - Customer-specific pricing
- **CustomerMargin** - Margin management
- **PicklistItem** - Picklist items with barcode support
- **InventoryScan** - Inventory tracking
- **Translation** - Multilingual support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software.

## 🆘 Support

For support, contact: info@projectx.nl

---

**Built with ❤️ using Next.js 15, TypeScript, and Prisma**
