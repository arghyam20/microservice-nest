export interface DomainEventEnvelope<TData = unknown> {
  eventId: string;
  eventType: DomainEventType;
  eventVersion: number;
  occurredAt: string;
  correlationId: string;
  producer: ServiceName;
  data: TData;
}

export type ServiceName =
  | 'api-gateway'
  | 'user-service'
  | 'vendor-service'
  | 'product-service'
  | 'inventory-service'
  | 'booking-service'
  | 'payment-service'
  | 'notification-service'
  | 'review-service';

export type DomainEventType =
  | 'user.created'
  | 'user.updated'
  | 'vendor.created'
  | 'vendor.approved'
  | 'business.created'
  | 'staff.created'
  | 'staff.updated'
  | 'product.created'
  | 'product.updated'
  | 'product.deleted'
  | 'inventory.reserved'
  | 'inventory.reservation.failed'
  | 'inventory.released'
  | 'booking.created'
  | 'booking.confirmed'
  | 'booking.rejected'
  | 'booking.cancelled'
  | 'booking.completed'
  | 'payment.requested'
  | 'payment.completed'
  | 'payment.failed'
  | 'payment.refunded'
  | 'review.created';
