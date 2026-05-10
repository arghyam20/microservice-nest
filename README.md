# microservice-nest

NestJS microservice scaffold with TypeORM, JWT access/refresh tokens, role/user/category modules, pagination, file upload, custom decorators, enums, and API versioning. Now includes Kafka integration for event-driven microservices.

## Setup

1. Copy `.env.example` to `.env`
2. Start Kafka (optional, for full microservice testing):
   ```bash
   docker-compose up -d
   ```
   Kafka UI will be available at http://localhost:8080
3. Run `npm install`
4. Start the app with `npm run start:dev`

## API versioning

The API is versioned under `/v1`.

## Microservices & Kafka

This application is a hybrid NestJS app that supports both HTTP REST APIs and Kafka-based microservice communication.

### Kafka Events

The application emits events to Kafka topics:
- `user.created` - When a user is created
- `user.updated` - When a user is updated
- `user.deleted` - When a user is deleted
- `category.created` - When a category is created

### Message Patterns

The application listens to these message patterns:
- `user.get` - Get user by ID
- `user.list` - List users with pagination
- `category.get` - Get category by ID
- `category.list` - List categories with pagination
- `user.created`, `user.updated`, `user.deleted` - Handle user events
- `category.created`, `category.updated` - Handle category events

## Sample endpoints

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `GET /v1/users`
- `POST /v1/users`
- `GET /v1/roles`
- `POST /v1/roles`
- `GET /v1/categories`
- `POST /v1/categories` (protected, accepts `image` file upload)
