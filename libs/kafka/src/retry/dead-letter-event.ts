import { DomainEventEnvelope } from '../../../contracts/src';

export interface DeadLetterEvent<TData = unknown> {
  eventId: string;
  originalTopic: string;
  retryCount: number;
  correlationId: string;
  errorMessage: string;
  failedAt: string;
  payload: DomainEventEnvelope<TData>;
}
