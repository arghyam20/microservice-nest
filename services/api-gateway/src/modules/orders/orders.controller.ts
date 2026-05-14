import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { firstValueFrom } from "rxjs";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";

@ApiTags("orders")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
@Controller({ path: "orders", version: "1" })
export class OrdersController {
  constructor(
    @Inject("ORDER_SERVICE") private readonly orderClient: ClientKafka,
    @Inject("CART_SERVICE") private readonly cartClient: ClientKafka,
  ) {}

  @Post()
  async create(
    @Req() req: any,
    @Body()
    body: { restaurantId: string; deliveryAddress: string; note?: string },
  ) {
    if (!body.restaurantId || !body.deliveryAddress) {
      throw new BadRequestException(
        "restaurantId and deliveryAddress are required",
      );
    }

    const cartItems = await firstValueFrom(
      this.cartClient.send("cart.get", { userId: req.user.sub }),
    );
    const orderItems = cartItems.filter(
      (item: any) => item.restaurantId === body.restaurantId,
    );

    if (!orderItems.length) {
      throw new BadRequestException(
        "Cart does not contain items for this restaurant",
      );
    }

    const order = await firstValueFrom(
      this.orderClient.send("order.create", {
        userId: req.user.sub,
        restaurantId: body.restaurantId,
        deliveryAddress: body.deliveryAddress,
        note: body.note,
        items: orderItems.map((item: any) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
        })),
      }),
    );

    await Promise.all(
      orderItems.map((item: any) =>
        firstValueFrom(
          this.cartClient.send("cart.remove-item", {
            userId: req.user.sub,
            itemId: item.id,
          }),
        ),
      ),
    );

    return order;
  }

  @Get()
  findAll(@Req() req: any) {
    return firstValueFrom(
      this.orderClient.send("order.list", { userId: req.user.sub }),
    );
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return firstValueFrom(this.orderClient.send("order.get", { orderId: id }));
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() body: { status: string }) {
    return firstValueFrom(
      this.orderClient.send("order.update-status", {
        orderId: id,
        status: body.status,
      }),
    );
  }
}
