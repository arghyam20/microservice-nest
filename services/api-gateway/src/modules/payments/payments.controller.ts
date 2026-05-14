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

@ApiTags("payments")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
@Controller({ path: "payments", version: "1" })
export class PaymentsController {
  constructor(
    @Inject("PAYMENT_SERVICE") private readonly paymentClient: ClientKafka,
    @Inject("ORDER_SERVICE") private readonly orderClient: ClientKafka,
  ) {}

  @Post()
  async create(
    @Req() req: any,
    @Body() body: { orderId: string; method: string },
  ) {
    if (!body.orderId || !body.method) {
      throw new BadRequestException("orderId and method are required");
    }

    const order = await firstValueFrom(
      this.orderClient.send("order.get", { orderId: body.orderId }),
    );
    if (order.userId !== req.user.sub) {
      throw new BadRequestException("Order does not belong to current user");
    }

    return firstValueFrom(
      this.paymentClient.send("payment.create", {
        userId: req.user.sub,
        orderId: body.orderId,
        amount: Number(order.totalAmount),
        method: body.method,
      }),
    );
  }

  @Get()
  findAll() {
    return firstValueFrom(this.paymentClient.send("payment.list", {}));
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return firstValueFrom(
      this.paymentClient.send("payment.get", { paymentId: id }),
    );
  }

  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body() body: { status: string; transactionId?: string },
  ) {
    return firstValueFrom(
      this.paymentClient.send("payment.update-status", {
        paymentId: id,
        ...body,
      }),
    );
  }
}
