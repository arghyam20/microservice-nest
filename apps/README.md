# Applications

This directory is reserved for the incremental NestJS microservice extraction.

The current production code still lives in `src/` and should keep compiling while bounded contexts are moved into:

- `api-gateway`: REST boundary, no ORM
- `user-service`: TypeORM, `user_db`
- `vendor-service`: TypeORM, `user_db`
- `product-service`: TypeORM, `product_db`
- `inventory-service`: Prisma, `inventory_db`
- `booking-service`: Prisma, `booking_db`
- `payment-service`: Prisma, `payment_db`
- `notification-service`: Prisma, `notification_db`
- `review-service`: Prisma, `review_db`

Do not delete or move existing monolith modules until the replacement service has migrations, tests, and compatibility checks.
