# Current System Inventory

This inventory was created from the existing NestJS codebase before continuing the microservice migration. The current application is still a NestJS 11 monolith, but it has already been partially migrated from MongoDB/Mongoose to MySQL/TypeORM. Several folders still use `schemas` naming for compatibility, while the classes inside are TypeORM `@Entity()` models.

## Runtime And Configuration

- NestJS: `^11.0.1`
- Node.js: README recommends Node.js 20+
- Database: MySQL via `@nestjs/typeorm` in runtime configuration
- Migration tooling: `src/data-source.ts`, `src/create-database.ts`, and `src/migrations/*`
- Authentication: JWT access tokens plus refresh-token documents
- Authorization: role-based access control using role groups and per-access permissions
- Swagger: exposed at `/apidoc`
- API versioning: URI versioning enabled, but most controllers are not explicitly version-prefixed
- Queues: no queue processor is currently wired in the maintained app
- Logging: Nest `Logger` plus custom Winston logger helper
- Security: Helmet, CORS, global validation pipe, exception filter, response interceptor, throttling

## Existing Modules

| Module | Responsibility | Controllers | Tables / Collections | Auth | Classification | Target Service |
| --- | --- | --- | --- | --- | --- | --- |
| `auth` | Login, logout, forgot/reset password, access-token refresh | `auth` | `refreshTokens`, `user_devices`, `users` | Mixed public/JWT | REFACTOR | User Service + API Gateway |
| `user` | User profile, settings, admin CRUD, password changes | `user`, `admin/user` | `users` | JWT/RBAC | MOVE | User Service |
| `admin` | Admin profile/dashboard/password flows | `admin` | `users` | JWT/RBAC | MOVE | User Service |
| `role` | Admin role CRUD and permission assignment | `admin/role` | `roles` | JWT/RBAC | MOVE | User Service |
| `access` | Access/permission catalog | `admin/access` | `accesses` | JWT/RBAC | MOVE | User Service |
| `refresh-token` | Refresh-token repository/schema | none | `refreshTokens` | Internal | REFACTOR | User Service |
| `user-devices` | Device/session/access-token tracking | none | `user_devices` | Internal | REFACTOR | User Service |
| `category` | Admin category CRUD and public category listing | `admin/category`, `category` | `categories` | Admin JWT for writes | MOVE | Product Service |
| `media` | Single/multiple uploads and delete | `admin/media`, `media` | `media` | Mixed | SPLIT | API Gateway + owning services |
| `notification` | Notification listing, mark-read, delete | `notification`, `admin/notification` | `notifications` | JWT/RBAC | MOVE | Notification Service |
| `cms` | CMS page admin management | `admin/cms` | `cms` | JWT/RBAC | KEEP/REFACTOR | API Gateway or Content Service later |
| `setting` | Admin settings get/update | `admin/setting` | `settings` | Admin JWT | KEEP/REFACTOR | API Gateway or Config/Admin Service later |
| `contact-us` | Contact form admin listing/reply/delete | `admin/contact-us` | `contact_us`, `admin_replies` | Admin JWT | KEEP/REFACTOR | Notification/Admin boundary |
| `admin-reply` | Repository/schema for admin replies | none | `admin_replies` | Internal | KEEP/REFACTOR | Notification/Admin boundary |
| `seeder` | Seed initial roles/admin data | none | multiple | Internal | REFACTOR | Per-service seeds/migrations |
| `helpers` | Mail, push, export, file, utility, queue helpers | none | external SMTP/files | Internal | SPLIT | Shared technical libs plus services |

## Missing Business Domains

The requested platform domains below were not found in the current source tree and should be introduced incrementally:

- Vendor profiles, individual vendors, businesses, business locations, staff, business-context RBAC
- Products, variants, SKUs, product images, product attributes, vendor products
- Inventory, reservations, stock adjustments, reservation release/history
- Booking/order, vendor-order splitting, booking lifecycle/history, product snapshots
- Payment transactions, provider webhook idempotency, refunds, commission, settlement
- Reviews and review eligibility
- Kafka producers/consumers, transactional outbox, processed-event store, retry/DLQ handling
- Service-level Docker Compose entries for API Gateway and domain services

## Important Current Coupling

- Authentication and session logic is coupled to `users`, `refreshTokens`, and `user_devices`.
- Current refresh-token implementation hashes part of the access token with a generated salt; migration should replace this with explicit session IDs and refresh-token hashes.
- Current RBAC is global role-group based. Business staff authorization must be added separately and must include business membership checks.
- Category is currently a standalone module but belongs in the Product Service target boundary.
- Notifications are currently query-oriented records; event-driven delivery/retry behavior needs to be added in the target Notification Service.
- `package.json` must declare the TypeORM/MySQL runtime dependencies used by the code.

## First Migration Slice

1. Keep the monolith compiling and preserve existing endpoints.
2. Introduce shared contracts, event envelope, outbox, idempotency, and Docker infrastructure.
3. Extract User Service first because it owns auth/session/RBAC and provides the identity boundary for Vendor Service.
4. Add multi-session support before any portal-specific customer/vendor flows are exposed.
5. Introduce Vendor Service tables and business-context RBAC next.
6. Move Category into Product Service only after API compatibility tests exist.
