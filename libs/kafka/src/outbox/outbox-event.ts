import { DomainEventEnvelope } from '../../../contracts/src';

export enum OutboxEventStatus {
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  FAILED = 'FAILED',
}

export interface OutboxEvent<TData = unknown> {
  id: string;
  eventId: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: DomainEventEnvelope<TData>;
  status: OutboxEventStatus;
  retryCount: number;
  createdAt: Date;
  publishedAt?: Date | null;
}
