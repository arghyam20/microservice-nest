# Mixed ORM Strategy

The microservice architecture intentionally supports both TypeORM and Prisma.

## TypeORM Services

Use TypeORM where the service owns or inherits existing relational entities from the current monolith:

- `user-service`: `user_db`
- `vendor-service`: `user_db`
- `product-service`: `product_db`

Reasoning:

- Existing code already uses TypeORM entities and repositories.
- User and vendor must share `user_db` while preserving table ownership.
- Product Service inherits current category functionality.

## Prisma Services

Use Prisma for new workflow-heavy services:

- `inventory-service`: `inventory_db`
- `booking-service`: `booking_db`
- `payment-service`: `payment_db`
- `notification-service`: `notification_db`
- `review-service`: `review_db`

Reasoning:

- These are new bounded contexts with independent schemas.
- Prisma schemas make reservation, booking, payment, notification, and review models explicit per service.
- Each service can generate and migrate its own client independently once the runtime migration workflow is finalized.

## Boundary Rules

- Do not mix TypeORM and Prisma inside the same service unless there is a documented migration window.
- Do not directly query another service database.
- Keep ORM-specific helpers technical only; domain behavior belongs inside the owning service.
- API Gateway must remain ORM-free.
