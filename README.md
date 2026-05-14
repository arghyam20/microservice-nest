# microservice-nest

NestJS food ordering platform split into 10 independent microservices communicating via Kafka.

## Architecture

```
                        ┌─────────────────┐
                        │   API Gateway   │  :3000 (HTTP + Swagger)
                        │  /v1/* routes   │
                        └────────┬────────┘
                                 │ Kafka (send/receive)
          ┌──────────────────────┼──────────────────────┐
          │          │           │           │           │
   ┌──────▼──┐ ┌─────▼───┐ ┌────▼────┐ ┌───▼────┐ ┌────▼────┐
   │  Auth   │ │  User   │ │Restaurant│ │  Menu  │ │  Cart   │
   │ Service │ │ Service │ │ Service  │ │Service │ │ Service │
   └─────────┘ └─────────┘ └──────────┘ └────────┘ └─────────┘
          │          │           │           │           │
          └──────────┴───────────┴───────────┴───────────┘
                                 │ Kafka (events)
          ┌──────────────────────┼──────────────────────┐
          │          │           │           │           │
   ┌──────▼──┐ ┌─────▼───┐ ┌────▼────┐ ┌───▼──────────▼──┐
   │  Order  │ │ Payment │ │Delivery │ │  Notification    │
   │ Service │ │ Service │ │ Service │ │     Service      │
   └─────────┘ └─────────┘ └─────────┘ └──────────────────┘
```

## Services

| Service | Port | Kafka Group | Responsibility |
|---|---|---|---|
| api-gateway | 3000 | — | HTTP entry point, routes to all services |
| auth-service | — | auth-service-group | JWT register/login/refresh/logout/validate |
| user-service | — | user-service-group | User CRUD |
| restaurant-service | — | restaurant-service-group | Restaurants + Categories |
| menu-service | — | menu-service-group | Menu items |
| cart-service | — | cart-service-group | Shopping cart |
| order-service | — | order-service-group | Order creation + status |
| payment-service | — | payment-service-group | Payment processing |
| notification-service | — | notification-service-group | Email/SMS/push notifications |
| delivery-service | — | delivery-service-group | Delivery tracking |

## Kafka Topics

### Request-Reply (MessagePattern)
- `auth.register` / `auth.login` / `auth.refresh` / `auth.logout` / `auth.validate.token`
- `user.create` / `user.get` / `user.list` / `user.update` / `user.delete`
- `restaurant.create` / `restaurant.get` / `restaurant.list` / `restaurant.update`
- `category.create` / `category.get` / `category.list`
- `menu-item.create` / `menu-item.get` / `menu-item.list` / `menu-item.update`
- `cart.add-item` / `cart.get` / `cart.update-item` / `cart.remove-item` / `cart.clear`
- `order.create` / `order.get` / `order.list` / `order.update-status`
- `payment.create` / `payment.get` / `payment.list` / `payment.update-status`
- `delivery.create` / `delivery.get` / `delivery.update-status`
- `notification.send`

### Fire-and-Forget (EventPattern)
- `user.created` / `user.updated` / `user.deleted`
- `restaurant.created` / `restaurant.updated`
- `category.created`
- `menu-item.created` / `menu-item.updated`
- `order.created` / `order.status.updated`
- `payment.created` / `payment.status.updated`
- `delivery.status.updated`

## Event-Driven Flows

- `order.status.updated` → **delivery-service** auto-creates delivery when status = `CONFIRMED`
- `order.created` → **notification-service** sends ORDER_PLACED notification
- `order.status.updated` → **notification-service** sends status update notification
- `payment.status.updated` → **notification-service** sends PAYMENT_SUCCESS/FAILED notification

## Setup

### Run with Docker (recommended)
```bash
docker-compose up -d
```
- API Gateway: http://localhost:3000/v1
- Swagger UI: http://localhost:3000/api
- Kafka UI: http://localhost:8080

### Run individually (dev)
Each service has its own `src/main.ts`. Copy `services/package.json.template` to each service folder as `package.json`, update the `name` field, then:
```bash
cd services/<service-name>
npm install
npm run start:dev
```

## API Endpoints (via Gateway)

- `POST /v1/auth/register`
- `POST /v1/auth/login`
- `POST /v1/auth/refresh`
- `POST /v1/auth/logout`
- `GET /v1/users` (protected)
- `POST /v1/users` (protected)
- `GET /v1/restaurants`
- `POST /v1/restaurants` (protected)
- `GET /v1/categories`
- `POST /v1/categories` (protected)
- `GET /v1/menu-items?restaurantId=<id>`
- `POST /v1/menu-items` (protected)
- `GET /v1/cart` (protected)
- `POST /v1/cart/items` (protected)
- `POST /v1/orders` (protected)
- `PATCH /v1/orders/:id/status` (protected)
- `POST /v1/payments` (protected)
- `PATCH /v1/payments/:id/status` (protected)
- `GET /v1/delivery/:id` (protected)
- `PATCH /v1/delivery/:id/status` (protected)
