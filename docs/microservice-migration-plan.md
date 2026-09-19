# Microservice Migration Plan

## Target Services

- `api-gateway`: public REST API, JWT/session validation, request validation, RBAC integration, Swagger, request logging, correlation IDs.
- `user-service`: TypeORM, `user_db`; registration, login, logout, refresh tokens, forgot/reset/change password, profiles, roles, permissions, sessions.
- `vendor-service`: TypeORM, `user_db`; vendor profiles, individual/business vendors, businesses, locations, staff, business roles, business permissions.
- `product-service`: TypeORM, `product_db`; categories, products, variants, SKUs, images, attributes, pricing, vendor/business ownership.
- `inventory-service`: Prisma, `inventory_db`; stock, reservations, releases, adjustments, history, atomic concurrency controls.
- `booking-service`: Prisma, `booking_db`; parent orders, vendor orders, items, snapshots, status transitions, cancellation/completion.
- `payment-service`: Prisma, `payment_db`; payment records, provider verification, webhooks, refunds, allocations, commission, settlement.
- `notification-service`: Prisma, `notification_db`; email/SMS/push, templates, delivery history, async retries.
- `review-service`: Prisma, `review_db`; product/vendor reviews, ratings, eligibility, moderation.

## Database Boundary

- `user-service` and `vendor-service` share `user_db` but own separate tables.
- All other services own one database each and must not query another service database directly.
- The current monolith already has a first MySQL/TypeORM migration layer. Before service extraction, verify the migration scripts against real development data and add data-copy/backfill scripts where MongoDB data still exists.

## Shared Libraries

- `libs/contracts`: event names, DTO contracts, shared enums, event envelope.
- `libs/kafka`: producer/consumer utilities, retry/DLQ helpers, idempotency primitives.
- `libs/config`: typed environment validation helpers.
- `libs/logger`: structured logging and correlation metadata.
- `libs/common`: decorators, guards, filters, interceptors, technical utilities.
- `libs/observability`: health indicators and tracing/correlation helpers.

## Event Envelope

Every domain event should use the same envelope:

```json
{
  "eventId": "uuid",
  "eventType": "booking.created",
  "eventVersion": 1,
  "occurredAt": "ISO_DATE",
  "correlationId": "uuid",
  "producer": "booking-service",
  "data": {}
}
```

## Critical Flows

### Booking Success

1. API Gateway validates the customer session and sends the request to Booking Service.
2. Booking Service creates a parent booking and vendor bookings with product snapshots.
3. Booking Service writes `booking.created` to its transactional outbox in the same local transaction.
4. Outbox publisher emits the event to Kafka.
5. Inventory Service reserves stock atomically and emits `inventory.reserved`.
6. Payment Service creates/verifies payment and emits `payment.completed`.
7. Booking Service confirms the booking and emits `booking.confirmed`.
8. Notification Service sends customer/vendor notifications asynchronously.

### Payment Failure

1. Payment Service emits `payment.failed`.
2. Booking Service marks the affected booking/vendor order as `PAYMENT_FAILED`.
3. Inventory Service releases the reservation.
4. Notification Service sends failure notifications.

### Cancellation

1. Booking Service validates cancellation policy and emits `booking.cancelled`.
2. Payment Service creates an idempotent refund where required.
3. Inventory Service releases reservation/stock.
4. Notification Service sends cancellation notifications.

## Incremental Order

1. Add architecture contracts and infrastructure scaffolding.
2. Add API Gateway shell while leaving existing monolith routes intact.
3. Extract User Service and preserve current auth/user/admin/role/access behavior.
4. Implement explicit `user_sessions` with `sid`, `portal_type`, refresh-token hash, revocation, device metadata.
5. Add Vendor Service and business-context RBAC.
6. Extract Product/Category features.
7. Add Inventory Service with atomic reservation tests.
8. Add Booking Service and multi-vendor order splitting.
9. Add Payment Service with idempotent webhook/refund handling.
10. Add Notification and Review services.
11. Add per-service migrations, Docker health checks, Swagger aggregation, and regression tests.

## Compatibility Notes

- Preserve existing public route names until clients are migrated to `/api/v1/*`.
- Keep response wrappers compatible with the existing `ResponseInterceptor`.
- Do not remove compatibility exports or legacy route behavior until replacement services and migration scripts are verified.
- Current Swagger path `/apidoc` should be kept as an alias while adding `/api/docs` on the gateway.
