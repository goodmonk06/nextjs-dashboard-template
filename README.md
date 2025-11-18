# Next.js Admin Dashboard Template

A production-ready admin dashboard template with full-stack capabilities. Built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Overview

This is a modern, fully-functional admin dashboard that demonstrates a complete vertical slice of user management functionality. It includes authentication-ready API routes, database integration, comprehensive testing, and containerized deployment.

**Phase 2 Status**: ✅ Complete vertical slice with end-to-end user management flow

## Features

- ✨ **Next.js 15** with App Router
- 🎨 **Tailwind CSS** for styling
- 📘 **TypeScript** for type safety
- 🗄️ **Prisma ORM** with PostgreSQL
- ✅ **Zod** validation for API requests
- 🧪 **Vitest** for testing
- 🐳 **Docker** ready with compose setup
- 🌙 **Dark theme** with modern design
- 📱 **Responsive layout** with sidebar navigation
- 🔒 **Type-safe API** endpoints

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5.22
- **Validation**: Zod 3.23
- **Testing**: Vitest 2.1
- **Containerization**: Docker & Docker Compose

## Domain Model

### User Entity

```typescript
User {
  id: String (CUID)
  name: String
  email: String (unique)
  role: "admin" | "editor" | "viewer"
  status: "active" | "pending" | "inactive"
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Project Structure

```
nextjs-dashboard-template/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data script
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/
│   │   │   └── users/         # User CRUD API routes
│   │   ├── page.tsx           # Overview dashboard
│   │   ├── users/             # User management page
│   │   ├── settings/          # Settings page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── Card.tsx
│   │   └── Table.tsx
│   └── lib/                   # Utilities and helpers
│       ├── prisma.ts          # Prisma client singleton
│       ├── api-response.ts    # API response helpers
│       ├── types.ts           # TypeScript types
│       ├── validations/       # Zod schemas
│       └── __tests__/         # Unit tests
├── docker-compose.yml         # Docker services config
├── Dockerfile                 # Production Docker image
└── vitest.config.ts           # Test configuration
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Docker & Docker Compose (for containerized setup)
- PostgreSQL 16 (if running locally without Docker)

### Quick Start with Docker

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd nextjs-dashboard-template
```

2. **Copy environment variables**:
```bash
cp .env.example .env
```

3. **Start with Docker Compose**:
```bash
docker compose up
```

This will:
- Start PostgreSQL database
- Build and run the Next.js app
- Run migrations automatically
- Make the app available at http://localhost:3000

4. **Seed the database** (in a new terminal):
```bash
docker compose exec app npx prisma db seed
```

### Local Development Setup

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and update `DATABASE_URL` if needed:
```env
DATABASE_URL="postgresql://admin:password@localhost:5432/dashboard?schema=public"
```

3. **Start PostgreSQL** (if not using Docker):
```bash
docker compose up postgres -d
```

4. **Run database migrations**:
```bash
npm run db:push
# or for tracked migrations:
npm run db:migrate
```

5. **Seed the database**:
```bash
npm run db:seed
```

6. **Start development server**:
```bash
npm run dev
```

7. **Open** [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests with Vitest |
| `npm run test:ui` | Run tests with UI |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Create and run migrations |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio |

## Example Flow: User Management

The app implements a complete vertical slice for user management:

### 1. **Create User**
- Navigate to `/users`
- Click "Add User" button
- Fill in the form (name, email, role, status)
- Submit to create via `POST /api/users`

### 2. **List Users**
- View all users in the table on `/users` page
- Data fetched from `GET /api/users` with pagination
- Real-time stats: Total users, Active users, Inactive users

### 3. **View User Details**
- Each user displayed with role badge and status badge
- Join date automatically calculated from `createdAt`

### 4. **Delete User**
- Click "Delete" button on any user row
- Confirm deletion
- User removed via `DELETE /api/users/:id`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | List users (paginated) |
| `POST` | `/api/users` | Create new user |
| `GET` | `/api/users/:id` | Get user by ID |
| `PATCH` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Delete user |

All endpoints include:
- Zod validation for request data
- Consistent error handling
- Type-safe responses
- Proper HTTP status codes

### Demo Data

After running `npm run db:seed`, you'll have 8 demo users with various roles and statuses:

- **Admins**: John Doe, Diana Prince
- **Editors**: Jane Smith, Alice Williams, Ethan Hunt
- **Viewers**: Bob Johnson, Charlie Brown, Fiona Gallagher

## Testing

Run the test suite:

```bash
npm test
```

Tests include:
- **Validation tests**: Zod schema validation for user inputs
- **API response tests**: Success and error response helpers
- **Coverage**: Core domain logic and utilities

## Database Management

### View Data with Prisma Studio

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555 for visual database browsing.

### Reset Database

```bash
npx prisma migrate reset
```

This will:
1. Drop the database
2. Create a new database
3. Run all migrations
4. Run seed script

## Docker Commands

### Build and start services:
```bash
docker compose up --build
```

### Stop services:
```bash
docker compose down
```

### View logs:
```bash
docker compose logs -f app
```

### Run commands in container:
```bash
docker compose exec app npm run db:seed
docker compose exec app npx prisma studio
```

## Adding New Features

### Adding a New Entity

1. **Update Prisma schema** (`prisma/schema.prisma`):
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

2. **Create migration**:
```bash
npm run db:migrate
```

3. **Create validation schema** (`src/lib/validations/product.ts`)

4. **Create API routes** (`src/app/api/products/route.ts`)

5. **Create page** (`src/app/products/page.tsx`)

6. **Add to sidebar** (`src/components/Sidebar.tsx`)

### Adding a New Page

See the original Phase 1 documentation for adding static pages.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | See `.env.example` |
| `NODE_ENV` | Environment (development/production) | `development` |

## Production Deployment

### Docker Production Build

```bash
docker build -t dashboard-app .
docker run -p 3000:3000 --env-file .env dashboard-app
```

### Environment Checklist

- [ ] Set production `DATABASE_URL`
- [ ] Run `npm run db:migrate` on production database
- [ ] Run `npm run db:seed` (optional, for demo)
- [ ] Set `NODE_ENV=production`
- [ ] Configure reverse proxy (nginx/traefik)
- [ ] Set up SSL certificates

## Future Extensions

- 🔐 **Authentication**: Add NextAuth.js for user sessions
- 📊 **Analytics**: Integrate charts library (Recharts/Chart.js)
- 🔍 **Search & Filters**: Advanced user filtering
- 📧 **Email**: Send notifications with Resend/SendGrid
- 🎨 **Themes**: Light/dark mode toggle
- 📱 **Mobile App**: React Native companion app
- 🔔 **Real-time**: WebSocket updates with Socket.io
- 📝 **Audit Logs**: Track user actions
- 🌍 **i18n**: Multi-language support
- 🧩 **Plugins**: Extensible plugin system

## License

MIT

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

---

**Status**: Phase 2 Complete ✅
**Vertical Slice**: User Management (CRUD)
**Next Phase**: Authentication & Authorization
