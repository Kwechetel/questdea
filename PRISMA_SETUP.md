# Prisma + Neon Postgres Setup Guide

## Files Created

1. **prisma/schema.prisma** - Database schema with all models and enums
2. **lib/prisma.ts** - Prisma client singleton for Next.js
3. **prisma/seed.ts** - Seed file to create admin user
4. **.env.example** - Environment variables template (create manually if needed)

## Environment Variables

Create a `.env` file in the root directory with:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
```

For Neon Postgres, your DATABASE_URL will look like:
```
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## Installation Commands

Run these commands to install dependencies:

```bash
npm install @prisma/client bcrypt
npm install -D prisma @types/bcrypt tsx
```

## Setup Commands

1. **Generate Prisma Client:**
   ```bash
   npm run prisma:generate
   ```

2. **Run Initial Migration:**
   ```bash
   npm run prisma:migrate
   ```
   This will create the database tables.

3. **Seed the Database:**
   ```bash
   npm run prisma:seed
   ```
   This creates an admin user:
   - Email: `admin@lastte.com`
   - Password: `ChangeMe123!`

4. **Open Prisma Studio (Optional):**
   ```bash
   npm run prisma:studio
   ```
   Opens a GUI to view and edit your database.

## Using Prisma Client

Import the Prisma client in your API routes or server components:

```typescript
import { prisma } from "@/lib/prisma";

// Example usage
const users = await prisma.user.findMany();
```

## Database Schema

### Enums
- **Role**: ADMIN, CLIENT
- **LeadStatus**: NEW, CONTACTED, WON, LOST

### Models
- **User**: id, name, email (unique), passwordHash, role, createdAt, updatedAt
- **Lead**: id, name, email, phone, business, budget, message, status, createdAt, updatedAt
- **Client**: id, userId (unique), companyName, phone, createdAt
- **Project**: id, clientId, title, status, description, createdAt, updatedAt

## Next Steps

1. Set up your Neon Postgres database
2. Copy the connection string to `.env`
3. Run the setup commands above
4. Start using Prisma in your API routes!

