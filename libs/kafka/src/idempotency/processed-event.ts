export interface ProcessedEvent {
  eventId: string;
  eventType: string;
  consumer: string;
  processedAt: Date;
}
