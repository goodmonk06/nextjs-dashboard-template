# Architecture Documentation

## System Overview

This admin dashboard follows a modern **layered architecture** with clear separation of concerns, designed for scalability and maintainability in a multi-tenant SaaS environment.

```
┌─────────────────────────────────────────────────────────────┐
│                      Presentation Layer                      │
│        (Next.js Pages, React Components, UI State)           │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                        API Layer                             │
│           (Route Handlers, Validation, Error Handling)       │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      Service Layer                           │
│        (Business Logic, Activity Logging, Events)            │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                     Data Access Layer                        │
│                  (Prisma ORM, Database)                      │
└─────────────────────────────────────────────────────────────┘

          ┌──────────────────────────────────────┐
          │     Cross-Cutting Concerns            │
          │  • Logger                             │
          │  • Event Bus                          │
          │  • Metrics                            │
          │  • Adapters (Notifications, etc.)     │
          └──────────────────────────────────────┘
```

## Directory Structure

```
nextjs-dashboard-template/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── users/                # User CRUD endpoints
│   │   │   ├── organizations/        # Organization CRUD endpoints
│   │   │   ├── activity-logs/        # Activity log endpoints
│   │   │   └── preferences/          # Preferences endpoints
│   │   ├── (pages)/                  # Frontend pages
│   │   │   ├── page.tsx              # Overview dashboard
│   │   │   ├── users/                # User management UI
│   │   │   ├── organizations/        # Organization UI
│   │   │   ├── activity/             # Activity logs UI
│   │   │   └── settings/             # Settings UI
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/                   # Reusable UI components
│   │   ├── Layout.tsx                # Dashboard layout wrapper
│   │   ├── Sidebar.tsx               # Navigation sidebar
│   │   ├── TopBar.tsx                # Top navigation bar
│   │   ├── Card.tsx                  # Card container
│   │   └── Table.tsx                 # Data table
│   └── lib/                          # Core libraries & utilities
│       ├── prisma.ts                 # Prisma client singleton
│       ├── logger.ts                 # Structured logging
│       ├── events.ts                 # Event bus & domain events
│       ├── api-response.ts           # API response helpers
│       ├── types.ts                  # TypeScript type definitions
│       ├── adapters/                 # External integrations
│       │   ├── notification.adapter.ts
│       │   └── metrics.adapter.ts
│       ├── services/                 # Business logic services
│       │   └── activity.service.ts
│       └── validations/              # Zod validation schemas
│           ├── user.ts
│           ├── organization.ts
│           ├── preferences.ts
│           └── team.ts
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Seed data script
├── docs/                             # Documentation
└── tests/                            # Test files
```

## Core Principles

### 1. Layered Architecture

**Presentation Layer**
- React components and Next.js pages
- Client-side state management
- UI interactions and rendering
- No direct database access

**API Layer**
- RESTful route handlers
- Request validation (Zod)
- Response formatting
- Error handling
- Authentication/authorization (future)

**Service Layer**
- Business logic
- Domain event emission
- Activity logging
- Cross-entity operations

**Data Access Layer**
- Prisma ORM
- Database queries
- Transactions
- Relationships

### 2. Domain-Driven Design (Light)

**Entities** (Core domain objects)
- User
- Organization
- Team
- ActivityLog
- UserPreferences

**Value Objects** (Immutable)
- Metadata (JSON fields)
- Settings objects

**Services**
- ActivityService (audit logging)
- Future: AuthService, NotificationService

**Events** (Domain events)
- UserCreated, UserUpdated, UserDeleted
- OrganizationCreated, OrganizationUpdated
- TeamCreated, etc.

### 3. Dependency Injection via Adapters

All external dependencies are abstracted behind interfaces:

```typescript
interface INotificationAdapter {
  send(payload: NotificationPayload): Promise<void>;
}

interface IMetricsAdapter {
  recordCounter(name: string, value?: number): void;
}
```

This allows:
- Easy testing (mock adapters)
- Swapping implementations (email provider, metrics backend)
- Environment-specific behavior

### 4. Event-Driven Architecture

Domain events enable loose coupling:

```typescript
// Emit event
const event = createEvent<UserCreatedEvent>("user.created", { userId, email });
await eventBus.emit(event);

// Listen to event
eventBus.on("user.created", async (event) => {
  await notificationAdapter.send({
    to: event.data.email,
    message: "Welcome!"
  });
});
```

Future handlers can be added without modifying existing code.

### 5. Type Safety End-to-End

```
Zod Schema → Prisma Schema → TypeScript Types → API Response → Frontend Types
```

All data flows are strongly typed from database to UI.

## Data Flow

### Create User Example

```
1. Frontend Form Submit
   ↓
2. POST /api/users (Next.js Route Handler)
   ↓
3. Validate with Zod (createUserSchema)
   ↓
4. prisma.user.create()
   ↓
5. Emit UserCreatedEvent
   ↓
6. ActivityService.logActivity() (event handler)
   ↓
7. Return success response
   ↓
8. Frontend updates UI
```

### Read with Relations Example

```
1. GET /api/organizations/:id
   ↓
2. prisma.organization.findUnique({ include: { users, teams } })
   ↓
3. Return nested data
   ↓
4. Frontend displays organization with user/team counts
```

## API Design

### Consistent Response Format

**Success:**
```json
{
  "data": { ...entity or list },
  "message": "Optional success message"
}
```

**Error:**
```json
{
  "error": "Human-readable error message",
  "details": { ...optional error details }
}
```

### Pagination Standard

```json
{
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### Error Handling

All API routes follow this pattern:

```typescript
export async function GET(request: NextRequest) {
  try {
    // Validation
    const validated = schema.parse(body);

    // Business logic
    const result = await service.doSomething(validated);

    // Emit events
    await eventBus.emit(event);

    // Log
    logger.info("Action completed", { ...context });

    // Metrics
    metricsAdapter.recordCounter("api.action.success");

    return successResponse(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("Validation failed", error, 400);
    }
    logger.error("Action failed", error);
    return errorResponse("Internal error", error, 500);
  }
}
```

## Database Schema Design

### Multi-Tenancy

Organizations are the top-level tenant:

```
Organization (1) ─────── (N) Users
     │
     └─────── (N) Teams ─────── (N) TeamMembers ─────── (1) User
     │
     └─────── (N) ActivityLogs
```

### Soft Relationships

Users can exist without an organization (`organizationId` nullable) to support:
- Independent users
- Migration scenarios
- Invitation flows (user created before org assignment)

### Audit Trail

Every entity change creates an ActivityLog:
- action (e.g., "user.created")
- entityType & entityId (what was changed)
- userId (who did it)
- organizationId (tenant context)
- metadata (what changed)
- timestamp

## Extensibility Points

### 1. Event Handlers

Register custom handlers for domain events:

```typescript
eventBus.on("user.created", async (event) => {
  // Send welcome email
  // Create default preferences
  // Notify admin
  // Update analytics
});
```

### 2. Adapter Swap

Replace default implementations:

```typescript
// In production, swap to real service
const notificationAdapter = new SendGridAdapter(apiKey);
const metricsAdapter = new DatadogAdapter(config);
```

### 3. Middleware (Future)

Add authentication, rate limiting, CORS:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Auth check
  // Rate limiting
  // Logging
}
```

### 4. Custom Entities

Add new entities by:
1. Update `prisma/schema.prisma`
2. Create validation schema in `src/lib/validations/`
3. Add types to `src/lib/types.ts`
4. Create API routes in `src/app/api/`
5. Create frontend page
6. Add to navigation

## Performance Considerations

### Database Queries

- Use `include` selectively (avoid N+1 queries)
- Add indexes on foreign keys and frequently queried fields
- Use pagination for list endpoints

### Caching (Future)

Candidates for caching:
- Organization settings
- User permissions
- Static reference data

### Monitoring

Current metrics tracked:
- API endpoint calls
- Error rates
- Entity creation counts

Future:
- Query performance
- Response times
- Memory usage

## Security Considerations

### Current

- Input validation (Zod)
- SQL injection prevention (Prisma parameterized queries)
- Error message sanitization (no stack traces in production)

### Future (Phase 4)

- Authentication (NextAuth.js)
- Authorization (RBAC based on user.role and organizationId)
- Rate limiting
- CSRF protection
- XSS prevention (React default escaping)
- Audit logging (already in place)

## Testing Strategy

### Unit Tests

Test individual functions:
- Validation schemas
- API response helpers
- Service functions

### Integration Tests

Test API endpoints:
- Request/response flow
- Database interactions
- Error handling

### E2E Tests (Future)

Test user journeys:
- Create organization → add users → form team
- User login → view dashboard → update preferences

## Deployment Architecture

```
┌──────────────┐
│   Next.js    │  (Container)
│     App      │
└──────┬───────┘
       │
┌──────▼───────┐
│  PostgreSQL  │  (Container)
└──────────────┘

Production: Both run in Docker containers
Dev: Next.js local, PostgreSQL in Docker
```

## Future Enhancements

See `docs/PHASE3_OVERVIEW.md` for detailed Phase 4+ roadmap.

Key areas:
- Real-time collaboration (WebSockets)
- Advanced analytics dashboard
- Plugin system
- Multi-region support
- Advanced RBAC
- API rate limiting
- Webhook system
