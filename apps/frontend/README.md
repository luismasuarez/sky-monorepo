# Project Template - Next.js + Prisma + PostgreSQL

This is a production-ready template for building full-stack applications with Next.js, Prisma, PostgreSQL, and shadcn/ui components.

## 🚀 Features

- ⚡ **Next.js 16** - React framework with App Router
- 🗄️ **Prisma ORM** - Type-safe database access
- 🐘 **PostgreSQL** - Robust relational database
- 🎨 **Tailwind CSS v4** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful, accessible UI components
- 🐳 **Docker** - Containerized development and deployment
- 📝 **TypeScript** - Full type safety
- 🔐 **NextAuth Ready** - Authentication setup ready

## 📋 Prerequisites

- Node.js 20+ or Docker
- pnpm (recommended) or npm
- PostgreSQL (or use Docker Compose)

## 🛠️ Getting Started

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd <your-project-name>

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your actual values
```

### 2. Database Setup

#### Option A: Using Docker Compose (Recommended)

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Run migrations
pnpm prisma migrate dev
```

#### Option B: Local PostgreSQL

```bash
# Update DATABASE_URL in .env with your local PostgreSQL connection
# Run migrations
pnpm prisma migrate dev
```

### 3. Generate Prisma Client

```bash
pnpm prisma generate
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── generated/        # Prisma generated client (auto-generated)
│   ├── prisma/          # Prisma service utilities
│   └── utils.ts         # Shared utilities
├── prisma/               # Database schema and migrations
│   ├── schema.prisma    # Prisma schema
│   └── migrations/      # Database migrations
├── public/              # Static assets
└── to_migrate_to_nextjs/ # Legacy code (can be removed)
```

## 🔧 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Prisma Commands

Add these to your `package.json` scripts:

```json
"prisma:generate": "prisma generate",
"prisma:migrate": "prisma migrate dev",
"prisma:studio": "prisma studio",
"prisma:deploy": "prisma migrate deploy"
```

## 📝 Customization Guide

### Update Project Name

1. Update `name` in `package.json`
2. Update container names in `docker-compose.yml`
3. Update database name in `.env`

### Modify Database Schema

1. Edit `prisma/schema.prisma`
2. Run `pnpm prisma migrate dev --name your_migration_name`
3. Run `pnpm prisma generate`

### Add New Components

```bash
# Add shadcn/ui components
npx shadcn@latest add <component-name>
```

## 🗄️ Database Management

```bash
# Create a migration
pnpm prisma migrate dev --name migration_name

# Apply migrations in production
pnpm prisma migrate deploy

# Reset database (development only)
pnpm prisma migrate reset

# Open Prisma Studio (Database GUI)
pnpm prisma studio
```

## 🌍 Environment Variables

See `.env.example` for required environment variables.

Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL
- `NEXTAUTH_SECRET` - Secret for session encryption

## 🎨 Styling

This project uses:

- **Tailwind CSS v4** for utility classes
- **shadcn/ui** for pre-built components
- **CSS Variables** for theming (see `app/globals.css`)

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a template repository. Fork it and customize it for your needs!

## 📄 License

MIT License - feel free to use this template for any project.

---

**Happy Coding! 🚀**
