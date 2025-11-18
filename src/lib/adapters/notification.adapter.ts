import { logger } from "../logger";

export interface NotificationPayload {
  to: string | string[];
  subject?: string;
  message: string;
  data?: Record<string, any>;
  channel?: "email" | "push" | "sms";
}

export interface INotificationAdapter {
  send(payload: NotificationPayload): Promise<void>;
  sendBatch(payloads: NotificationPayload[]): Promise<void>;
}

// In-memory/console implementation for now
export class ConsoleNotificationAdapter implements INotificationAdapter {
  async send(payload: NotificationPayload): Promise<void> {
    logger.info("Sending notification", {
      channel: payload.channel || "email",
      to: Array.isArray(payload.to) ? payload.to.length : 1,
      subject: payload.subject,
    });

    // In a real implementation, this would call an email service, push service, etc.
    console.log("📧 Notification:", payload);
  }

  async sendBatch(payloads: NotificationPayload[]): Promise<void> {
    logger.info("Sending batch notifications", {
      count: payloads.length,
    });

    for (const payload of payloads) {
      await this.send(payload);
    }
  }
}

// Singleton instance
export const notificationAdapter: INotificationAdapter =
  new ConsoleNotificationAdapter();
