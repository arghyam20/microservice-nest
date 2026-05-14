import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";

const RESPONSE_PATTERNS: Record<string, string[]> = {
  AUTH_SERVICE: [
    "auth.register",
    "auth.login",
    "auth.refresh",
    "auth.logout",
    "auth.validate.token",
  ],
  USER_SERVICE: [
    "user.create",
    "user.list",
    "user.get",
    "user.update",
    "user.delete",
  ],
  RESTAURANT_SERVICE: [
    "restaurant.create",
    "restaurant.list",
    "restaurant.get",
    "restaurant.update",
    "category.create",
    "category.list",
    "category.get",
  ],
  MENU_SERVICE: [
    "menu-item.create",
    "menu-item.list",
    "menu-item.get",
    "menu-item.update",
  ],
  CART_SERVICE: [
    "cart.add-item",
    "cart.get",
    "cart.update-item",
    "cart.remove-item",
    "cart.clear",
  ],
  ORDER_SERVICE: [
    "order.create",
    "order.list",
    "order.get",
    "order.update-status",
  ],
  PAYMENT_SERVICE: [
    "payment.create",
    "payment.list",
    "payment.get",
    "payment.update-status",
  ],
  DELIVERY_SERVICE: [
    "delivery.create",
    "delivery.get",
    "delivery.update-status",
  ],
};

@Injectable()
export class KafkaClientsInitializer implements OnModuleInit {
  constructor(
    @Inject("AUTH_SERVICE") private readonly authClient: ClientKafka,
    @Inject("USER_SERVICE") private readonly userClient: ClientKafka,
    @Inject("RESTAURANT_SERVICE")
    private readonly restaurantClient: ClientKafka,
    @Inject("MENU_SERVICE") private readonly menuClient: ClientKafka,
    @Inject("CART_SERVICE") private readonly cartClient: ClientKafka,
    @Inject("ORDER_SERVICE") private readonly orderClient: ClientKafka,
    @Inject("PAYMENT_SERVICE") private readonly paymentClient: ClientKafka,
    @Inject("DELIVERY_SERVICE") private readonly deliveryClient: ClientKafka,
  ) {}

  async onModuleInit() {
    const clients: Record<string, ClientKafka> = {
      AUTH_SERVICE: this.authClient,
      USER_SERVICE: this.userClient,
      RESTAURANT_SERVICE: this.restaurantClient,
      MENU_SERVICE: this.menuClient,
      CART_SERVICE: this.cartClient,
      ORDER_SERVICE: this.orderClient,
      PAYMENT_SERVICE: this.paymentClient,
      DELIVERY_SERVICE: this.deliveryClient,
    };

    Object.entries(clients).forEach(([name, client]) => {
      RESPONSE_PATTERNS[name].forEach((pattern) =>
        client.subscribeToResponseOf(pattern),
      );
    });

    await Promise.all(Object.values(clients).map((client) => client.connect()));
  }
}
