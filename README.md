# Online Product Booking Microservice Backend

NestJS backend being migrated from a monolith into a microservice architecture for an online product booking and multi-vendor platform.

## Current State

- Main monolith app remains in `src/` and preserves existing APIs.
- Microservice shells live in `apps/`.
- Shared technical libraries live in `libs/`.
- Infrastructure assets live in `infrastructure/`.
- MySQL and TypeORM are used for existing/inherited relational modules.
- Prisma schemas are used for new workflow-heavy service databases.

## Service Layout

| Service | ORM | Database |
| --- | --- | --- |
| `api-gateway` | none | none |
| `user-service` | TypeORM | `user_db` |
| `vendor-service` | TypeORM | `user_db` |
| `product-service` | TypeORM | `product_db` |
| `inventory-service` | Prisma | `inventory_db` |
| `booking-service` | Prisma | `booking_db` |
| `payment-service` | Prisma | `payment_db` |
| `notification-service` | Prisma | `notification_db` |
| `review-service` | Prisma | `review_db` |

## Existing Monolith APIs

Swagger for the current monolith is exposed at:

```text
/apidoc
```

New service shells expose Swagger at:

```text
/api/docs
```

## Setup

```bash
npm install
cp env.example .env
npm run build
```

## Scripts

```bash
npm run build
npm run build:services
npm run start
npm run start:dev
npm run lint
npm run test
```

## Notes

- Existing endpoints should remain backward compatible during migration.
- Do not move domain logic into shared libraries.
- API Gateway must stay thin and ORM-free.
- User Service and Vendor Service intentionally share `user_db` but own separate tables.
- Other services must not query another service database directly.
