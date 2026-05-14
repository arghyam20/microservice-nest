import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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

@ApiTags("cart")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
@Controller({ path: "cart", version: "1" })
export class CartController {
  constructor(
    @Inject("CART_SERVICE") private readonly cartClient: ClientKafka,
    @Inject("MENU_SERVICE") private readonly menuClient: ClientKafka,
  ) {}

  @Post("items")
  async addItem(
    @Req() req: any,
    @Body() body: { menuItemId: string; quantity: number },
  ) {
    if (!body.menuItemId || !body.quantity || body.quantity < 1) {
      throw new BadRequestException(
        "menuItemId and positive quantity are required",
      );
    }

    const menuItem = await firstValueFrom(
      this.menuClient.send("menu-item.get", { menuItemId: body.menuItemId }),
    );
    if (menuItem.status !== "AVAILABLE") {
      throw new BadRequestException("Menu item is not available");
    }

    return firstValueFrom(
      this.cartClient.send("cart.add-item", {
        userId: req.user.sub,
        menuItemId: menuItem.id,
        restaurantId: menuItem.restaurantId,
        quantity: body.quantity,
        unitPrice: Number(menuItem.price),
      }),
    );
  }

  @Get()
  getCart(@Req() req: any) {
    return firstValueFrom(
      this.cartClient.send("cart.get", { userId: req.user.sub }),
    );
  }

  @Patch("items/:id")
  updateItem(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: { quantity: number },
  ) {
    if (!body.quantity || body.quantity < 1) {
      throw new BadRequestException("Positive quantity is required");
    }
    return firstValueFrom(
      this.cartClient.send("cart.update-item", {
        userId: req.user.sub,
        itemId: id,
        quantity: body.quantity,
      }),
    );
  }

  @Delete("items/:id")
  removeItem(@Req() req: any, @Param("id") id: string) {
    return firstValueFrom(
      this.cartClient.send("cart.remove-item", {
        userId: req.user.sub,
        itemId: id,
      }),
    );
  }

  @Delete()
  clearCart(@Req() req: any) {
    return firstValueFrom(
      this.cartClient.send("cart.clear", { userId: req.user.sub }),
    );
  }
}
