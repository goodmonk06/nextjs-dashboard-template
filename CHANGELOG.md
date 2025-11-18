# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.0] - 2025-11-18

### Added - Phase 3: Deep Expansion

#### Domain Model
- **Organizations** - Multi-tenant organization support with plans and settings
- **Activity Logs** - Comprehensive audit trail for all system activities
- **User Preferences** - Per-user customization (theme, language, notifications)
- **Teams** - User grouping within organizations with team members
- **Enhanced User Model** - Added organizationId, avatarUrl, lastLoginAt fields

#### API Endpoints
- `GET/POST /api/organizations` - Organization CRUD
- `GET/PATCH/DELETE /api/organizations/:id` - Organization management
- `GET /api/activity-logs` - Activity log listing with filtering
- `GET/PATCH /api/preferences/:userId` - User preferences management

#### Infrastructure
- **Event System** - Domain events with type-safe event bus
- **Logger Utility** - Structured logging with context
- **Metrics Adapter** - In-memory metrics collection (counter, gauge, histogram)
- **Notification Adapter** - Pluggable notification system (console implementation)
- **Activity Service** - Automatic activity logging for all changes

#### Frontend
- **Organizations Page** (`/organizations`) - Org listing with stats
- **Activity Logs Page** (`/activity`) - Audit trail viewer
- **Updated Navigation** - Added Organizations and Activity links to sidebar

#### Developer Experience
- **Rich Seed Data** - 3 organizations, 8 users, 4 teams, 20+ activity logs
- **Enhanced Types** - Complete TypeScript types for all entities
- **Validation Schemas** - Zod schemas for organizations, preferences, teams

#### Documentation
- `docs/PHASE3_OVERVIEW.md` - Phase 3 goals and implementation plan
- Enhanced README with Phase 3 features

### Changed - Breaking Changes

#### API Response Format
- Changed user list response from `{ data: { users: [...] } }` to `{ data: { items: [...] } }`
- This affects `/api/users` endpoint - update frontend code accordingly

#### Database Schema
- Added `organizationId` foreign key to User model (nullable)
- Users can now belong to organizations
- Migration required: `npm run db:push` or `npm run db:migrate`

### Technical Details

#### New Dependencies
- No new npm dependencies (all features built with existing stack)

#### Database Tables
- `organizations` - Organization master table
- `user_preferences` - User-specific settings
- `teams` - Team definitions
- `team_members` - Team membership with roles
- `activity_logs` - Audit trail events

#### Extensibility Points
- `INotificationAdapter` - Swap notification provider
- `IMetricsAdapter` - Integrate metrics backend
- Event handlers via `eventBus.on()` - React to domain events

## [2.0.0] - 2025-11-18

### Added - Phase 2: Full-Stack Foundation
- Prisma ORM with PostgreSQL integration
- User CRUD API with Zod validation
- Docker containerization
- Vitest test suite
- Database seeding
- Activity logging service

## [1.0.0] - 2025-11-18

### Added - Phase 1: Initial Scaffold
- Next.js 15 with App Router
- TypeScript + Tailwind CSS
- Dashboard layout with sidebar
- Three example pages (Overview, Users, Settings)
- ESLint + Prettier configuration
